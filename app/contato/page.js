import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";
import Contato from "../../components/Contato";
import "./contato.css";

export const metadata = {
  title: "Contato — LEAO",
  description: "Fale com o Movimento LEAO: e-mail movimentoleao@gmail.com, grupo do WhatsApp e perfil no X.",
  alternates: { canonical: "/contato" },
};

export default function PaginaContato() {
  return (
    <>
      <Topo />
      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Fale com o</span>
              <span className="linha destaque">movimento</span>
            </h1>
            <p className="hero-sub">E-mail, WhatsApp e X.</p>
          </div>
        </section>
        <Contato />
      </main>
      <Rodape />
    </>
  );
}