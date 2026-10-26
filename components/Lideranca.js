import Link from "next/link";
import { SITE } from "../lib/config";
import { COMO, NACIONAL, REGIOES, LATERAIS } from "../lib/lideranca-dados";

function Silhueta() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5z" />
    </svg>
  );
}

function iniciais(nome) {
  const p = nome.trim().split(/\s+/);
  return ((p[0] || "")[0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
}

function Avatar({ ocupante }) {
  if (ocupante && ocupante.foto) {
    return (
      <span className="org-avatar">
        <img src={ocupante.foto} alt="" />
      </span>
    );
  }
  if (ocupante && ocupante.nome) {
    return <span className="org-avatar org-avatar-nome">{iniciais(ocupante.nome)}</span>;
  }
  return (
    <span className="org-avatar org-avatar-vaga">
      <Silhueta />
    </span>
  );
}

function Pessoa({ ocupante }) {
  if (ocupante && ocupante.nome) return <span className="org-pessoa">{ocupante.nome}{ocupante.asterisco ? <sup className="org-ast" aria-label="ver nota">*</sup> : null}</span>;
  return <span className="org-vaga-tag">Vaga aberta</span>;
}

function Cartao({ cargo, lugar, como, ocupante, nivel, compacto = false }) {
  return (
    <article className={`org-card org-n-${nivel}${compacto ? " org-compacto" : ""}${ocupante ? "" : " org-vazio"}`}>
      <Avatar ocupante={ocupante} />
      <div className="org-texto">
        <span className="org-cargo">{cargo}</span>
        {lugar && <h3 className="org-lugar">{lugar}</h3>}
        <Pessoa ocupante={ocupante} />
        {como && !compacto && <p className="org-como">{como}</p>}
      </div>
    </article>
  );
}

function contar() {
  let total = 0;
  let vagas = 0;
  const soma = (o) => {
    total += 1;
    if (!(o && o.nome)) vagas += 1;
  };
  soma(NACIONAL.ocupante);
  REGIOES.forEach((r) => {
    soma(r.ocupante);
    r.estados.forEach((e) => {
      soma(e.ocupante);
      e.cidades.forEach((c) => soma(c.ocupante));
    });
  });
  LATERAIS.forEach((l) => {
    if (l.contar === false) return;
    l.vagas.forEach(soma);
  });
  return { total, vagas, preenchidas: total - vagas };
}

export default function Lideranca() {
  const { total, vagas, preenchidas } = contar();
  const nCidades = REGIOES.reduce((a, r) => a + r.estados.reduce((b, e) => b + e.cidades.length, 0), 0);

  return (
    <>
      <section className="bloco bloco-marinho org-bloco" aria-labelledby="org-titulo">
        <div className="container">
          <h2 className="titulo-secao junto" id="org-titulo">Quem lidera hoje</h2>
          <p className="secao-intro">
            O LEAO está começando. O fundador lidera por enquanto e as demais posições estão com a vaga aberta.
          </p>

          <ul className="org-placar" aria-label="Resumo">
            <li><b>{total}</b><span>posições no esquema</span></li>
            <li><b>{preenchidas}</b><span>preenchidas</span></li>
            <li><b>{vagas}</b><span>vagas abertas</span></li>
          </ul>

          <div className="org" style={{ "--n": REGIOES.length }}>
            <div className="org-topo">
              <Cartao cargo="Líder Nacional" lugar="Brasil" como={(NACIONAL.ocupante && NACIONAL.ocupante.como) || COMO.nacional} ocupante={NACIONAL.ocupante} nivel="nacional" />
              {NACIONAL.nota && NACIONAL.ocupante && NACIONAL.ocupante.asterisco && (
                <p className="org-rodape-nota"><span aria-hidden="true">*</span> {NACIONAL.nota}</p>
              )}
            </div>

            <ul className="org-regioes">
              {REGIOES.map((r) => (
                <li className="org-regiao" key={r.nome}>
                  <Cartao cargo="Líder Regional" lugar={r.nome} como={COMO.regional} ocupante={r.ocupante} nivel="regional" />
                  <ul className="org-estados">
                    {r.estados.map((e) => (
                      <li className="org-estado" key={e.uf}>
                        <Cartao cargo="Líder Estadual" lugar={`${e.nome} · ${e.uf}`} como={COMO.estadual} ocupante={e.ocupante} nivel="estadual" />
                        <ul className="org-cidades">
                          {e.cidades.map((c) => (
                            <li key={c.nome}>
                              <Cartao cargo="Líder Municipal" lugar={`${c.nome} · ${e.uf}`} ocupante={c.ocupante} nivel="municipal" compacto />
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <p className="org-nota">
              Por enquanto o esquema mostra {nCidades} {nCidades === 1 ? "cidade" : "cidades"}. As outras regiões, estados e cidades entram aqui conforme forem abertos. Cada Líder Municipal é escolhido pelo Líder Estadual.
            </p>

            <div className="org-recrutas">
              <Avatar ocupante={null} />
              <div>
                <span className="org-cargo">Recrutas</span>
                <h3 className="org-lugar">Todo mundo começa aqui</h3>
                <p className="org-como">Quem entra no grupo hoje já é Recruta. Basta entrar, sem outro requisito. A partir daí, a pessoa pode ser escolhida para liderar a sua cidade.</p>
              </div>
              <a className="pilula pilula-ouro" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">Quero ser Recruta</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bloco bloco-gelo org-lateral" aria-labelledby="org-lat-titulo">
        <div className="container">
          <h2 className="titulo-secao junto" id="org-lat-titulo">Ao lado da escada</h2>
          <p className="secao-intro">Propaganda, Conselho e Honraria estão com as vagas abertas.</p>
          <ul className="org-lat-grade">
            {LATERAIS.map((l) => (
              <li className="org-lat-card" key={l.nome}>
                <h3>{l.nome}</h3>
                <p className="org-lat-quem">{l.quem}</p>
                <ul className="org-lat-vagas">
                  {l.vagas.map((o, i) => (
                    <li key={i} className={o && o.nome ? "" : "org-lat-vaga"}>
                      <Avatar ocupante={o} />
                      <span>{o && o.nome ? o.nome : "Vaga aberta"}</span>
                    </li>
                  ))}
                </ul>
                <p className="org-lat-como"><b>Como chega:</b> {l.como}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bloco bloco-royal" aria-labelledby="org-fim">
        <div className="container chamada">
          <h2 className="chamada-titulo" id="org-fim">Uma vaga pode ser sua.</h2>
          <p className="chamada-texto">Entre no grupo, comece como Recruta e mostre o que faz pela sua cidade.</p>
          <div className="chamada-acoes">
            <a className="pilula pilula-ouro pilula-grande" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">Entrar no grupo do WhatsApp</a>
            <Link className="pilula pilula-linha pilula-grande" href="/posicoes">Ver como se chega a cada posição</Link>
          </div>
        </div>
      </section>
    </>
  );
}
