import { FIREBASE_CONFIG, FIREBASE_OK } from "./firebase-config.js";

let cache = null;
export function obterBackend() {
  if (!cache) {
    cache = FIREBASE_OK
      ? import("./backend-firebase.js").then((m) => m.criarFirebase(FIREBASE_CONFIG))
      : import("./backend-mock.js").then((m) => m.criarMock());
  }
  return cache;
}
