// Servidor do jogo no Firebase (Authentication anônimo + Firestore). Sem senha: o "dono" do nick
// é a identidade anônima do navegador, e as regras (firestore.rules) impedem que outro a use.
import { hashCodigo, normalizarCodigo } from "./codigo.js";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, runTransaction,
  collection, query, where, getDocs, onSnapshot, limit, orderBy, writeBatch, serverTimestamp,
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
      if (!p.exists()) return null;
      const d = p.data();
      // Jogadores antigos entram no ranking com 1000 pontos.
      if (d.pontos === undefined) { d.pontos = 1000; updateDoc(doc(db, "players", u.data().key), { pontos: 1000 }).catch(() => {}); }
      return { ...d, chave: u.data().key };
    },
    async registrar({ nick, chave }, jogador, codigo) {
      const pr = doc(db, "players", chave), ur = doc(db, "users", uid);
      const dados = { ...jogador, uid, nick };
      if (codigo) dados.rec = await hashCodigo(codigo);
      await runTransaction(db, async (tx) => {
        const [ps, us] = await Promise.all([tx.get(pr), tx.get(ur)]);
        if (ps.exists()) throw new Error("NICK_EM_USO");
        if (us.exists()) throw new Error("JA_TEM_CONTA");
        tx.set(pr, dados);
        tx.set(ur, { key: chave });
      });
      return { ...dados, chave };
    },
    // Grava (ou troca) o código de recuperação do nick. Quem já tinha nick sem código também usa isto.
    async definirRecuperacao(p, codigo) {
      await updateDoc(doc(db, "players", p.chave), { rec: await hashCodigo(codigo) });
    },
    // Navegador novo (ou dados limpos): prova que sabe o código e passa o nick para a identidade atual.
    // As regras conferem o código (SHA-256) e só deixam trocar o campo "uid".
    async recuperar(chave, codigo) {
      const ur = doc(db, "users", uid), rr = doc(db, "recuperar", uid);
      if ((await getDoc(ur)).exists()) throw new Error("JA_TEM_CONTA");
      await setDoc(rr, { chave, codigo: normalizarCodigo(codigo) });
      try { await updateDoc(doc(db, "players", chave), { uid }); }
      catch (e) { deleteDoc(rr).catch(() => {}); throw new Error("CODIGO_INVALIDO"); }
      await setDoc(ur, { key: chave });
      deleteDoc(rr).catch(() => {});
      return this.me();
    },
    // Sem "res": salva só personagens, missões e estatísticas. Com "res" (fim de partida online):
    // grava o resultado e os pontos na mesma operação; as regras só aceitam +25 na vitória e até −15 na derrota, uma vez por partida.
    async salvar(p, res) {
      const pr = doc(db, "players", p.chave);
      const base = { unlocked: p.unlocked, done: p.done, stats: p.stats };
      if (!res) { await updateDoc(pr, base); return; }
      const b = writeBatch(db);
      b.set(doc(db, "results", `${res.matchId}_${uid}`), { match: res.matchId, uid, win: res.venceu, delta: res.delta, t: serverTimestamp() });
      b.update(pr, { ...base, pontos: p.pontos, ultima: res.matchId });
      await b.commit();
    },
    async ranking() {
      const r = await getDocs(query(collection(db, "players"), orderBy("pontos", "desc"), limit(20)));
      return r.docs.map((d) => { const x = d.data(); return { nick: x.nick, pontos: x.pontos, vit: (x.stats && x.stats.winsPvp) || 0, der: (x.stats && x.stats.lossPvp) || 0, eu: x.uid === uid }; });
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