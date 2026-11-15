import Link from "next/link";
import { SITE } from "../../lib/config";
import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";

export const metadata = {
  title: "Posições do movimento — LEAO",
  description:
    "Quem faz o quê no Movimento LEAO e como se chega a cada posição: Recruta, Líder Municipal, Líder Estadual, Líder Regional, Líder Nacional, Propaganda, Conselho Nacional e Honraria. Também a estrutura formal: Assembleia Geral, Diretoria Executiva e Conselho Fiscal.",
};

// A escada: posições em sequência, uma depois da outra.
const ESCADA = [
  {
    nome: "Recruta",
    quem: "Acabou de entrar.",
    como: "Basta entrar, sem outro requisito.",
  },
  {
    nome: "Líder Municipal",
    quem: "Lidera o grupo da sua cidade.",
    como: "Escolhido pelo Líder Estadual.",
  },
  {
    nome: "Líder Estadual",
    quem: "Coordena os líderes municipais do estado.",
    como: "Escolhido pelo Líder Regional.",
  },
  {
    nome: "Líder Regional",
    quem: "Coordena os líderes estaduais da sua região.",
    como: "Escolhido pelo Líder Nacional.",
  },
  {
    nome: "Líder Nacional",
    quem: "Coordena o movimento em nível nacional.",
    como: "Escolhido pelo Conselho Nacional, com mandato de 4 anos.",
  },
];

// Posições que funcionam ao lado da escada.
const LATERAIS = [
  {
    nome: "Propaganda",
    quem: "Equipe que cuida de conteúdo, discurso e redes.",
    como: "A equipe é formada por pessoas escolhidas pelo Líder Nacional, que também define sua composição.",
  },
  {
    nome: "Conselho Nacional",
    quem: "Decide os rumos do movimento.",
    como: "Eleitos diretamente pelos associados formalizados em pleno gozo de seus direitos associativos. São 5 integrantes, com mandato de 4 anos.",
  },
  {
    nome: "Honraria",
    quem: "Reconhecimento por feitos, fora da escada.",
    como: "Vagas limitadas, por desempenho.",
  },
];

// Estrutura formal da organização.
const ESTRUTURA = [
  {
    nome: "Assembleia Geral",
    papel: "Reúne todos os associados formalizados em pleno gozo de seus direitos associativos. É a instância soberana da associação.",
  },
  {
    nome: "Diretoria Executiva",
    papel: "Composta por Presidente, Secretário-Geral e Tesoureiro. A Diretoria administra a associação, enquanto a Tesouraria, sob responsabilidade do Tesoureiro, controla receitas, despesas e recursos financeiros.",
  },
  {
    nome: "Conselho Fiscal",
    papel: "Três integrantes que fiscalizam as contas.",
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
            <p className="secao-intro">Cinco posições, uma depois da outra. Cada degrau tem uma função e um jeito de chegar.</p>
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
            <p className="secao-intro" style={{ marginTop: 28 }}>
              A condição de Recruta não implica admissão automática como associado formal. Os direitos associativos e o direito a voto dependem de admissão conforme o Estatuto Social.
            </p>
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

        <section className="bloco bloco-marinho" aria-labelledby="titulo-estrutura">
          <div className="container">
            <h2 className="titulo-secao junto" id="titulo-estrutura">
              Estrutura
            </h2>
            <p className="secao-intro">A organização formal do movimento: quem reúne os associados, quem executa e quem fiscaliza.</p>
            <ul className="laterais">
              {ESTRUTURA.map((p) => (
                <li className="lateral" key={p.nome}>
                  <h3 style={{ color: "var(--tinta)" }}>{p.nome}</h3>
                  <dl>
                    <dt>Papel</dt>
                    <dd>{p.papel}</dd>
                  </dl>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px" }}>
              <span className="secao-intro" style={{ margin: 0 }}>Leia aqui o Estatuto:</span>
              <a className="pilula pilula-ouro" href="/estatuto-social.pdf" target="_blank" rel="noopener noreferrer">
                Estatuto Social (PDF)
              </a>
            </div>
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