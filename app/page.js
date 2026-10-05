import { SITE } from "../lib/config";

const DESTAQUES = [
  { icone: "🏛️", titulo: "Eficiência e Serviço Estatal" },
  { icone: "🤝", titulo: "Harmonia Corporativa" },
  { icone: "⚖️", titulo: "Meritocracia e Ordem" },
];

const PILARES = [
  {
    n: "01",
    titulo: "Liderança com Servidão Estatal",
    texto: "Quem lidera, serve. A máquina pública existe para servir ao povo, e não o contrário.",
  },
  {
    n: "02",
    titulo: "Eficiência e Produção Corporativa",
    texto: "Harmonia entre as forças produtivas, o trabalho e a ciência, com foco em resultado.",
  },
  {
    n: "03",
    titulo: "Autonomia do Cidadão e Desburocratização",
    texto: "Menos burocracia e mais liberdade para o cidadão trabalhar, produzir e prosperar.",
  },
  {
    n: "04",
    titulo: "Ordem, Justiça e Meritocracia",
    texto: "Regras claras, justiça para todos e reconhecimento pelo mérito.",
  },
];

export default function Home() {
  return (
    <>
      <header className="topo">
        <div className="container topo-in">
          <a href="#inicio" className="marca" aria-label={SITE.nome}>
            <span className="marca-sigla">LEAO</span>
            <span className="marca-sub">Movimento Nacional</span>
          </a>
          <nav className="menu" aria-label="Principal">
            <a href="#missao">Missão</a>
            <a href="#pilares">Pilares</a>
            <a href="#participe">Participe</a>
          </nav>
          <a className="btn btn-ouro btn-sm" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
            Entre no grupo
          </a>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="container hero-in">
            <p className="selo">Movimento Nacional</p>
            <h1>
              <span className="ouro">Liderança</span> para{" "}
              <span className="ouro">Eficiência</span>, <span className="ouro">Autonomia</span> e{" "}
              <span className="ouro">Ordem</span>
            </h1>
            <p className="lead">Por um Estado que serve ao povo. Harmonia corporativa, meritocracia e liberdade.</p>
            <div className="acoes">
              <a className="btn btn-ouro" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                Entre no grupo →
              </a>
              <a className="btn btn-linha" href="#pilares">
                Conheça os pilares
              </a>
            </div>
            <p className="vanguarda">Vanguarda da reconstrução nacional</p>
          </div>
        </section>

        <section className="destaques" aria-label="Destaques">
          <div className="container destaques-in">
            {DESTAQUES.map((d) => (
              <div className="destaque" key={d.titulo}>
                <span aria-hidden="true">{d.icone}</span>
                <strong>{d.titulo}</strong>
              </div>
            ))}
          </div>
        </section>

        <section id="missao" className="secao">
          <div className="container estreito">
            <h2>Nossa missão</h2>
            <p className="grande">
              O Brasil não suporta mais um Estado pesado, ineficiente e voltado para si mesmo. O LEAO nasce com uma missão
              clara: <strong>fazer a máquina pública servir ao povo, e não o contrário.</strong>
            </p>
            <p>
              Defendemos a harmonia entre as forças produtivas, o trabalho, a ciência e a ordem.
            </p>
          </div>
        </section>

        <section id="pilares" className="secao escura">
          <div className="container">
            <h2 className="centro">Nossos 4 pilares</h2>
            <div className="grade">
              {PILARES.map((p) => (
                <article className="cartao" key={p.n}>
                  <span className="num">{p.n}</span>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="faixa">
          <div className="container">
            <p>Nascemos para liderar a reconstrução nacional.</p>
          </div>
        </section>

        <section id="participe" className="secao">
          <div className="container estreito centro">
            <h2>Junte-se ao movimento</h2>
            <p className="grande">Construindo o futuro do Brasil. Entre no grupo e acompanhe tudo em primeira mão.</p>
            <div className="acoes centro-acoes">
              <a className="btn btn-ouro" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                Entrar no grupo do WhatsApp
              </a>
              <a className="btn btn-linha" href={SITE.x} target="_blank" rel="noopener noreferrer">
                Seguir no X
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="container rodape-in">
          <span>
            <strong>LEAO</strong> · Liderança para Eficiência, Autonomia e Ordem
          </span>
          <a href={SITE.x} target="_blank" rel="noopener noreferrer">
            @MovimentoLEAO
          </a>
        </div>
      </footer>
    </>
  );
}
