import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";
import Jogo from "../../components/jogo/Jogo";
import "./jogo.css";

export const metadata = {
  title: "Arena LEAO — jogo",
  description: "Arena LEAO: jogo de batalha por turnos com caricaturas da política brasileira. Escolha um nick, entre na fila e enfrente outros jogadores.",
  alternates: { canonical: "/jogo" },
};

export default function PaginaJogo() {
  return (
    <>
      <Topo />
      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Arena</span>
              <span className="linha destaque">LEAO</span>
            </h1>
            <p className="hero-sub">Batalhas por turnos. Entre na fila e enfrente outros jogadores.</p>
          </div>
        </section>
        <section className="jg-fundo">
          <div className="container"><Jogo /></div>
        </section>
      </main>
      <Rodape />
    </>
  );
}