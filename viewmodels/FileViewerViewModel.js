// my-file-upload-app/viewmodels/FileViewerViewModel.js

/**
 * ViewModel da Tela de Visualização de Arquivos (FileViewerViewModel.js)
 *
 * Este ViewModel gerencia o estado e a lógica de negócio para a Tela de Visualização de Arquivos.
 * Ele abstrai a manipulação da lista de arquivos, o processo de adicionar novos arquivos,
 * e a lógica de sincronização (marcar como 'uploaded'), incluindo a interação com o Firebase Storage.
 * AGORA: Os arquivos são específicos do usuário logado e carregados de forma mais controlada.
 *
 * Ponto MVVM: Este é o ViewModel central para a funcionalidade de arquivos.
 * Ele gerencia o estado `files` e as funções que o modificam, interage com o "Model"
 * de armazenamento (Firebase) e agora depende do usuário logado do AuthContext.
 *
 * Dependências:
 * - react: Para o useState, useEffect.
 * - react-native: Para Alert.
 * - ../firebaseConfig: Para importar as funções e a instância do Firebase Storage.
 * - ../contexts/AuthContext: Para obter o usuário logado.
 *
 * Quem o chama: FileViewerScreen (a View).
 * Quem ele chama: Firebase Storage SDK (via firebaseConfig.js), useAuth.
 * Necessita de pacote: 'firebase'
 */

import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  storage,
  uploadBytes
} from '../firebaseConfig';

export const useFileViewerViewModel = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true); // Manteremos o loading para sincronização e upload
  const { user } = useAuth();

  // Função para carregar os arquivos do Firebase Storage (usada para carga inicial e sincronização)
  const loadFilesFromFirebase = async () => {
    if (!user) {
      setFiles([]);
      setLoading(false);
      return;
    }

    // Só definimos loading como true aqui se não for um upload
    // se o loading já for true (ex: vindo de um upload), mantemos
    if (!loading) {
      setLoading(true);
    }
    
    try {
      const listRef = ref(storage, `uploads/${user.uid}/`);
      const res = await listAll(listRef);

      const loadedFiles = await Promise.all(
        res.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          const fileName = itemRef.name;
          const fileType = fileName.includes('.pdf') ? 'pdf' : 'image';

          return {
            id: itemRef.fullPath,
            name: fileName,
            uri: downloadURL,
            type: fileType,
            uploaded: true,
          };
        })
      );
      setFiles(loadedFiles);
    } catch (error) {
      console.error("Erro ao carregar arquivos do Firebase:", error);
      Alert.alert("Erro", "Não foi possível carregar os arquivos do Firebase.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega os arquivos apenas uma vez quando o usuário loga (ou quando o componente é montado a primeira vez com user logado)
  // e não toda vez que a tela é focada novamente.
  useEffect(() => {
    // Apenas carrega se houver um usuário e a lista de arquivos estiver vazia, ou se o usuário mudou
    // isso evita recarregar se a lista já estiver populada e o usuário não mudou.
    if (user && files.length === 0) {
      loadFilesFromFirebase();
    } else if (!user) {
      setFiles([]); // Limpa os arquivos se o usuário deslogar
    }
  }, [user]); // Continua dependendo de 'user' para carregar quando o login é feito/alterado

  // Lógica para adicionar um novo arquivo e fazer upload para o Firebase
  const addFile = async (localFileUri, fileType, customFileName = null) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para enviar arquivos.');
      return;
    }

    setLoading(true); // Inicia o loader para o upload
    try {
      const response = await fetch(localFileUri);
      const blob = await response.blob();

      let fileName = customFileName || `${Date.now()}_${Math.random().toString(36).substring(7)}`;
      if (!fileName.includes('.')) {
        fileName += `.${fileType === 'image' ? 'jpg' : 'pdf'}`;
      } else if (fileType === 'image' && !fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
          fileName += '.jpg';
      } else if (fileType === 'pdf' && !fileName.toLowerCase().endsWith('.pdf')) {
          fileName += '.pdf';
      }

      const storageRef = ref(storage, `uploads/${user.uid}/${fileName}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const newFile = {
        id: storageRef.fullPath,
        name: fileName,
        uri: downloadURL,
        type: fileType,
        uploaded: true,
      };

      // Adiciona o novo arquivo localmente e recarrega para garantir consistência
      setFiles(prevFiles => [...prevFiles, newFile]);
      // OPCIONAL: Você pode chamar loadFilesFromFirebase() aqui para garantir que a lista esteja 100% sincronizada com o Firebase após o upload,
      // mas isso faria outra requisição. Para otimização, só adicionamos localmente.
      // Se preferir a consistência imediata com o Firebase, descomente a linha abaixo:
      // await loadFilesFromFirebase();

      Alert.alert('Sucesso', 'Arquivo enviado e adicionado à lista!');

    } catch (error) {
      console.error("Erro ao enviar arquivo para o Firebase:", error);
      Alert.alert('Erro', 'Não foi possível enviar o arquivo. Tente novamente.');
    } finally {
      setLoading(false); // Desativa o loader
    }
  };

  // Lógica para sincronizar (recarregar) todos os arquivos do Firebase
  const synchronizeAllFiles = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para sincronizar.');
      return;
    }
    Alert.alert('Sincronizando', 'Buscando a lista mais recente de arquivos do Firebase...');
    await loadFilesFromFirebase(); // Força a recarga do Firebase
    Alert.alert('Sincronização Concluída', 'Lista de arquivos atualizada!');
  };

  // Lógica para deletar um arquivo.
  const deleteFile = async (fileId) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para deletar arquivos.');
      return;
    }
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este arquivo? Esta ação é irreversível.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            setLoading(true); // Loader para a exclusão
            try {
              const fileRef = ref(storage, fileId);
              await deleteObject(fileRef);

              setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
              Alert.alert("Sucesso", "Arquivo excluído com sucesso!");
            } catch (error) {
              console.error("Erro ao deletar arquivo:", error);
              Alert.alert("Erro", "Não foi possível excluir o arquivo.");
            } finally {
              setLoading(false); // Desativa o loader
            }
          },
        },
      ]
    );
  };

  // Lógica para renomear um arquivo.
  const renameFile = async (fileId, newName) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para renomear arquivos.');
      return;
    }
    if (!newName || newName.trim() === '') {
        Alert.alert('Erro', 'O novo nome não pode ser vazio.');
        return;
    }

    setLoading(true); // Loader para a renomeação
    try {
      const oldFileRef = ref(storage, fileId);
      const oldDownloadURL = await getDownloadURL(oldFileRef);

      const oldFile = files.find(f => f.id === fileId);
      const fileType = oldFile ? oldFile.type : (newName.includes('.pdf') ? 'pdf' : 'image');

      let finalNewName = newName;
      if (!finalNewName.includes('.')) {
        finalNewName += `.${fileType === 'image' ? 'jpg' : 'pdf'}`;
      } else if (fileType === 'image' && !finalNewName.match(/\.(jpg|jpeg|png|gif)$/i)) {
          finalNewName += '.jpg';
      } else if (fileType === 'pdf' && !finalNewName.toLowerCase().endsWith('.pdf')) {
          finalNewName += '.pdf';
      }

      const newFileRef = ref(storage, `uploads/${user.uid}/${finalNewName}`);

      const response = await fetch(oldDownloadURL);
      const blob = await response.blob();

      await uploadBytes(newFileRef, blob);
      await deleteObject(oldFileRef);

      // Atualiza a lista localmente para refletir a mudança
      setFiles(prevFiles => {
        const updatedFiles = prevFiles.filter(file => file.id !== fileId);
        const newFile = {
            id: newFileRef.fullPath,
            name: finalNewName,
            uri: oldDownloadURL, // A URI pode ser a antiga por enquanto, ou buscar a nova se for crucial
            type: fileType,
            uploaded: true,
        };
        return [...updatedFiles, newFile];
      });

      // OPCIONAL: Chame loadFilesFromFirebase() se quiser garantir a consistência total com o Firebase
      // await loadFilesFromFirebase();

      Alert.alert("Sucesso", "Arquivo renomeado com sucesso!");

    } catch (error) {
      console.error("Erro ao renomear arquivo:", error);
      Alert.alert("Erro", "Não foi possível renomear o arquivo.");
    } finally {
      setLoading(false); // Desativa o loader
    }
  };

  return {
    files,
    loading,
    addFile,
    synchronizeAllFiles,
    deleteFile,
    renameFile,
  };
};