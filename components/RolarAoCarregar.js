"use client";

import { useEffect } from "react";

// Ao abrir /pilares ou /participe, rola até a seção correspondente.
export default function RolarAoCarregar({ id }) {
  useEffect(() => {
    const alvo = document.getElementById(id);
    if (alvo) alvo.scrollIntoView({ behavior: "auto", block: "start" });
  }, [id]);
  return null;
}