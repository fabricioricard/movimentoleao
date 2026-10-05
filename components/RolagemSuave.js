"use client";

import { useEffect } from "react";

// Rola até a seção ao clicar em links como href="#pilares",
// sem colocar o #pilares no endereço do navegador.
export default function RolagemSuave() {
  useEffect(() => {
    const aoClicar = (e) => {
      const link = e.target.closest && e.target.closest('a[href^="#"]');
      if (!link) return;
      const alvo = document.getElementById(link.getAttribute("href").slice(1));
      if (!alvo) return;
      e.preventDefault();
      const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      alvo.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
    };
    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, []);

  return null;
}