// Servidor do jogo no Firebase (Authentication anônimo + Firestore). Sem senha: o "dono" do nick
// é a identidade anônima do navegador, e as regras (firestore.rules) impedem que outro a use.
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, runTransaction,
  collection, query, where, getDocs, onSnapshot, limit,
} from "firebase/firestore";

const pad = (n) => String(n).padStart(6, "0");

export async function criarFirebase(cfg) {
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = await new Promise((res, rej) => {
    const un = onAuthStateChanged(auth, async (u) => {
      un();
      if (u) return res(u);
      try { res((await signInAnonymously(auth)).user); } catch (e) { rej(e); }
    });
  });
  const uid = user.uid;

  return {
    demo: false,
    uid,
    async me() {
      const u = await getDoc(doc(db, "users", uid));
      if (!u.exists()) return null;
      const p = await getDoc(doc(db, "players", u.data().key));
      return p.exists() ? { ...p.data(), chave: u.data().key } : null;
    },
    async registrar({ nick, chave }, jogador) {
      const pr = doc(db, "players", chave), ur = doc(db, "users", uid);
      const dados = { ...jogador, uid, nick };
      await runTransaction(db, async (tx) => {
        const [ps, us] = await Promise.all([tx.get(pr), tx.get(ur)]);
        if (ps.exists()) throw new Error("NICK_EM_USO");
        if (us.exists()) throw new Error("JA_TEM_CONTA");
        tx.set(pr, dados);
        tx.set(ur, { key: chave });
      });
      return { ...dados, chave };
    },
    async salvar(p) {
      await updateDoc(doc(db, "players", p.chave), { unlocked: p.unlocked, done: p.done, stats: p.stats });
    },
    entrarFila(player, time, onMatch) {
      const size = time.length; let parado = false; let ocupado = false;
      const minha = doc(db, "queue", uid);
      setDoc(minha, { uid, nick: player.nick, time, size, status: "waiting", matchId: null, beat: Date.now(), criado: Date.now() });
      const un = onSnapshot(minha, (s) => {
        const d = s.data();
        if (d && d.matchId && !parado) { parado = true; clearInterval(iv); un(); deleteDoc(minha).catch(() => {}); onMatch(d.matchId); }
      });
      const volta = async () => {
        if (parado || ocupado) return;
        ocupado = true;
        try {
          updateDoc(minha, { beat: Date.now() }).catch(() => {});
          const r = await getDocs(query(collection(db, "queue"), where("size", "==", size), where("status", "==", "waiting"), limit(10)));
          const cand = r.docs.map((x) => x.data()).filter((q) => q.uid !== uid && Date.now() - q.beat < 15000).sort((a, b) => a.criado - b.criado)[0];
          if (!cand || parado) return;
          const mid = doc(collection(db, "matches")).id;
          const dela = doc(db, "queue", cand.uid);
          await runTransaction(db, async (tx) => {
            const [o, m] = await Promise.all([tx.get(dela), tx.get(minha)]);
            if (!o.exists() || !m.exists() || o.data().status !== "waiting" || m.data().status !== "waiting") throw new Error("OCUPADO");
            tx.set(doc(db, "matches", mid), {
              a: { uid, nick: player.nick, time }, b: { uid: cand.uid, nick: cand.nick, time: cand.time },
              seed: Math.floor(Math.random() * 4294967295), primeiro: Math.random() < 0.5 ? "a" : "b", t0: Date.now(),
            });
            tx.update(dela, { status: "matched", matchId: mid });
            tx.update(minha, { status: "matched", matchId: mid });
          });
        } catch (e) { /* outro jogador foi mais rápido: tenta de novo no próximo ciclo */ } finally { ocupado = false; }
      };
      const iv = setInterval(volta, 3000);
      setTimeout(volta, 800);
      return { sair() { parado = true; clearInterval(iv); un(); deleteDoc(minha).catch(() => {}); } };
    },
    async partida(id) {
      const s = await getDoc(doc(db, "matches", id));
      return s.exists() ? { id, ...s.data() } : null;
    },
    observarMovs(id, cb) {
      return onSnapshot(collection(db, "matches", id, "moves"), (s) => {
        const l = s.docs.map((d) => { const x = d.data(); return { ...x, ts: x.ts && x.ts.toMillis ? x.ts.toMillis() : Date.now() }; });
        l.sort((a, b) => a.n - b.n);
        cb(l);
      });
    },
    async enviarMov(id, mov, n) {
      try {
        const { serverTimestamp } = await import("firebase/firestore");
        await setDoc(doc(db, "matches", id, "moves", pad(n)), { ...mov, n, uid, ts: serverTimestamp() });
        return true;
      } catch (e) { return false; }
    },
  };
}
