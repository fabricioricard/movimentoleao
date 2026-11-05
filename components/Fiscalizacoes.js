import Link from "next/link";
import { FISCALIZACOES, SITUACOES } from "../lib/fiscalizacoes-dados";

const pad = (n) => String(n).padStart(2, "0");
function data(iso) {
  if (!iso) return null;
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}
function hojeISO() {
  const h = new Date(Date.now() - 3 * 3600 * 1000); // horário de Brasília
  return `${h.getUTCFullYear()}-${pad(h.getUTCMonth() + 1)}-${pad(h.getUTCDate())}`;
}

export default function Fiscalizacoes() {
  const hoje = hojeISO();
  const casos = FISCALIZACOES.map((c) => ({
    ...c,
    pedidos: c.pedidos.map((p) => ({ ...p, vencido: p.situacao === "aguardando" && !!p.prazo && p.prazo < hoje })),
  }));
  const todos = casos.flatMap((c) => c.pedidos);
  const n = (f) => todos.filter(f).length;

  return (
    <>
      <section className="bloco bloco-gelo fis-bloco" aria-labelledby="fis-t">
        <div className="container">
          <h2 className="titulo-secao junto" id="fis-t">Cada pedido, acompanhado até o fim</h2>
          <p className="secao-intro">
            O Movimento LEAO não só faz perguntas: mantém um registro público do que perguntou, a quem, quando, e do que foi respondido. Quando o órgão responde, a resposta aparece aqui.
          </p>

          <ul className="fis-placar" aria-label="Resumo">
            <li><b>{todos.length}</b><span>pedidos enviados</span></li>
            <li><b>{n((p) => p.situacao === "aguardando")}</b><span>aguardando resposta</span></li>
            <li><b>{n((p) => p.situacao === "respondido" || p.situacao === "parcial")}</b><span>com resposta</span></li>
            <li><b>{n((p) => p.vencido || p.situacao === "sem_resposta")}</b><span>sem resposta no prazo</span></li>
          </ul>

          <ol className="fis-lista">
            {casos.map((c) => (
              <li key={c.id} className="fis-caso" id={c.id}>
                <span className="fis-ref">{c.referencia}</span>
                <h3>{c.titulo}</h3>

                <ul className="fis-pedidos">
                  {c.pedidos.map((p) => {
                    const sit = SITUACOES[p.situacao] || SITUACOES.aguardando;
                    return (
                      <li key={p.orgao} className="fis-pedido">
                        <div className="fis-topo">
                          <div>
                            <span className="fis-rot">Órgão questionado</span>
                            <strong className="fis-orgao">{p.orgao}</strong>
                          </div>
                          <span className="fis-pilulas">
                            <span className={`fis-sit fis-${sit.cor}`}>{sit.rotulo}</span>
                            {p.vencido && <span className="fis-sit fis-alerta">Prazo vencido</span>}
                          </span>
                        </div>

                        <dl className="fis-campos">
                          <div className="fis-campo"><dt>Canal</dt><dd>{p.canal || <em>A informar</em>}</dd></div>
                          <div className="fis-campo"><dt>Protocolo</dt><dd>{p.protocolo || <em>A informar</em>}</dd></div>
                          <div className="fis-campo"><dt>Enviado em</dt><dd>{data(p.enviadoEm) || <em>A informar</em>}</dd></div>
                          <div className="fis-campo"><dt>Prazo</dt><dd>{data(p.prazo) || <em>Sem prazo definido</em>}</dd></div>
                        </dl>

                        <div className={`fis-resposta ${p.resposta ? "fis-resposta-ok" : ""}`}>
                          <strong>Resposta recebida</strong>
                          {p.resposta ? (
                            <>
                              <p>{p.resposta.resumo}</p>
                              <span className="fis-resp-meta">
                                {p.resposta.data && <>Recebida em {data(p.resposta.data)}. </>}
                                {p.resposta.link && <a href={p.resposta.link} target="_blank" rel="noopener noreferrer">Ver o documento</a>}
                              </span>
                            </>
                          ) : (
                            <p>Nenhuma resposta recebida até agora.</p>
                          )}
                        </div>

                        {p.historico && p.historico.length > 0 && (
                          <ul className="fis-hist" aria-label="Histórico">
                            {p.historico.map((h, i) => <li key={i}><b>{data(h.data)}</b> {h.texto}</li>)}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {c.copia && <p className="fis-copia"><b>Em cópia, para conhecimento:</b> {c.copia}</p>}

                <details className="fis-pontos">
                  <summary>O que foi perguntado ({c.pontos.length})</summary>
                  <ol>{c.pontos.map((pt) => <li key={pt}>{pt}</li>)}</ol>
                </details>

                {c.materia && <Link className="fis-materia" href={`/noticias/${c.materia}`}>Ler a matéria →</Link>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bloco bloco-marinho fis-fim">
        <div className="container fis-fim-in">
          <p>Viu um gasto público que merece pergunta? Mande para o Movimento.</p>
          <div className="fis-fim-links">
            <Link href="/contato">Falar com o movimento</Link>
            <Link href="/noticias">Voltar à revista</Link>
          </div>
        </div>
      </section>
    </>
  );
}