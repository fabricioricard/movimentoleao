import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";
import Doacoes from "../../components/Doacoes";
import "./doacoes.css";

export const metadata = {
  title: "Doações — LEAO",
  description: "Apoie o Movimento LEAO com uma doação voluntária por PIX. Veja a chave, o QR Code e os cuidados para doar com segurança.",
  alternates: { canonical: "/doacoes" },
};

export default function PaginaDoacoes() {
  return (
    <>
      <Topo />
      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Apoie o</span>
              <span className="linha destaque">movimento</span>
            </h1>
            <p className="hero-sub">Doação voluntária, por PIX.</p>
          </div>
        </section>
        <Doacoes />
      </main>
      <Rodape />
    </>
  );
}