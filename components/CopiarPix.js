"use client";

import { useState } from "react";

export default function CopiarPix({ chave }) {
  const [estado, setEstado] = useState("");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(chave);
      setEstado("Chave copiada!");
    } catch {
      // Navegadores sem acesso à área de transferência: seleciona o texto para copiar à mão.
      const el = document.getElementById("pix-chave");
      if (el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        const s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
      }
      setEstado("Selecionada. Copie com Ctrl+C.");
    }
    setTimeout(() => setEstado(""), 3000);
  }

  return (
    <div className="doa-copiar">
      <button type="button" className="pilula pilula-ouro" onClick={copiar}>
        Copiar chave
      </button>
      <span className="doa-copiado" role="status" aria-live="polite">{estado}</span>
    </div>
  );
}