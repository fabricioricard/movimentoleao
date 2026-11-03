import Link from "next/link";
import { SITE } from "../lib/config";

export default function Contato() {
  return (
    <>
      <section className="bloco bloco-gelo con-bloco" aria-labelledby="con-t">
        <div className="container con-grade">
          <div className="con-card con-email">
            <span className="con-rot">E-mail oficial</span>
            <a className="con-endereco" href={`mailto:${SITE.email}`} id="con-t">{SITE.email}</a>
            <p>Para propostas, parcerias, imprensa, denúncias de problemas locais e dúvidas sobre o movimento.</p>
            <a className="pilula pilula-ouro" href={`mailto:${SITE.email}`}>Enviar e-mail</a>
          </div>
          <div className="con-lado">
            <div className="con-card">
              <span className="con-rot">Grupo do WhatsApp</span>
              <p>Para entrar no movimento e conversar com os outros membros.</p>
              <a className="pilula pilula-linha-escura" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">Entrar no grupo</a>
            </div>
            <div className="con-card">
              <span className="con-rot">X (Twitter)</span>
              <p>Acompanhe as publicações e mande mensagem.</p>
              <a className="pilula pilula-linha-escura" href={SITE.x} target="_blank" rel="noopener noreferrer">@MovimentoLEAO</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bloco bloco-marinho con-fim">
        <div className="container con-fim-in">
          <p>Quer uma camisa, falar com o Líder Nacional ou saber como ajudar?</p>
          <div className="con-fim-links">
            <Link href="/camisas">Camisas</Link>
            <Link href="/lideranca">Liderança</Link>
            <Link href="/doacoes">Doações</Link>
          </div>
        </div>
      </section>
    </>
  );
}