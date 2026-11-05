import Link from "next/link";
import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";
import Noticias from "../../components/Noticias";
import "./noticias.css";

export const metadata = {
  title: "Revista — LEAO",
  description: "A revista do Movimento LEAO: as principais atitudes e posicionamentos do movimento.",
  alternates: { canonical: "/noticias" },
};

export default function PaginaNoticias() {
  return (
    <>
      <Topo />
      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Revista do</span>
              <span className="linha destaque">movimento</span>
            </h1>
            <p className="hero-sub">As principais atitudes do LEAO, registradas.</p>
            <Link className="pilula pilula-ouro" href="/fiscalizacoes">Acompanhamento das fiscalizações</Link>
          </div>
        </section>
        <Noticias />
      </main>
      <Rodape />
    </>
  );
}