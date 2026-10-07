import Link from "next/link";
import { SITE } from "../lib/config";
import Topo from "../components/Topo";
import Rodape from "../components/Rodape";

const DESTAQUES = ["Eficiência e Serviço Estatal", "Harmonia Corporativa", "Meritocracia e Ordem"];

const DEGRAUS = [
  { letra: "L", palavra: "Liderança", tom: "royal" },
  { letra: "E", palavra: "Eficiência", tom: "ouro" },
  { letra: "A", palavra: "Autonomia", tom: "royal" },
  { letra: "O", palavra: "Ordem", tom: "ouro" },
];

const PILARES = [
  {
    letra: "L",
    titulo: "Liderança com Servidão Estatal",
    texto: "Quem lidera, serve. A máquina pública existe para servir ao povo, e não o contrário.",
  },
  {
    letra: "E",
    titulo: "Eficiência e Produção Corporativa",
    texto: "Harmonia entre as forças produtivas, o trabalho e a ciência, com foco em resultado.",
  },
  {
    letra: "A",
    titulo: "Autonomia do Cidadão e Desburocratização",
    texto: "Menos burocracia e mais liberdade para o cidadão trabalhar, produzir e prosperar.",
  },
  {
    letra: "O",
    titulo: "Ordem, Justiça e Meritocracia",
    texto: "Regras claras, justiça para todos e reconhecimento pelo mérito.",
  },
];

function Seta() {
  return (
    <svg className="seta" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M5 12h13m-5-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Topo home />

      <main>
        <section id="inicio" className="hero">
          <div className="container hero-grade">
            <div className="hero-texto">
              <h1 className="hero-titulo">
                <span className="linha">Liderança para</span>
                <span className="linha destaque">Eficiência,</span>
                <span className="linha">Autonomia e Ordem</span>
              </h1>
              <p className="hero-sub">Por um Estado que serve ao povo. Harmonia corporativa, meritocracia e liberdade.</p>
              <a className="botao-ouro" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                Entre no grupo <Seta />
              </a>
            </div>

            <ol className="escada" aria-hidden="true">
              {DEGRAUS.map((e, i) => (
                <li className={`degrau degrau-${e.tom}`} style={{ "--i": i }} key={e.letra}>
                  <span className="degrau-l">{e.letra}</span>
                  <span className="degrau-p">{e.palavra}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="faixa-destaques" aria-label="Destaques">
          <ul className="container faixa-lista">
            {DESTAQUES.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>

        <section id="manifesto" className="bloco bloco-gelo">
          <div className="container manifesto">
            <p className="manifesto-frase">
              O Brasil não suporta mais um Estado pesado, ineficiente e voltado para si mesmo. O LEAO nasce para{" "}
              <mark>fazer a máquina pública servir ao povo, e não o contrário.</mark>
            </p>
            <p className="manifesto-apoio">
              Defendemos a harmonia entre as forças produtivas, o trabalho, a ciência e a ordem.
            </p>
            <Link className="pilula pilula-royal manifesto-link" href="/manifesto">
              Ler o manifesto completo
            </Link>
          </div>
        </section>

        <section id="pilares" className="bloco bloco-marinho">
          <div className="container">
            <h2 className="titulo-secao">Os 4 pilares do LEAO</h2>
            <ol className="pilares">
              {PILARES.map((p) => (
                <li className="pilar" key={p.letra}>
                  <span className="pilar-letra" aria-hidden="true">
                    {p.letra}
                  </span>
                  <div className="pilar-corpo">
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="pilares-link">
              <p>Como o movimento se organiza?</p>
              <Link className="pilula pilula-ouro pilula-grande" href="/posicoes">
                Ver as posições
              </Link>
            </div>
          </div>
        </section>

        <section id="participe" className="bloco bloco-royal">
          <div className="container chamada">
            <h2 className="chamada-titulo">Nascemos para liderar a reconstrução nacional.</h2>
            <p className="chamada-texto">
              Construindo o futuro do Brasil. Entre no grupo e acompanhe tudo em primeira mão.
            </p>
            <div className="chamada-acoes">
              <a className="pilula pilula-ouro pilula-grande" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                Entrar no grupo do WhatsApp
              </a>
              <a className="pilula pilula-linha pilula-grande" href={SITE.x} target="_blank" rel="noopener noreferrer">
                Seguir no X
              </a>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}