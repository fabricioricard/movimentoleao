import Link from "next/link";
import { SITE } from "../lib/config";
import Topo from "./Topo";
import Rodape from "./Rodape";
import RolarAoCarregar from "./RolarAoCarregar";
import { NOTICIAS } from "../lib/noticias-dados";
import { FISCALIZACOES } from "../lib/fiscalizacoes-dados";
import "../app/destaques-home.css";

const DESTAQUES = ["Eficiência e Serviço Estatal", "Harmonia Corporativa", "Meritocracia e Ordem"];

const DEGRAUS = [
  { letra: "L", palavra: "Liderança", tom: "royal" },
  { letra: "E", palavra: "Eficiência", tom: "ouro" },
  { letra: "A", palavra: "Autonomia", tom: "royal" },
  { letra: "O", palavra: "Ordem", tom: "ouro" },
];

function Seta() {
  return (
    <svg className="seta" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M5 12h13m-5-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Conteúdo da home. As rotas /pilares e /participe (links antigos) usam o mesmo conteúdo e rolam até a âncora (prop alvo).
export default function Inicio({ alvo }) {
  const materia = NOTICIAS[0]; // a primeira da lista é a mais nova

  return (
    <>
      {alvo && <RolarAoCarregar id={alvo} />}
      <Topo home />

      <main>
        <section id="inicio" className="hero">
          <div className="container hero-grade">
            <div className="hero-texto" id="participe">
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
          <span id="pilares" aria-hidden="true" />
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

        <section id="destaques" className="bloco bloco-gelo dh" aria-labelledby="dh-t">
          <div className="container">
            <h2 className="titulo-secao junto" id="dh-t">Destaques do Movimento</h2>
            <p className="secao-intro">O que o LEAO está fazendo agora.</p>

            <div className="dh-grade">
              {materia && (
                <Link href={`/noticias/${materia.slug}`} className="dh-card dh-materia">
                  <span className="dh-tag">Última da revista · {materia.tag}</span>
                  <h3>{materia.titulo}</h3>
                  <p>{materia.resumo}</p>
                  <span className="dh-ver">Ler a matéria <Seta /></span>
                </Link>
              )}

              <Link href="/calculadora" className="dh-card dh-calc">
                <span className="dh-tag">Calculadora</span>
                <h3>Até que dia você trabalha para o Estado?</h3>
                <p>Digite o seu salário e descubra o seu Dia da Liberdade. Leva dez segundos.</p>
                <span className="dh-ver">Usar a calculadora <Seta /></span>
              </Link>

              <Link href="/fiscalizacoes" className="dh-card">
                <span className="dh-tag">Fiscalização</span>
                <h3>Acompanhamento das fiscalizações</h3>
                <p>
                  {FISCALIZACOES.length} {FISCALIZACOES.length === 1 ? "fiscalização acompanhada" : "fiscalizações acompanhadas"}, cada uma com órgão, protocolo, prazo e resposta.
                </p>
                <span className="dh-ver">Ver o registro <Seta /></span>
              </Link>

              <Link href="/lideranca" className="dh-card">
                <span className="dh-tag">Liderança</span>
                <h3>Quem lidera o movimento</h3>
                <p>Do Líder Nacional aos municípios, com as vagas abertas à vista de todos.</p>
                <span className="dh-ver">Ver a liderança <Seta /></span>
              </Link>

              <Link href="/camisas" className="dh-card">
                <span className="dh-tag">Camisas</span>
                <h3>Vista o movimento</h3>
                <p>Use a camisa do LEAO na rua. Quem não pode pagar recebe de graça.</p>
                <span className="dh-ver">Ver as camisas <Seta /></span>
              </Link>
            </div>

            <p className="dh-mais">
              <Link href="/noticias">Ver toda a revista</Link>
              <Link href="/sobre">Conhecer o movimento</Link>
            </p>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}