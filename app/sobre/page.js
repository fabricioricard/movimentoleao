import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";
import Sobre from "../../components/Sobre";
import "./sobre.css";

export const metadata = {
  title: "Sobre nós — LEAO",
  description: "Como surgiu o Movimento LEAO: fundado na Bahia pelos irmãos Yan Renat e Fabrício Ricard, em defesa de um Estado a serviço do povo.",
  alternates: { canonical: "/sobre" },
};

export default function PaginaSobre() {
  return (
    <>
      <Topo />
      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Sobre</span>
              <span className="linha destaque">nós</span>
            </h1>
            <p className="hero-sub">Como o LEAO surgiu e para onde vai.</p>
          </div>
        </section>
        <Sobre />
      </main>
      <Rodape />
    </>
  );
}