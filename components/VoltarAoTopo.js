"use client";

import { useEffect, useState } from "react";

// Botão "Voltar ao topo": aparece depois de rolar a página.
export default function VoltarAoTopo() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > 500);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const subir = () => {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduzir ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className={`voltar${visivel ? " voltar-visivel" : ""}`}
      onClick={subir}
      aria-label="Voltar ao topo"
      aria-hidden={!visivel}
      tabIndex={visivel ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path d="M12 19V5m-6 6 6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}