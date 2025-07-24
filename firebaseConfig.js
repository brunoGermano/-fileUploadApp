// my-file-upload-app/firebaseConfig.js

/**
 * Configuração do Firebase para o Aplicativo.
 *
 * Este arquivo inicializa o Firebase e exporta as instâncias necessárias
 * (como Storage e Auth) para serem usadas em outras partes do aplicativo.
 *
 * Ponto MVVM: Este é um serviço que os ViewModels irão consumir.
 *
 * Dependências:
 * - firebase: Biblioteca oficial do Firebase.
 *
 * Quem o chama: Principalmente viewmodels/FileViewerViewModel.js e AuthViewModel.js (novo).
 * Quem ele chama: N/A (apenas inicializa o SDK do Firebase).
 * Necessita de pacote: 'firebase'
 */

import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'; // NOVO: Módulo de Autenticação
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage'; // Adicionado deleteObject

// Suas credenciais do Firebase (substitua pelos seus próprios valores!)
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"

// };

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATi-tvmws6_duV07Dr9DtLNcsKx8O-P1A",
  authDomain: "fileuploadapp-c21cf.firebaseapp.com",
  projectId: "fileuploadapp-c21cf",
  storageBucket: "fileuploadapp-c21cf.firebasestorage.app",
  messagingSenderId: "901547150230",
  appId: "1:901547150230:web:693f2cd0620cf73f16abb7"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obtém instâncias dos serviços
const storage = getStorage(app); // Obtém uma instância do Firebase Storage
const auth = getAuth(app); // NOVO: Instância do Auth

export {
  auth, // NOVO: Exporta a instância do Auth
  createUserWithEmailAndPassword, deleteObject, getDownloadURL,
  listAll, onAuthStateChanged, ref, // NOVO: Funções de autenticação
  signInWithEmailAndPassword,
  signOut, storage, uploadBytes
};
