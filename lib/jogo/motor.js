// Motor da batalha. É determinístico: com a mesma semente e os mesmos movimentos,
// os dois jogadores chegam exatamente ao mesmo resultado. Não depende de servidor.
import { PERSONAGENS, ENERGIAS, HP } from "./personagens.js";

export const TURNO_MS = 30000;
const HOSTIL = new Set(["dmg", "dot", "stun", "weak", "drain"]);
export const outro = (l) => (l === "a" ? "b" : "a");

function rnd(s) {
  s.rs = (s.rs + 0x6d2b79f5) >>> 0;
  let t = s.rs;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const soma = (u, k) => u.st.reduce((a, x) => (x.k === k ? a + x.v : a), 0);
const tem = (u, k) => u.st.some((x) => x.k === k);
const vivos = (l) => l.u.filter((x) => x.hp > 0);
const skillDe = (u, i) => PERSONAGENS[u.id].skills[i];

export function criar(seed, timeA, timeB, primeiro) {
  const unit = (id) => ({ id, hp: HP, cd: [0, 0, 0, 0], st: [] });
  const s = {
    rs: seed >>> 0, turno: 1, lado: primeiro, venc: null, motivo: null,
    lados: {
      a: { u: timeA.map(unit), pool: { V: 0, M: 0, D: 0, A: 0 }, to: 0 },
      b: { u: timeB.map(unit), pool: { V: 0, M: 0, D: 0, A: 0 }, to: 0 },
    },
    log: [], ev: [],
  };
  iniciarTurno(s, primeiro, true);
  return s;
}

function nome(s, lado, i) { return PERSONAGENS[s.lados[lado].u[i].id].curto; }
function falar(s, t) { s.log.push(t); if (s.log.length > 60) s.log.shift(); }

function checar(s) {
  if (s.venc) return;
  for (const l of ["a", "b"]) if (vivos(s.lados[l]).length === 0) { s.venc = outro(l); s.motivo = "ko"; }
}

function iniciarTurno(s, l, primeiro) {
  for (const lado of ["a", "b"]) {
    s.lados[lado].u.forEach((u, i) => {
      if (u.hp <= 0) return;
      u.st = u.st.filter((x) => {
        if (x.src !== l) return true;
        if (x.k === "dot" && !tem(u, "inv")) {
          u.hp = Math.max(0, u.hp - x.v);
          s.ev.push({ lado, u: i, k: "dmg", v: x.v });
          falar(s, `${nome(s, lado, i)} sofre ${x.v} de dano contínuo.`);
        }
        x.t -= 1;
        return x.t > 0 && !(x.k === "shield" && x.v <= 0);
      });
      if (u.hp <= 0) { u.st = []; falar(s, `${nome(s, lado, i)} caiu.`); }
    });
  }
  // Desgaste: depois do turno 24 o cansaço cresce e derruba quem está em campo (a partida não se arrasta).
  if (s.turno > 24) {
    const d = s.turno - 24;
    s.lados[l].u.forEach((u, i) => { if (u.hp > 0) { u.hp = Math.max(0, u.hp - d); s.ev.push({ lado: l, u: i, k: "dmg", v: d }); } });
    falar(s, `Desgaste da campanha: -${d} de vida.`);
  }
  s.lados[l].u.forEach((u) => { u.cd = u.cd.map((c) => Math.max(0, c - 1)); });
  checar(s);
  if (s.venc) return;
  const n = primeiro ? 1 : vivos(s.lados[l]).length + 1;
  for (let k = 0; k < n; k++) s.lados[l].pool[ENERGIAS[Math.floor(rnd(s) * 4)]] += 1;
}

// Paga um custo. "*" gasta da energia que o jogador tem mais. Devolve a nova reserva ou null.
export function pagar(pool, custo) {
  const p = { ...pool };
  for (const c of custo) { if (c === "*") continue; if (p[c] <= 0) return null; p[c] -= 1; }
  for (const c of custo) {
    if (c !== "*") continue;
    let melhor = null;
    for (const e of ENERGIAS) if (p[e] > 0 && (melhor === null || p[e] > p[melhor])) melhor = e;
    if (melhor === null) return null;
    p[melhor] -= 1;
  }
  return p;
}

export function atordoado(u) { return tem(u, "stun"); }

export function validar(s, lado, acts) {
  if (s.venc) return { erro: "fim" };
  if (s.lado !== lado) return { erro: "não é seu turno" };
  const meu = s.lados[lado], ini = s.lados[outro(lado)];
  let pool = meu.pool; const usados = new Set();
  for (const a of acts) {
    const u = meu.u[a.u];
    if (!u || u.hp <= 0 || usados.has(a.u)) return { erro: "personagem inválido" };
    if (atordoado(u)) return { erro: "atordoado" };
    const sk = skillDe(u, a.s);
    if (!sk || u.cd[a.s] > 0) return { erro: "habilidade indisponível" };
    if (sk.alvo === "inimigo") { const t = ini.u[a.tg]; if (!t || t.hp <= 0) return { erro: "alvo inválido" }; }
    if (sk.alvo === "aliado") { const t = meu.u[a.tg]; if (!t || t.hp <= 0) return { erro: "alvo inválido" }; }
    pool = pagar(pool, sk.custo);
    if (!pool) return { erro: "sem energia" };
    usados.add(a.u);
  }
  return { ok: true, pool };
}

function dano(alvo, atk, v, pierce) {
  let q = v;
  if (atk) q *= 1 + (soma(atk, "buff") - soma(atk, "weak")) / 100;
  if (!pierce) q *= Math.max(0, 1 - soma(alvo, "def") / 100);
  q = Math.max(0, Math.round(q));
  if (!pierce) for (const sh of alvo.st) { if (sh.k !== "shield" || q <= 0) continue; const ab = Math.min(sh.v, q); sh.v -= ab; q -= ab; }
  alvo.hp = Math.max(0, alvo.hp - q);
  if (alvo.hp === 0) alvo.st = [];
  return q;
}

function energiaAleatoria(s, pool, n) {
  for (let k = 0; k < n; k++) {
    const tot = ENERGIAS.reduce((a, e) => a + pool[e], 0);
    if (!tot) return;
    let r = Math.floor(rnd(s) * tot);
    for (const e of ENERGIAS) { if (r < pool[e]) { pool[e] -= 1; break; } r -= pool[e]; }
  }
}

function executar(s, lado, a) {
  const meu = s.lados[lado], ini = s.lados[outro(lado)];
  const u = meu.u[a.u], sk = skillDe(u, a.s);
  const pg = pagar(meu.pool, sk.custo);
  meu.pool = pg;
  u.cd[a.s] = sk.cd;
  let alvos;
  if (sk.alvo === "inimigo") alvos = [{ l: outro(lado), i: a.tg }];
  else if (sk.alvo === "inimigos") alvos = ini.u.map((x, i) => ({ l: outro(lado), i })).filter((t) => ini.u[t.i].hp > 0);
  else if (sk.alvo === "aliado") alvos = [{ l: lado, i: a.tg }];
  else if (sk.alvo === "aliados") alvos = meu.u.map((x, i) => ({ l: lado, i })).filter((t) => meu.u[t.i].hp > 0);
  else alvos = [{ l: lado, i: a.u }];
  alvos = alvos.filter((t) => s.lados[t.l].u[t.i].hp > 0);
  falar(s, `${nome(s, lado, a.u)} usou ${sk.nome}.`);
  s.ev.push({ lado, u: a.u, k: "use", s: a.s });
  if (!alvos.length) { falar(s, "…mas não havia alvo."); return; }
  for (const ef of sk.efeitos) {
    const lista = ef.to === "si" ? [{ l: lado, i: a.u }] : alvos;
    for (const t of lista) {
      const alvo = s.lados[t.l].u[t.i];
      if (alvo.hp <= 0) continue;
      if (HOSTIL.has(ef.t) && t.l !== lado && tem(alvo, "inv")) { falar(s, `${nome(s, t.l, t.i)} está invulnerável.`); continue; }
      if (ef.t === "dmg") { const q = dano(alvo, u, ef.v, ef.pierce); s.ev.push({ lado: t.l, u: t.i, k: "dmg", v: q }); falar(s, `${nome(s, t.l, t.i)} perdeu ${q} de vida.`); }
      else if (ef.t === "heal") { const antes = alvo.hp; alvo.hp = Math.min(HP, alvo.hp + ef.v); s.ev.push({ lado: t.l, u: t.i, k: "heal", v: alvo.hp - antes }); falar(s, `${nome(s, t.l, t.i)} recuperou ${alvo.hp - antes} de vida.`); }
      else if (ef.t === "drain") energiaAleatoria(s, s.lados[t.l].pool, ef.n);
      else if (ef.t === "gain") for (let k = 0; k < ef.n; k++) meu.pool[ENERGIAS[Math.floor(rnd(s) * 4)]] += 1;
      else if (ef.t === "shield") alvo.st.push({ k: "shield", v: ef.v, t: ef.turns, src: lado });
      else alvo.st.push({ k: ef.t, v: ef.v || 0, t: ef.turns || 1, src: lado });
    }
  }
  checar(s);
}

// Aplica um movimento. Devolve { s } (novo estado) ou { erro }.
// Movimentos: {t:"turn", turn, acts:[{u,s,tg}]} | {t:"timeout", turn} | {t:"surrender", by}
export function aplicar(s0, lado, mov, dt = Infinity) {
  if (s0.venc) return { erro: "fim" };
  const s = structuredClone(s0);
  s.ev = [];
  if (mov.t === "surrender") {
    s.venc = outro(lado); s.motivo = "desistência"; falar(s, "Desistiu da partida.");
    return { s };
  }
  if (mov.turn !== s.turno) return { erro: "movimento antigo" };
  // Só o dono do turno joga. Exceção: o adversário pode registrar o estouro do tempo (confirmado pelo relógio do servidor).
  if (mov.t === "timeout" && lado !== s.lado) { if (dt < TURNO_MS - 3000) return { erro: "cedo demais" }; lado = s.lado; }
  else if (lado !== s.lado) return { erro: "não é seu turno" };
  if (mov.t === "timeout") {
    const l = s.lados[lado]; l.to += 1;
    falar(s, "Tempo esgotado.");
    if (l.to >= 2) { s.venc = outro(lado); s.motivo = "tempo"; return { s }; }
  } else if (mov.t === "turn") {
    const v = validar(s, lado, mov.acts || []);
    if (v.erro) return { erro: v.erro };
    s.lados[lado].to = 0;
    for (const a of mov.acts) {
      if (s.venc) break;
      executar(s, lado, a);
    }
  } else return { erro: "tipo" };
  if (s.venc) return { s };
  s.lado = outro(lado); s.turno += 1;
  iniciarTurno(s, s.lado, false);
  return { s };
}

// Reproduz a partida inteira. `mov` = lista ordenada [{lado, ...}]. Movimentos inválidos são ignorados
// (igual nos dois navegadores), o que impede trapaça por movimentos ilegais.
export function reproduzir(init, movs) {
  let s = criar(init.seed, init.timeA, init.timeB, init.primeiro);
  let ant = init.t0 || 0;
  for (const m of movs) {
    const r = aplicar(s, m.lado, m, m.ts ? m.ts - ant : Infinity);
    if (!r.erro) { s = r.s; ant = m.ts || ant; }
  }
  return s;
}

// ---------- Computador ----------
export function bot(s, lado, nivel = 1) {
  const meu = s.lados[lado], ini = s.lados[outro(lado)];
  let pool = meu.pool; const acts = [];
  const ordem = meu.u.map((u, i) => i).filter((i) => meu.u[i].hp > 0 && !atordoado(meu.u[i])).sort(() => Math.random() - 0.5);
  for (const i of ordem) {
    const u = meu.u[i]; let melhor = null;
    u.cd.forEach((cd, k) => {
      const sk = skillDe(u, k);
      if (cd > 0) return;
      const pg = pagar(pool, sk.custo); if (!pg) return;
      const alvosIni = ini.u.map((x, j) => j).filter((j) => ini.u[j].hp > 0);
      const alvosAli = meu.u.map((x, j) => j).filter((j) => meu.u[j].hp > 0);
      const cand = sk.alvo === "inimigo" ? alvosIni : sk.alvo === "aliado" ? alvosAli : [0];
      for (const tg of cand) {
        let sc = 0;
        for (const ef of sk.efeitos) {
          const ref = ef.to === "si" ? u : sk.alvo === "inimigo" ? ini.u[tg] : sk.alvo === "aliado" ? meu.u[tg] : u;
          const n = sk.alvo === "inimigos" ? alvosIni.length : sk.alvo === "aliados" ? alvosAli.length : 1;
          if (ef.t === "dmg") { sc += ef.v * n * 0.8; if (sk.alvo === "inimigo" && ini.u[tg].hp <= ef.v) sc += 25; if (sk.alvo === "inimigo") sc += (HP - ini.u[tg].hp) * 0.1; }
          else if (ef.t === "heal") sc += Math.min(ef.v, HP - ref.hp) * 0.9 * n;
          else if (ef.t === "dot") sc += ef.v * ef.turns * 0.6;
          else if (ef.t === "stun") sc += 22;
          else if (ef.t === "shield") sc += 12 + (ref.hp < 50 ? 8 : 0);
          else if (ef.t === "inv") sc += ref.hp < 50 ? 25 : 8;
          else if (ef.t === "buff" || ef.t === "weak" || ef.t === "def") sc += 9 * n;
          else if (ef.t === "drain" || ef.t === "gain") sc += 5;
        }
        sc -= sk.custo.length * 2.5; sc += Math.random() * (nivel > 1 ? 2 : 8);
        if (sc > 6 && (!melhor || sc > melhor.sc)) melhor = { sc, a: { u: i, s: k, tg }, pg };
      }
    });
    if (melhor) { acts.push(melhor.a); pool = melhor.pg; }
  }
  return acts;
}