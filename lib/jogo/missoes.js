// Missões: cada uma que o jogador completa libera um personagem novo (veja ORDEM_DESBLOQUEIO).
import { ORDEM_DESBLOQUEIO, INICIAIS, PERSONAGENS } from "./personagens.js";

export const STATS0 = { played: 0, wins: 0, winsBot: 0, winsPvp: 0, lossPvp: 0, skills: 0, flawless: 0 };

export const MISSOES = [
  { id: "m1", nome: "Primeiro round", desc: "Vença 1 partida de treino contra o computador.", meta: 1, prog: (s) => s.winsBot },
  { id: "m2", nome: "Pé na estrada", desc: "Jogue 3 partidas.", meta: 3, prog: (s) => s.played },
  { id: "m3", nome: "Campanha online", desc: "Vença 1 partida contra outro jogador.", meta: 1, prog: (s) => s.winsPvp },
  { id: "m4", nome: "Mão na massa", desc: "Use 20 habilidades.", meta: 20, prog: (s) => s.skills },
  { id: "m5", nome: "Vitória limpa", desc: "Vença uma partida sem perder nenhum personagem.", meta: 1, prog: (s) => s.flawless },
  { id: "m6", nome: "Liderança", desc: "Vença 5 partidas.", meta: 5, prog: (s) => s.wins },
  { id: "m7", nome: "Arena", desc: "Vença 5 partidas contra outros jogadores.", meta: 5, prog: (s) => s.winsPvp },
];

// Ranking: todos começam com 1000. Vitória online +25, derrota online −15 (nunca abaixo de 0).
export const PONTOS_INICIAIS = 1000, PONTOS_VITORIA = 25, PONTOS_DERROTA = 15;

export const TOTAL = Object.keys(PERSONAGENS).length;

export function novoJogador(nick, uid, inicial) {
  return { nick, uid, unlocked: [inicial], done: [], stats: { ...STATS0 }, pontos: PONTOS_INICIAIS };
}

// Atualiza as estatísticas depois de uma partida e libera personagens das missões concluídas.
export function concluirPartida(p, { venceu, pvp, usadas, flawless, matchId }) {
  const st = { ...STATS0, ...p.stats };
  st.played += 1; st.skills += usadas;
  if (venceu) { st.wins += 1; if (pvp) st.winsPvp += 1; else st.winsBot += 1; if (flawless) st.flawless += 1; }
  else if (pvp) st.lossPvp += 1;
  let pontos = p.pontos === undefined ? PONTOS_INICIAIS : p.pontos, delta = 0;
  if (pvp) { const novo = Math.max(0, pontos + (venceu ? PONTOS_VITORIA : -PONTOS_DERROTA)); delta = novo - pontos; pontos = novo; }
  const unlocked = [...p.unlocked], done = [...(p.done || [])], novos = [], missoes = [];
  for (const m of MISSOES) {
    if (done.includes(m.id) || m.prog(st) < m.meta) continue;
    done.push(m.id); missoes.push(m);
    const prox = ORDEM_DESBLOQUEIO.find((id) => !unlocked.includes(id));
    if (prox) { unlocked.push(prox); novos.push(prox); }
  }
  return { jogador: { ...p, stats: st, unlocked, done, pontos, ...(pvp ? { ultima: matchId } : {}) }, novos, missoes, delta };
}

export function normalizarNick(nick) {
  const limpo = (nick || "").trim();
  const chave = limpo.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "_");
  if (!/^[a-z0-9_]{3,16}$/.test(chave)) return null;
  return { nick: limpo.replace(/\s+/g, "_"), chave };
}
export { INICIAIS };