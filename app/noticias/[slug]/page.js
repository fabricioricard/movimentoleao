import Link from "next/link";
import { notFound } from "next/navigation";
import Topo from "../../../components/Topo";
import Rodape from "../../../components/Rodape";
import { NOTICIAS } from "../../../lib/noticias-dados";
import "../noticias.css";

export function generateStaticParams() {
  return NOTICIAS.map((n) => ({ slug: n.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const n = NOTICIAS.find((x) => x.slug === slug);
  if (!n) return {};
  return { title: `${n.titulo} — LEAO`, description: n.resumo, alternates: { canonical: `/noticias/${n.slug}` } };
}

export default async function Materia({ params }) {
  const { slug } = await params;
  const n = NOTICIAS.find((x) => x.slug === slug);
  if (!n) notFound();
  return (
    <>
      <Topo />
      <main>
        <section className="bloco bloco-gelo art-bloco">
          <div className="container">
            <article className="art">
              <span className="art-tag">{n.tag}</span>
              <h1>{n.titulo}</h1>
              <p className="art-resumo">{n.resumo}</p>
              {n.corpo.map((b, i) =>
                b.h ? <h2 key={i}>{b.h}</h2> : b.ul ? <ul key={i}>{b.ul.map((t) => <li key={t}>{t}</li>)}</ul> : b.ol ? <ol key={i}>{b.ol.map((t) => <li key={t}>{t}</li>)}</ol> : <p key={i}>{b.p}</p>
              )}
              <p className="art-ass">Movimento LEAO{n.assinatura && n.assinatura !== "Movimento LEAO" ? <span>{n.assinatura}</span> : null}</p>
              <Link href="/noticias" className="art-voltar">← Voltar à revista</Link>
            </article>
          </div>
        </section>
      </main>
      <Rodape />
    </>
  );
}