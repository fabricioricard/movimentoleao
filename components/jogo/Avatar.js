// Personagem em estilo cartoon (SVG nosso, traços gerais: cabelo, óculos, barba, cores).
// Para usar uma arte cartunizada própria, ponha a imagem em public/jogo/ e informe
// avatar.img = "/jogo/nome.png" em lib/jogo/personagens.js: ela substitui o desenho.
const L = "#1a1424"; // contorno grosso
const S = { stroke: L, strokeWidth: 3.2, strokeLinejoin: "round", strokeLinecap: "round" };

function Cabelo({ tipo, cor }) {
  if (tipo === "calvo")
    return <><path d="M30 52C28 40 34 36 38 35C34 42 34 48 34 56Z" fill={cor} {...S} strokeWidth={2.4} /><path d="M90 52C92 40 86 36 82 35C86 42 86 48 86 56Z" fill={cor} {...S} strokeWidth={2.4} /></>;
  if (tipo === "longo")
    return <path d="M60 14C32 14 28 40 30 60L26 96 42 92 40 56C54 52 74 44 80 36L80 56 78 92 94 96 90 60C92 40 88 14 60 14Z" fill={cor} {...S} />;
  const topete = tipo === "grisalho" ? "M31 56C24 30 44 12 62 14C84 14 96 34 89 56C84 44 74 36 60 36C46 36 36 44 31 56Z" : "M31 56C26 32 44 14 62 14C82 14 94 32 89 56C84 44 74 38 60 38C46 38 36 44 31 56Z";
  return <path d={topete} fill={cor} {...S} />;
}

function Boca({ expr }) {
  if (expr === "serio") return <path d="M48 83Q60 86 72 83" fill="none" {...S} />;
  if (expr === "boca")
    return <><path d="M44 78Q60 100 76 78Q60 82 44 78Z" fill="#7d1d2c" {...S} /><path d="M47 79.5Q60 83 73 79.5L72 84Q60 87 48 84Z" fill="#fff" stroke="none" /></>;
  return <><path d="M45 78Q60 94 75 78Q60 83 45 78Z" fill="#7d1d2c" {...S} /><path d="M48 79.5Q60 83.5 72 79.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></>;
}

import { useState } from "react";

// Arte própria: public/jogo/avatar/<id>.png (ou .webp/.jpg; também aceita direto em public/jogo/). Sem arquivo, usa o desenho cartoon.
const EXT = ["png", "webp", "jpg", "jpeg"];

export default function Avatar({ av, pid, tamanho = 64, bloqueado = false, morto = false }) {
  const [falhas, setFalhas] = useState(0);
  const { fundo = "#2a3a5f", pele = "#efc6a0", cabelo = "curto", cor = "#333", oculos, barba, barbaCor, gravata = "#f2b705", expr = "sorriso", img } = av || {};
  const fx = morto ? { filter: "grayscale(1) brightness(.6)" } : undefined;

  if (bloqueado)
    return (
      <svg viewBox="0 0 120 120" width={tamanho} height={tamanho} role="img" aria-label="Personagem bloqueado">
        <rect x="2" y="2" width="116" height="116" rx="18" fill="#243158" stroke={L} strokeWidth="3.2" />
        <path d="M24 118C24 92 96 92 96 118Z" fill="#33437a" {...S} />
        <circle cx="60" cy="56" r="28" fill="#33437a" {...S} />
        <text x="60" y="72" textAnchor="middle" fontSize="46" fontWeight="900" fill="#ffd45e" stroke={L} strokeWidth="2.4" paintOrder="stroke" fontFamily="system-ui,sans-serif">?</text>
      </svg>
    );

  const fontes = img ? [img] : pid ? [...EXT.map((e) => `/jogo/avatar/${pid}.${e}`), ...EXT.map((e) => `/jogo/${pid}.${e}`)] : [];
  if (falhas < fontes.length)
    return <img src={fontes[falhas]} alt="" width={tamanho} height={tamanho} onError={() => setFalhas(falhas + 1)} style={{ borderRadius: 18, objectFit: "cover", border: `3px solid ${L}`, ...fx }} />;

  return (
    <svg viewBox="0 0 120 120" width={tamanho} height={tamanho} role="img" aria-hidden="true" style={fx} className="jg-av">
      <defs>
        <clipPath id="jg-q"><rect x="2" y="2" width="116" height="116" rx="18" /></clipPath>
        <radialGradient id={`jg-g-${fundo.slice(1)}`} cx="50%" cy="40%" r="70%"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      <g clipPath="url(#jg-q)">
        <rect width="120" height="120" fill={fundo} />
        <g opacity=".16" fill="#fff">{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d="M60 60L-20 40L-20 20Z" transform={`rotate(${i * 45} 60 60)`} />)}</g>
        <rect width="120" height="120" fill={`url(#jg-g-${fundo.slice(1)})`} />
        {/* terno */}
        <path d="M14 124C14 100 34 94 60 94C86 94 106 100 106 124Z" fill="#26304f" {...S} />
        <path d="M46 94L60 112 74 94Z" fill="#fff" {...S} strokeWidth={2.6} />
        <path d="M56 100h8l4 20h-16Z" fill={gravata} {...S} strokeWidth={2.4} />
        {/* pescoço */}
        <path d="M49 82h22v16Q60 106 49 98Z" fill={pele} {...S} />
      </g>
      <rect x="2" y="2" width="116" height="116" rx="18" fill="none" stroke={L} strokeWidth="3.2" />
      {cabelo === "longo" && <g clipPath="url(#jg-q)"><path d="M60 22C36 22 30 44 32 66L28 98 44 94 42 60Z" fill={cor} {...S} /></g>}
      {/* orelhas e cabeça grande */}
      <ellipse cx="31" cy="62" rx="6.5" ry="9" fill={pele} {...S} />
      <ellipse cx="89" cy="62" rx="6.5" ry="9" fill={pele} {...S} />
      <path d="M60 24C38 24 30 42 30 62C30 84 44 96 60 96C76 96 90 84 90 62C90 42 82 24 60 24Z" fill={pele} {...S} />
      <Cabelo tipo={cabelo} cor={cor} />
      {/* sobrancelhas */}
      <path d="M38 50Q46 45 54 49" fill="none" stroke={cabelo === "calvo" ? "#2a2a2a" : cor === "#d9d9d9" || cor === "#cfcfcf" || cor === "#b5b5b5" || cor === "#9aa3b2" ? "#8a8a8a" : cor} strokeWidth="4" strokeLinecap="round" />
      <path d="M66 49Q74 45 82 50" fill="none" stroke={cabelo === "calvo" ? "#2a2a2a" : cor === "#d9d9d9" || cor === "#cfcfcf" || cor === "#b5b5b5" || cor === "#9aa3b2" ? "#8a8a8a" : cor} strokeWidth="4" strokeLinecap="round" />
      {/* olhos grandes */}
      <ellipse cx="46" cy="61" rx="8" ry="9.5" fill="#fff" {...S} strokeWidth={2.6} />
      <ellipse cx="74" cy="61" rx="8" ry="9.5" fill="#fff" {...S} strokeWidth={2.6} />
      <circle cx="48" cy="62" r="4.6" fill="#1b1b1b" /><circle cx="72" cy="62" r="4.6" fill="#1b1b1b" />
      <circle cx="49.6" cy="60" r="1.6" fill="#fff" /><circle cx="73.6" cy="60" r="1.6" fill="#fff" />
      {oculos && <g fill="#bfe6ff" fillOpacity=".28" stroke={L} strokeWidth="3"><circle cx="46" cy="61" r="12" /><circle cx="74" cy="61" r="12" /><path d="M58 60h4" fill="none" /></g>}
      {/* bochechas e nariz */}
      <circle cx="38" cy="75" r="4.5" fill="#ff7a8a" opacity=".35" /><circle cx="82" cy="75" r="4.5" fill="#ff7a8a" opacity=".35" />
      <path d="M57 66Q54 74 60 74.5Q66 74 63 66" fill={pele} {...S} strokeWidth={2.4} />
      {barba === "cheia" && <path d="M32 70C32 98 88 98 88 70C84 84 74 86 60 86C46 86 36 84 32 70Z" fill={barbaCor || cor} {...S} strokeWidth={2.8} />}
      {barba === "curta" && <path d="M34 74C36 94 84 94 86 74C80 84 72 86 60 86C48 86 40 84 34 74Z" fill={barbaCor || cor} {...S} strokeWidth={2.8} opacity=".92" />}
      <Boca expr={expr} />
    </svg>
  );
}