// my-file-upload-app/screens/FileViewer.js

/**
 * Componente da Tela de Visualização de Arquivos (FileViewerScreen - View)
 *
 * Esta é a View da arquitetura MVVM para a tela de visualização de arquivos.
 * Ela é responsável por renderizar a lista de arquivos, o botão de upload,
 * e o botão de sincronização. Ela consome o FileViewerViewModel para obter
 * os dados (lista de arquivos) e disparar ações (adicionar/sincronizar).
 *
 * Ponto MVVM: Esta é a View. Ela acessa `files`, `addFile` e `synchronizeAllFiles`
 * do ViewModel e os utiliza para renderizar a UI e responder a interações.
 *
 * Dependências:
 * - react-native: Para View, Text, FlatList, StyleSheet, TouchableOpacity.
 * - @expo/vector-icons: Para ícones.
 * - ../components/UploadButton: Componente reutilizável de UI.
 * - ../components/FileItem: Componente reutilizável de UI.
 * - ../viewmodels/FileViewerViewModel: Importa o ViewModel.
 *
 * Quem o chama: App.js (através do Stack Navigator).
 * Quem ele chama: UploadButton.js, FileItem.js, useFileViewerViewModel.
 * Necessita de pacotes: '@expo/vector-icons'
 */



// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native'; // Bruno, goBack button
// import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import FileItem from '../components/FileItem';
// import UploadButton from '../components/UploadButton';
// import { useFileViewerViewModel } from '../viewmodels/FileViewerViewModel'; // Importa o ViewModel

// export default function FileViewerScreen() {
//   // Ponto MVVM: Obtenção do ViewModel. A View se "inscreve" nos dados e lógica
//   // fornecidos pelo ViewModel.
//   const { files, addFile, synchronizeAllFiles } = useFileViewerViewModel();

//   const navigation = useNavigation(); // // Bruno, goBack button

//   // A função renderItem é uma responsabilidade da View (como renderizar cada item).
//   const renderItem = ({ item }) => (
//     <FileItem file={item} />
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>


//         <Button title="Voltar" onPress={() => navigation.goBack()} />



//         <Text style={styles.title}>Meus Arquivos</Text>
//         <TouchableOpacity onPress={synchronizeAllFiles} style={styles.syncButton}>
//           <MaterialCommunityIcons name="cloud-upload" size={24} color="#fff" />
//           <Text style={styles.syncButtonText}>Sincronizar Todos</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={files} // Ponto MVVM: A View renderiza os 'files' que vêm do ViewModel.
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum arquivo ainda. Adicione um!</Text>}
//       />

//       {/* Ponto MVVM: O UploadButton dispara um evento que o ViewModel (via 'addFile') processa. */}
//       <UploadButton onUploadComplete={addFile} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     paddingTop: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   syncButton: {
//     flexDirection: 'row',
//     backgroundColor: '#4CAF50',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     alignItems: 'center',
//   },
//   syncButtonText: {
//     color: '#fff',
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   listContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 100,
//   },
//   emptyListText: {
//     textAlign: 'center',
//     marginTop: 50,
//     fontSize: 16,
//     color: '#777',
//   },
// });



//  NOVA ALTERAÇÃO DO ARQUIVO 

// my-file-upload-app/screens/FileViewer.js

/**
 * Componente da Tela de Visualização de Arquivos (FileViewerScreen - View)
 *
 * Esta é a View da arquitetura MVVM para a tela de visualização de arquivos.
 * Ela é responsável por renderizar a lista de arquivos, o botão de upload,
 * e o botão de sincronização. Ela consome o FileViewerViewModel para obter
 * os dados (lista de arquivos, estado de carregamento) e disparar ações
 * (adicionar/sincronizar).
 *
 * Ponto MVVM: Esta é a View. Ela acessa `files`, `loading`, `addFile` e
 * `synchronizeAllFiles` do ViewModel e os utiliza para renderizar a UI e
 * responder a interações.
 *
 * Dependências:
 * - react-native: Para View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator.
 * - @expo/vector-icons: Para ícones.
 * - ../components/UploadButton: Componente reutilizável de UI.
 * - ../components/FileItem: Componente reutilizável de UI.
 * - ../viewmodels/FileViewerViewModel: Importa o ViewModel.
 *
 * Quem o chama: App.js (através do Stack Navigator).
 * Quem ele chama: UploadButton.js, FileItem.js, useFileViewerViewModel.
 * Necessita de pacotes: '@expo/vector-icons', 'firebase'
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FileItem from '../components/FileItem';
import UploadButton from '../components/UploadButton';
import { useFileViewerViewModel } from '../viewmodels/FileViewerViewModel';


import { useNavigation } from '@react-navigation/native'; // Bruno, goBack button


export default function FileViewerScreen() {
  // Ponto MVVM: Obtenção do ViewModel. A View se "inscreve" nos dados e lógica
  // fornecidos pelo ViewModel.
  const { files, loading, addFile, synchronizeAllFiles } = useFileViewerViewModel();

    const navigation = useNavigation(); // Bruno, goBack button:

  const renderItem = ({ item }) => (
    <FileItem file={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <Button title="Voltar" onPress={() => navigation.goBack()} />

        <Text style={styles.title}>Meus Arquivos</Text>
        <TouchableOpacity onPress={synchronizeAllFiles} style={styles.syncButton} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <MaterialCommunityIcons name="cloud-sync" size={24} color="#fff" /> // Ícone de sincronização
          )}
          <Text style={styles.syncButtonText}>
            {loading ? 'Carregando...' : 'Sincronizar'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Carregando arquivos...</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum arquivo ainda. Adicione um!</Text>}
        />
      )}

      <UploadButton onUploadComplete={addFile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  syncButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  syncButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});




