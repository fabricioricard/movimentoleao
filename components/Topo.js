import Link from "next/link";
import { SITE } from "../lib/config";

// Topo compartilhado. Na home (home=true) os links rolam dentro da página;
// nas outras páginas eles levam de volta para a home.
export default function Topo({ home = false }) {
  const A = home ? "a" : Link;
  const ancora = (id) => (home ? `#${id}` : `/#${id}`);

  return (
    <header className="topo">
      <div className="container topo-in">
        <A href={home ? "#inicio" : "/"} className="marca" aria-label={`${SITE.nome} — início`}>
          <img src="/logo.png" alt="Movimento LEAO" className="marca-logo" />
        </A>
        <nav className="menu" aria-label="Principal">
          <A href={ancora("manifesto")}>Manifesto</A>
          <A href={ancora("pilares")}>Pilares</A>
          <Link href="/posicoes">Posições</Link>
          <A href={ancora("participe")}>Participe</A>
        </nav>
        <div className="topo-acoes">
          <a className="pilula pilula-linha topo-x" href={SITE.x} target="_blank" rel="noopener noreferrer">
            Siga no X
          </a>
          <a className="pilula pilula-ouro" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
            Entre no grupo
          </a>
        </div>
      </div>
    </header>
  );
}