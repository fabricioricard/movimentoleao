import Link from "next/link";
import { SITE } from "../lib/config";
import { CAMISAS } from "../lib/camisas-dados";

export default function Camisas() {
  return (
    <>
      <section className="bloco bloco-gelo cam-bloco" aria-labelledby="cam-t">
        <div className="container">
          <h2 className="titulo-secao junto" id="cam-t">Vista o movimento</h2>
          <p className="secao-intro">
            Recomendamos que todos os membros usem a camisa do LEAO na rua. Assim a gente se reconhece, se encontra e mostra que o movimento existe.
          </p>
          <ul className="cam-grade">
            {CAMISAS.map((c) => (
              <li className="cam-card" key={c.nome}>
                <div className="cam-foto"><img src={c.img} alt={c.nome} width="600" height="731" loading="lazy" /></div>
                <h3>{c.nome}</h3>
                <p>{c.desc}</p>
              </li>
            ))}
            <li className="cam-card cam-breve">
              <div className="cam-foto cam-foto-breve"><span>Em breve</span></div>
              <h3>Mais modelos</h3>
              <p>Novos modelos estão a caminho.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="bloco bloco-marinho cam-como" aria-labelledby="cam-como-t">
        <div className="container cam-como-grade">
          <div>
            <h2 className="titulo-secao junto" id="cam-como-t">Como conseguir a sua</h2>
            <p className="cam-texto">Fale com o <b>Líder Nacional</b>. Se você quer a camisa mas não tem dinheiro para comprar, nós mandamos de graça.</p>
          </div>
          <div className="cam-acoes">
            <a className="pilula pilula-ouro pilula-grande" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">Falar pelo grupo do WhatsApp</a>
            <a className="pilula pilula-linha pilula-grande" href={SITE.x} target="_blank" rel="noopener noreferrer">Chamar no X</a>
            <Link className="cam-link" href="/lideranca">Ver quem é o Líder Nacional</Link>
          </div>
        </div>
      </section>
    </>
  );
}