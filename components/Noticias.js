import Link from "next/link";
import { NOTICIAS } from "../lib/noticias-dados";

export default function Noticias() {
  const total = NOTICIAS.length;
  const [destaque, ...resto] = NOTICIAS;
  return (
    <section className="bloco bloco-gelo rev-bloco" aria-labelledby="rev-t">
      <div className="container">
        <h2 className="titulo-secao junto" id="rev-t">Últimas atitudes</h2>
        <p className="secao-intro">O que o Movimento tem feito, registrado aqui. Mais novas primeiro.</p>

        <Link href={`/noticias/${destaque.slug}`} className="rev-destaque">
          <span className="rev-tag">{destaque.tag} · nº {total}</span>
          <h3>{destaque.titulo}</h3>
          <p>{destaque.resumo}</p>
          <span className="rev-ler">Ler matéria completa →</span>
        </Link>

        {resto.length > 0 && (
          <ul className="rev-grade">
            {resto.map((n, i) => (
              <li key={n.slug}>
                <Link href={`/noticias/${n.slug}`} className="rev-card">
                  <span className="rev-tag">{n.tag} · nº {total - 1 - i}</span>
                  <h3>{n.titulo}</h3>
                  <p>{n.resumo}</p>
                  <span className="rev-ler">Ler →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}