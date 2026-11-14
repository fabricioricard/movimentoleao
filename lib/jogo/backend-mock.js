// Modo demonstração: guarda tudo no navegador (localStorage). Serve para testar o jogo
// entre duas abas do mesmo navegador. Para jogar de verdade online, configure o Firebase.
import { normalizarCodigo } from "./codigo.js";
const K = "leao_jogo_demo";
const ler = () => { try { return JSON.parse(localStorage.getItem(K) || "{}"); } catch { return {}; } };
const gravar = (d) => localStorage.setItem(K, JSON.stringify(d));
const aleatorio = () => Math.random().toString(36).slice(2, 10);

export function criarMock() {
  let uid = sessionStorage.getItem("leao_demo_uid");
  if (!uid) { uid = "u" + aleatorio(); sessionStorage.setItem("leao_demo_uid", uid); }
  const get = (c) => ler()[c] || {};
  const mudar = (fn) => { const d = ler(); fn(d); gravar(d); };

  return {
    demo: true,
    uid,
    async me() {
      const key = get("users")[uid];
      return key ? get("players")[key] || null : null;
    },
    async registrar({ nick, chave }, jogador, codigo) {
      if (get("players")[chave]) throw new Error("NICK_EM_USO");
      if (get("users")[uid]) throw new Error("JA_TEM_CONTA");
      const p = { ...jogador, uid, chave };
      if (codigo) p.rec = normalizarCodigo(codigo);
      mudar((d) => { d.players = d.players || {}; d.users = d.users || {}; d.players[chave] = p; d.users[uid] = chave; });
      return p;
    },
    async definirRecuperacao(p, codigo) { mudar((d) => { d.players[p.chave].rec = normalizarCodigo(codigo); }); },
    async recuperar(chave, codigo) {
      if (get("users")[uid]) throw new Error("JA_TEM_CONTA");
      const p = get("players")[chave];
      if (!p || !p.rec || p.rec !== normalizarCodigo(codigo)) throw new Error("CODIGO_INVALIDO");
      mudar((d) => { d.players[chave].uid = uid; d.users[uid] = chave; });
      return get("players")[chave];
    },
    async salvar(p) { mudar((d) => { d.players[p.chave] = p; }); },
    async ranking() {
      return Object.values(get("players")).map((x) => ({ nick: x.nick, pontos: x.pontos === undefined ? 1000 : x.pontos, vit: (x.stats && x.stats.winsPvp) || 0, der: (x.stats && x.stats.lossPvp) || 0, eu: x.uid === uid })).sort((a, b) => b.pontos - a.pontos).slice(0, 20);
    },
    entrarFila(player, time, onMatch) {
      const size = time.length; let parado = false;
      mudar((d) => { d.queue = d.queue || {}; d.queue[uid] = { uid, nick: player.nick, time, size, status: "waiting", matchId: null, beat: Date.now(), criado: Date.now() }; });
      const volta = () => {
        if (parado) return;
        const d = ler(); const eu = d.queue && d.queue[uid];
        if (!eu) return;
        if (eu.matchId) { parado = true; clearInterval(iv); mudar((x) => { delete x.queue[uid]; }); onMatch(eu.matchId); return; }
        mudar((x) => { if (x.queue[uid]) x.queue[uid].beat = Date.now(); });
        const cand = Object.values(d.queue).filter((q) => q.uid !== uid && q.status === "waiting" && q.size === size && Date.now() - q.beat < 8000).sort((a, b) => a.criado - b.criado)[0];
        if (!cand) return;
        mudar((x) => {
          const o = x.queue[cand.uid], m = x.queue[uid];
          if (!o || !m || o.status !== "waiting" || m.status !== "waiting") return;
          const id = "m" + aleatorio();
          x.matches = x.matches || {}; x.moves = x.moves || {};
          x.matches[id] = { id, a: { uid, nick: player.nick, time }, b: { uid: o.uid, nick: o.nick, time: o.time }, seed: Math.floor(Math.random() * 4294967295), primeiro: Math.random() < 0.5 ? "a" : "b", t0: Date.now() };
          x.moves[id] = [];
          o.status = "matched"; o.matchId = id; m.status = "matched"; m.matchId = id;
        });
      };
      const iv = setInterval(volta, 600);
      return { sair() { parado = true; clearInterval(iv); mudar((x) => { if (x.queue && x.queue[uid] && !x.queue[uid].matchId) delete x.queue[uid]; }); } };
    },
    async partida(id) { return get("matches")[id] || null; },
    observarMovs(id, cb) {
      let n = -1;
      const iv = setInterval(() => { const l = get("moves")[id] || []; if (l.length !== n) { n = l.length; cb(l.map((m) => ({ ...m }))); } }, 300);
      return () => clearInterval(iv);
    },
    async enviarMov(id, mov, n) {
      let ok = false;
      mudar((d) => { const l = d.moves[id]; if (l.length === n - 1) { l.push({ ...mov, n, uid, ts: Date.now() }); ok = true; } });
      return ok;
    },
  };
}