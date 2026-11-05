import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";
import Fiscalizacoes from "../../components/Fiscalizacoes";
import "./fiscalizacoes.css";

// Atualiza a página de hora em hora, para o aviso de "prazo vencido" acompanhar o calendário.
export const revalidate = 3600;

export const metadata = {
  title: "Acompanhamento das fiscalizações — LEAO",
  description: "Registro público das fiscalizações do Movimento LEAO: órgão questionado, protocolo, prazo, situação e resposta recebida de cada pedido.",
  alternates: { canonical: "/fiscalizacoes" },
};

export default function PaginaFiscalizacoes() {
  return (
    <>
      <Topo />
      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Acompanhe as</span>
              <span className="linha destaque">fiscalizações</span>
            </h1>
            <p className="hero-sub">Órgão, protocolo, prazo, situação e resposta de cada pedido.</p>
          </div>
        </section>
        <Fiscalizacoes />
      </main>
      <Rodape />
    </>
  );
}