import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";
import Camisas from "../../components/Camisas";
import "./camisas.css";

export const metadata = {
  title: "Camisas — LEAO",
  description: "As camisas do Movimento LEAO. Recomendamos que os membros usem na rua para se identificarem. Quem não pode pagar recebe de graça.",
  alternates: { canonical: "/camisas" },
};

export default function PaginaCamisas() {
  return (
    <>
      <Topo />
      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Camisas do</span>
              <span className="linha destaque">movimento</span>
            </h1>
            <p className="hero-sub">Use na rua. É assim que a gente se identifica.</p>
          </div>
        </section>
        <Camisas />
      </main>
      <Rodape />
    </>
  );
}