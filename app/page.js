import { SITE } from "../lib/config";
import VoltarAoTopo from "../components/VoltarAoTopo";

const DESTAQUES = ["Eficiência e Serviço Estatal", "Harmonia Corporativa", "Meritocracia e Ordem"];

const EMBLEMA = [
  { letra: "L", palavra: "Liderança", tom: "azul" },
  { letra: "E", palavra: "Eficiência", tom: "ouro" },
  { letra: "A", palavra: "Autonomia", tom: "ouro" },
  { letra: "O", palavra: "Ordem", tom: "azul" },
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
      <header className="topo">
        <div className="container topo-in">
          <a href="#inicio" className="marca" aria-label={`${SITE.nome} — início`}>
            <img src="/logo.png" alt="Movimento LEAO" className="marca-logo" />
          </a>
          <nav className="menu" aria-label="Principal">
            <a href="#manifesto">Manifesto</a>
            <a href="#pilares">Pilares</a>
            <a href="#participe">Participe</a>
          </nav>
          <div className="topo-acoes">
            <a className="pilula pilula-branca topo-x" href={SITE.x} target="_blank" rel="noopener noreferrer">
              Siga no X
            </a>
            <a className="pilula pilula-ouro" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
              Entre no grupo
            </a>
          </div>
        </div>
      </header>

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
              <a className="botao-linha" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                Entre no grupo <Seta />
              </a>
            </div>

            <div className="emblema" aria-hidden="true">
              {EMBLEMA.map((e) => (
                <div className={`bloco-letra bloco-${e.tom}`} key={e.letra}>
                  <span className="bloco-l">{e.letra}</span>
                  <span className="bloco-p">{e.palavra}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="faixa-destaques" aria-label="Destaques">
          <ul className="container faixa-lista">
            {DESTAQUES.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>

        <section id="manifesto" className="bloco bloco-preto">
          <div className="container manifesto">
            <p className="manifesto-frase">
              O Brasil não suporta mais um Estado pesado, ineficiente e voltado para si mesmo. O LEAO nasce para{" "}
              <mark>fazer a máquina pública servir ao povo, e não o contrário.</mark>
            </p>
            <p className="manifesto-apoio">
              Defendemos a harmonia entre as forças produtivas, o trabalho, a ciência e a ordem.
            </p>
          </div>
        </section>

        <section id="pilares" className="bloco bloco-claro">
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
          </div>
        </section>

        <section id="participe" className="bloco bloco-ouro">
          <div className="container chamada">
            <h2 className="chamada-titulo">Nascemos para liderar a reconstrução nacional.</h2>
            <p className="chamada-texto">
              Construindo o futuro do Brasil. Entre no grupo e acompanhe tudo em primeira mão.
            </p>
            <div className="chamada-acoes">
              <a className="pilula pilula-preta" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                Entrar no grupo do WhatsApp
              </a>
              <a className="pilula pilula-contorno" href={SITE.x} target="_blank" rel="noopener noreferrer">
                Seguir no X
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="container rodape-in">
          <p>
            <strong>LEAO</strong> Liderança para Eficiência, Autonomia e Ordem
          </p>
          <a href={SITE.x} target="_blank" rel="noopener noreferrer">
            @MovimentoLEAO
          </a>
        </div>
      </footer>

      <div className="flutuantes">
      <a className="flutuante" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
        <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true">
          <path
            fill="#fff"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
          />
        </svg>
      </a>
      <VoltarAoTopo />
      </div>
    </>
  );
}