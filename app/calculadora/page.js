import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";
import Calculadora from "../../components/Calculadora";
import "./calculadora.css";

export const metadata = {
  title: "Calculadora do Dia da Liberdade — LEAO",
  description:
    "Descubra até que dia do ano você trabalha só para pagar impostos. Digite o seu salário e veja quanto vai para o Estado.",
};

export default function PaginaCalculadora() {
  return (
    <>
      <Topo />
      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Até que dia você</span>
              <span className="linha destaque">trabalha para o Estado?</span>
            </h1>
            <p className="hero-sub">Digite o seu salário e descubra o seu Dia da Liberdade.</p>
          </div>
        </section>
        <Calculadora />
      </main>
      <Rodape />
    </>
  );
}