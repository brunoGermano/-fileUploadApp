// my-file-upload-app/firebaseConfig.js

/**
 * Configuração do Firebase para o Aplicativo.
 *
 * Este arquivo inicializa o Firebase e exporta as instâncias necessárias
 * (como Storage) para serem usadas em outras partes do aplicativo.
 *
 * Ponto MVVM: Embora não seja parte direta do MVVM, esta é uma camada de "Serviço"
 * que o ViewModel (FileViewerViewModel) consumirá para interagir com o backend.
 *
 * Dependências:
 * - firebase: Biblioteca oficial do Firebase.
 *
 * Quem o chama: Principalmente viewmodels/FileViewerViewModel.js
 * Quem ele chama: N/A (apenas inicializa o SDK do Firebase).
 * Necessita de pacote: 'firebase'
 */

import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';

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

// Obtém uma instância do Firebase Storage
const storage = getStorage(app);

export {
    getDownloadURL,
    listAll, ref, storage, uploadBytes
};

