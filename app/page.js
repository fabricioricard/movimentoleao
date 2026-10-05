import { SITE } from "../lib/config";

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
            <span className="marca-sigla">LEAO</span>
            <span className="marca-sub">Movimento Nacional</span>
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

      <a className="flutuante" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path
            fill="#fff"
            d="M12 3C7 3 3 6.8 3 11.5c0 1.9.7 3.700 1.900 5.100L4 21l4.600-1.300c1 .4 2.200.6 3.400.6 5 0 9-3.800 9-8.500S17 3 12 3Z"
          />
          <circle cx="8.500" cy="11.500" r="1.200" fill="#25d366" />
          <circle cx="12" cy="11.500" r="1.200" fill="#25d366" />
          <circle cx="15.500" cy="11.500" r="1.200" fill="#25d366" />
        </svg>
      </a>
    </>
  );
}