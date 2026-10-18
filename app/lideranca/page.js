import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";
import Lideranca from "../../components/Lideranca";
import "./lideranca.css";

export const metadata = {
  title: "Quem lidera — LEAO",
  description:
    "O esquema de lideranças do Movimento LEAO: Líder Nacional, regionais, estaduais e municipais, Propaganda, Conselho e Honraria, e quais vagas estão abertas.",
  alternates: { canonical: "/lideranca" },
};

export default function PaginaLideranca() {
  return (
    <>
      <Topo />
      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Quem lidera</span>
              <span className="linha destaque">o movimento</span>
            </h1>
            <p className="hero-sub">O esquema de lideranças e as vagas abertas.</p>
          </div>
        </section>
        <Lideranca />
      </main>
      <Rodape />
    </>
  );
}