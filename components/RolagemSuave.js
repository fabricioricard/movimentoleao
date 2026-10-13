"use client";

import { useEffect } from "react";

// Endereços limpos para as seções da home: /pilares e /participe (e / para o início).
const SECOES = { "/": "inicio", "/pilares": "pilares", "/participe": "participe" };
const CAMINHOS = ["/", "/pilares", "/participe"];

// Quando a seção está na própria página, rola até ela de forma suave e ajusta o
// endereço do navegador para /pilares, /participe ou /, sem nenhum #.
export default function RolagemSuave() {
  useEffect(() => {
    const reduzir = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const aoClicar = (e) => {
      const link = e.target.closest && e.target.closest("a[href]");
      if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

      const href = link.getAttribute("href");
      let id = null;
      let caminho = null;
      if (href.startsWith("#")) {
        id = href.slice(1);
        caminho = id === "inicio" ? "/" : `/${id}`;
      } else if (SECOES[href]) {
        id = SECOES[href];
        caminho = href;
      }
      if (!id) return;

      const alvo = document.getElementById(id);
      if (!alvo) return; // seção não está nesta página: deixa navegar normalmente
      e.preventDefault();
      alvo.scrollIntoView({ behavior: reduzir() ? "auto" : "smooth", block: "start" });
      if (window.location.pathname !== caminho || window.location.hash) {
        window.history.replaceState(null, "", caminho);
      }
    };

    // Só volta o endereço para / quando a pessoa rola de baixo para o topo (nunca durante
    // a rolagem para uma seção nem na abertura direta de /pilares ou /participe).
    let ultimo = window.scrollY;
    const aoRolar = () => {
      const y = window.scrollY;
      if (ultimo >= 80 && y < 80 && CAMINHOS.includes(window.location.pathname) && window.location.pathname !== "/") {
        window.history.replaceState(null, "", "/");
      }
      ultimo = y;
    };

    document.addEventListener("click", aoClicar);
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      document.removeEventListener("click", aoClicar);
      window.removeEventListener("scroll", aoRolar);
    };
  }, []);

  return null;
}