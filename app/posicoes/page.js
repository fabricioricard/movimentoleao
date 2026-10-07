import Link from "next/link";
import { SITE } from "../../lib/config";
import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";

export const metadata = {
  title: "Posições do movimento — LEAO",
  description:
    "Quem faz o quê no Movimento LEAO e como se chega a cada posição: Novato, Líder Municipal, Líder Estadual, Líder Nacional, Propaganda, Conselho e Honraria.",
};

// A escada: posições em sequência, uma depois da outra.
const ESCADA = [
  {
    nome: "Novato",
    quem: "Acabou de entrar.",
    como: "Cadastro e 1ª missão cumprida.",
  },
  {
    nome: "Líder Municipal",
    quem: "Lidera o grupo da sua cidade.",
    como: "Constância por 30 a 60 dias, mais indicação e validação do grupo.",
  },
  {
    nome: "Líder Estadual",
    quem: "Coordena os líderes municipais do estado.",
    como: "Cidades ativas sob sua liderança e mandato fixo.",
  },
  {
    nome: "Líder Nacional",
    quem: "Coordena o movimento em nível nacional.",
    como: "Escolhido pelo Conselho, com mandato fixo.",
  },
];

// Posições que funcionam ao lado da escada.
const LATERAIS = [
  {
    nome: "Propaganda",
    quem: "Cuida de conteúdo, discurso e redes.",
    como: "Função aberta a qualquer nível, por seleção.",
  },
  {
    nome: "Conselho",
    quem: "Decide os rumos do movimento.",
    como: "3 a 5 pessoas, eleitas pelos líderes, com mandato fixo.",
  },
  {
    nome: "Honraria",
    quem: "Reconhecimento por feitos, fora da escada.",
    como: "Vagas limitadas, por desempenho.",
  },
];

export default function Posicoes() {
  return (
    <>
      <Topo />

      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Posições</span>
              <span className="linha destaque">do movimento</span>
            </h1>
            <p className="hero-sub">Quem faz o quê no LEAO e como se chega a cada posição.</p>
          </div>
        </section>

        <section className="bloco bloco-marinho" aria-labelledby="titulo-escada">
          <div className="container">
            <h2 className="titulo-secao junto" id="titulo-escada">
              A escada
            </h2>
            <p className="secao-intro">Quatro posições, uma depois da outra. Cada degrau tem uma função e um jeito de chegar.</p>
            <ol className="sobe">
              {ESCADA.map((p, i) => (
                <li className="sobe-card" style={{ "--i": i }} key={p.nome}>
                  <span className="sobe-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{p.nome}</h3>
                  <dl>
                    <dt>Quem é</dt>
                    <dd>{p.quem}</dd>
                    <dt>Como chega</dt>
                    <dd>{p.como}</dd>
                  </dl>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bloco bloco-gelo" aria-labelledby="titulo-alem">
          <div className="container">
            <h2 className="titulo-secao junto" id="titulo-alem">
              Além da escada
            </h2>
            <p className="secao-intro">Três posições que funcionam ao lado dela: conteúdo, decisão e reconhecimento.</p>
            <ul className="laterais">
              {LATERAIS.map((p) => (
                <li className="lateral" key={p.nome}>
                  <h3>{p.nome}</h3>
                  <dl>
                    <dt>Quem é</dt>
                    <dd>{p.quem}</dd>
                    <dt>Como chega</dt>
                    <dd>{p.como}</dd>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bloco bloco-royal">
          <div className="container chamada">
            <h2 className="chamada-titulo">Comece pelo primeiro degrau.</h2>
            <p className="chamada-texto">Entre no grupo e dê o primeiro passo.</p>
            <div className="chamada-acoes">
              <a className="pilula pilula-ouro pilula-grande" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                Entrar no grupo do WhatsApp
              </a>
              <Link className="pilula pilula-linha pilula-grande" href="/">
                Voltar ao início
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}