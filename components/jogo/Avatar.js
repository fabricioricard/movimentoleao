// Caricatura simples em SVG (desenho nosso, sem foto de ninguém).
export default function Avatar({ av, tamanho = 64, bloqueado = false, morto = false }) {
  const { fundo = "#2a3a5f", pele = "#efc6a0", cabelo = "curto", cor = "#333", oculos, barba, barbaCor, gravata = "#f2b705" } = av || {};
  if (bloqueado) {
    return (
      <svg viewBox="0 0 100 100" width={tamanho} height={tamanho} role="img" aria-label="Personagem bloqueado">
        <rect width="100" height="100" rx="14" fill="#1a2748" />
        <path d="M18 100C18 76 82 76 82 100Z" fill="#2b3a64" />
        <circle cx="50" cy="44" r="19" fill="#2b3a64" />
        <text x="50" y="56" textAnchor="middle" fontSize="34" fontWeight="800" fill="#f2c14e" fontFamily="system-ui,sans-serif">?</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" width={tamanho} height={tamanho} role="img" aria-hidden="true" style={morto ? { filter: "grayscale(1) brightness(.6)" } : undefined}>
      <rect width="100" height="100" rx="14" fill={fundo} />
      {cabelo === "longo" && <path d="M30 42C28 20 72 20 70 42L74 78 26 78Z" fill={cor} />}
      <path d="M16 100C16 74 84 74 84 100Z" fill="#1c2640" />
      <path d="M42 77L50 90 58 77 54 74H46Z" fill="#fff" />
      <path d="M47.5 80h5l2.5 14-5 4-5-4Z" fill={gravata} />
      <rect x="44" y="62" width="12" height="14" fill={pele} />
      <ellipse cx="50" cy="45" rx="17" ry="20" fill={pele} />
      <circle cx="33" cy="47" r="3.6" fill={pele} /><circle cx="67" cy="47" r="3.6" fill={pele} />
      {cabelo === "curto" && <path d="M32 42C30 20 70 20 68 42C63 32 37 32 32 42Z" fill={cor} />}
      {cabelo === "grisalho" && <path d="M32 44C29 22 71 22 68 44C64 33 36 33 32 44Z" fill={cor} />}
      {cabelo === "longo" && <path d="M32 44C30 21 70 21 68 44C62 34 40 30 32 44Z" fill={cor} />}
      {cabelo === "calvo" && <><path d="M32 46C31 38 34 34 36 33C34 38 34 42 34 48Z" fill={cor} /><path d="M68 46C69 38 66 34 64 33C66 38 66 42 66 48Z" fill={cor} /></>}
      <circle cx="43" cy="45" r="1.9" fill="#1b1b1b" /><circle cx="57" cy="45" r="1.9" fill="#1b1b1b" />
      {oculos && <g fill="none" stroke="#1b1b1b" strokeWidth="1.6"><circle cx="43" cy="45" r="6" /><circle cx="57" cy="45" r="6" /><path d="M49 45h2" /></g>}
      {barba === "cheia" && <path d="M34 52C34 70 66 70 66 52C62 62 38 62 34 52Z" fill={barbaCor || cor} />}
      {barba === "curta" && <path d="M35 54C37 66 63 66 65 54C60 60 40 60 35 54Z" fill={barbaCor || cor} opacity=".85" />}
      <path d="M44 58Q50 62 56 58" fill="none" stroke="#7a3b2e" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}