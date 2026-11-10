// Sons do jogo, gerados no próprio navegador (sem arquivos de áudio) + narração opcional.
// A narração lê o nome da habilidade com a voz sintética do aparelho. Ela NÃO imita a voz de ninguém:
// cada personagem só recebe um tom um pouco diferente para soar distinto.
// Se você tiver gravações próprias, ponha o arquivo em public/jogo/voz/ e informe em personagens.js
// o campo  voz: "/jogo/voz/zema.mp3"  (ou, por habilidade, voz dentro da própria habilidade).
let ctx = null;
const CHAVE = "leao_jogo_som";

export function lerPref() {
  try { const v = JSON.parse(localStorage.getItem(CHAVE) || "{}"); return { efeitos: v.efeitos !== false, voz: v.voz !== false }; } catch { return { efeitos: true, voz: true }; }
}
export function salvarPref(p) { try { localStorage.setItem(CHAVE, JSON.stringify(p)); } catch {} }

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}
function tom(c, t0, { f, f2, dur = 0.2, tipo = "sine", vol = 0.25 }) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = tipo; o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.02);
}
function ruido(c, t0, { dur = 0.2, vol = 0.3, freq = 1200 }) {
  const n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = c.createBufferSource(); s.buffer = b;
  const fl = c.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = freq;
  const g = c.createGain(); g.gain.value = vol;
  s.connect(fl).connect(g).connect(c.destination); s.start(t0);
}

// tipo: golpe | cura | defesa | controle | apoio (uso da habilidade) · impacto | impacto-forte | efeito (resultado)
export function tocar(tipo) {
  const c = ac(); if (!c) return; const t = c.currentTime + 0.01;
  if (tipo === "golpe") { ruido(c, t, { dur: 0.22, vol: 0.3, freq: 3000 }); tom(c, t, { f: 520, f2: 140, dur: 0.22, tipo: "sawtooth", vol: 0.16 }); }
  else if (tipo === "cura") [523, 659, 784, 1047].forEach((f, i) => tom(c, t + i * 0.07, { f, dur: 0.25, vol: 0.18 }));
  else if (tipo === "defesa") { tom(c, t, { f: 880, dur: 0.35, tipo: "triangle", vol: 0.22 }); tom(c, t, { f: 1320, dur: 0.3, tipo: "triangle", vol: 0.12 }); }
  else if (tipo === "controle") { tom(c, t, { f: 300, f2: 620, dur: 0.18, tipo: "square", vol: 0.12 }); tom(c, t + 0.18, { f: 620, f2: 260, dur: 0.22, tipo: "square", vol: 0.12 }); }
  else if (tipo === "apoio") { tom(c, t, { f: 440, dur: 0.15, vol: 0.2 }); tom(c, t + 0.12, { f: 660, dur: 0.25, vol: 0.2 }); }
  else if (tipo === "impacto") { ruido(c, t, { dur: 0.16, vol: 0.4, freq: 900 }); tom(c, t, { f: 150, f2: 50, dur: 0.18, vol: 0.4 }); }
  else if (tipo === "impacto-forte") { ruido(c, t, { dur: 0.35, vol: 0.55, freq: 700 }); tom(c, t, { f: 120, f2: 35, dur: 0.4, vol: 0.55 }); }
  else if (tipo === "efeito") tom(c, t, { f: 700, f2: 1000, dur: 0.12, vol: 0.14 });
}

// Narração do nome da habilidade. "pid" só escolhe o tom, para os personagens soarem diferentes.
const TOM = { zema: 1.0, tarcisio: 0.85, haddad: 0.95, lula: 0.7, bolsonaro: 0.8, moraes: 0.75, ciro: 0.9, nikolas: 1.1 };
export function falar(texto, pid) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR"; u.rate = 1.15; u.pitch = TOM[pid] || 1; u.volume = 0.9;
    const v = window.speechSynthesis.getVoices().find((x) => /pt[-_]BR/i.test(x.lang));
    if (v) u.voice = v;
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  } catch {}
}
// Toca a gravação; se o arquivo não existir ou não tocar, narra o nome da habilidade com a voz sintética.
let atual = null; // uma voz por vez: a nova corta a anterior
export function tocarVoz(url, texto, pid) {
  let caiu = false;
  if (atual) { try { atual.pause(); } catch {} atual = null; }
  const reserva = () => { if (!caiu) { caiu = true; falar(texto, pid); } };
  try {
    const a = new Audio(url); a.volume = 0.9; atual = a;
    a.addEventListener("error", reserva);
    a.play().catch((e) => { if (e && e.name === "NotSupportedError") reserva(); });
  } catch { reserva(); }
}
