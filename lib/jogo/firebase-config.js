// Configuração do app web do Firebase (projeto movimento-leao).
// Estes dados do app web são públicos por natureza: a segurança fica nas regras do Firestore.
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCtzmccqq8l_XOdGqa2SW_vCu3dYv-V53I",
  authDomain: "movimento-leao.firebaseapp.com",
  projectId: "movimento-leao",
  appId: "1:463912895883:web:109228383479ab6a049b8e",
};
export const FIREBASE_OK = !FIREBASE_CONFIG.apiKey.startsWith("COLE");
