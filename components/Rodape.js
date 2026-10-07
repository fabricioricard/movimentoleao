import Link from "next/link";
import { SITE } from "../lib/config";

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="container rodape-in">
        <p>
          <strong>LEAO</strong> Liderança para Eficiência, Autonomia e Ordem
        </p>
        <div className="rodape-links">
          <Link href="/manifesto">Manifesto</Link>
          <Link href="/posicoes">Posições</Link>
          <a href={SITE.x} target="_blank" rel="noopener noreferrer">
            @MovimentoLEAO
          </a>
        </div>
      </div>
    </footer>
  );
}