import Link from "next/link";
import { SITE } from "../lib/config";
import "../app/topo-instagram.css";

const INSTAGRAM = "https://www.instagram.com/movimentoleao/";

// Topo compartilhado. Na home (home=true) o logo rola para o início da própria página.
export default function Topo({ home = false }) {
  const A = home ? "a" : Link;

  return (
    <header className="topo">
      <div className="container topo-in">
        <A href="/" className="marca" aria-label={`${SITE.nome} — início`}>
          <img src="/logo.png" alt="Movimento LEAO" className="marca-logo" />
        </A>
        <nav className="menu" aria-label="Principal">
          <Link href="/manifesto">Manifesto</Link>
          <Link href="/sobre">Sobre nós</Link>
          <Link href="/posicoes">Posições</Link>
          <Link href="/lideranca">Liderança</Link>
          <Link href="/calculadora">Calculadora</Link>
          <Link href="/noticias">Revista</Link>
          <Link href="/camisas">Camisas</Link>
          <Link href="/jogo">Jogo</Link>
          <Link href="/contato">Contato</Link>
          <Link href="/doacoes">Doe</Link>
        </nav>
        <div className="topo-acoes">
          <a className="pilula pilula-linha topo-x" href={SITE.x} target="_blank" rel="noopener noreferrer">
            Siga no X
          </a>
          <a className="pilula pilula-insta topo-x" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
            Siga no Instagram
          </a>
        </div>
      </div>
    </header>
  );
}