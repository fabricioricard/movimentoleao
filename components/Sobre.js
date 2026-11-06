import Link from "next/link";
import { SITE } from "../lib/config";
import { ORIGEM, FUNDADORES, SIGLA, PILARES, FASES, ATUACAO } from "../lib/sobre-dados";

export default function Sobre() {
  return (
    <>
      <section className="bloco bloco-gelo sob-bloco" aria-labelledby="sob-origem">
        <div className="container sob-origem">
          <div>
            <h2 className="titulo-secao junto" id="sob-origem">Como surgiu</h2>
            <div className="sob-texto">
              {ORIGEM.map((p, i) => <p key={i} className={i === 0 ? "sob-destaque" : ""}>{p}</p>)}
            </div>
          </div>
          <ul className="sob-sigla" aria-label="O significado de LEAO">
            {SIGLA.map((s) => (
              <li key={s.letra}><b>{s.letra}</b><span>{s.palavra}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bloco bloco-marinho sob-bloco" aria-labelledby="sob-fund">
        <div className="container">
          <h2 className="titulo-secao junto" id="sob-fund">Quem fundou</h2>
          <p className="secao-intro">Dois irmãos baianos. O movimento começou com eles e cresce com quem se junta.</p>
          <ul className="sob-fund">
            {FUNDADORES.map((f) => (
              <li key={f.nome} className="sob-pessoa">
                <img src={f.foto} alt={`Foto de ${f.nome}`} width="480" height="480" loading="lazy" />
                <div>
                  <span className="sob-papel">{f.papel}</span>
                  <h3>{f.nome}</h3>
                  <p>{f.cargo}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bloco bloco-gelo sob-bloco" aria-labelledby="sob-pil">
        <div className="container">
          <h2 className="titulo-secao junto" id="sob-pil">No que acreditamos</h2>
          <ul className="sob-pilares">
            {PILARES.map((p, i) => (
              <li key={p.t}><span className="sob-num">{i + 1}</span><h3>{p.t}</h3><p>{p.d}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bloco bloco-marinho sob-bloco" aria-labelledby="sob-jornada">
        <div className="container">
          <h2 className="titulo-secao junto" id="sob-jornada">Do movimento ao partido</h2>
          <p className="secao-intro">Um plano em três fases.</p>
          <ol className="sob-fases">
            {FASES.map((f) => (
              <li key={f.n} className={f.atual ? "sob-atual" : ""}>
                <span className="sob-fase-n">Fase {f.n}{f.atual && <em> · estamos aqui</em>}</span>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bloco bloco-gelo sob-bloco" aria-labelledby="sob-hoje">
        <div className="container">
          <h2 className="titulo-secao junto" id="sob-hoje">O que já fazemos</h2>
          <ul className="sob-atuacao">
            {ATUACAO.map((a) => (
              <li key={a.t}>
                <h3>{a.t}</h3>
                <p>{a.d}</p>
                <Link href={a.href}>{a.rotulo} →</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bloco bloco-royal" aria-labelledby="sob-fim">
        <div className="container chamada">
          <h2 className="chamada-titulo" id="sob-fim">O leão protege o seu povo.</h2>
          <p className="chamada-texto">Junte-se à liderança e construa essa história desde o primeiro dia.</p>
          <div className="chamada-acoes">
            <a className="pilula pilula-ouro pilula-grande" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">Entrar no grupo do WhatsApp</a>
            <Link className="pilula pilula-linha pilula-grande" href="/contato">Falar com o movimento</Link>
          </div>
        </div>
      </section>
    </>
  );
}