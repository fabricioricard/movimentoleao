import { SITE } from "../lib/config";
import { PIX, USOS } from "../lib/doacao-dados";
import CopiarPix from "./CopiarPix";

const PASSOS = [
  ["Abra o app do seu banco", "Escolha a opção PIX e depois “Ler QR Code”."],
  ["Aponte para o código", "Ou toque em “Pix copia e cola” e cole o código ao lado."],
  ["Confira antes de confirmar", "Veja se o nome do recebedor é o que aparece nesta página. Só então escolha o valor e pague."],
];

export default function Doacoes() {
  return (
    <>
      <section className="bloco bloco-gelo doa-pix" aria-labelledby="doa-pix-t">
        <div className="container doa-grade">
          <div className="doa-qr">
            <h2 className="doa-h" id="doa-pix-t">Doe por PIX</h2>
            {PIX.qr ? (
              <div className="doa-qr-caixa">
                <img src={PIX.qr} alt="QR Code do PIX do Movimento LEAO" width="280" height="280" />
              </div>
            ) : (
              <div className="doa-qr-caixa doa-qr-breve">QR Code em breve</div>
            )}
            <p className="doa-qr-leg">Aponte a câmera do app do seu banco.</p>
          </div>

          <div className="doa-dados">
            {PIX.chave && (
              <div className="doa-linha">
                <span className="doa-rot">{PIX.rotuloChave || "Chave PIX"}{PIX.tipoChave ? ` (${PIX.tipoChave})` : ""}</span>
                <code className="doa-chave" id="pix-chave">{PIX.chave}</code>
                <CopiarPix chave={PIX.chave} />
              </div>
            )}
            {PIX.recebedor && (
              <div className="doa-linha">
                <span className="doa-rot">Nome do recebedor</span>
                <strong className="doa-recebedor">{PIX.recebedor}</strong>
                <p className="doa-dica">Esse é o nome que o seu banco mostra antes de você confirmar. Se for outro, não pague.</p>
              </div>
            )}

            <ol className="doa-passos">
              {PASSOS.map(([t, d]) => (
                <li key={t}>
                  <b>{t}</b>
                  <span>{d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bloco bloco-marinho doa-info" aria-labelledby="doa-info-t">
        <div className="container doa-info-grade">
          <div>
            <h2 className="titulo-secao junto" id="doa-info-t">Para que serve</h2>
            <ul className="doa-usos">
              {USOS.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="titulo-secao junto">Antes de doar</h2>
            <ul className="doa-regras">
              <li><b>A doação é voluntária.</b> Doar não dá cargo, posição nem influência no movimento.</li>
              <li><b>O LEAO é um movimento hoje.</b> Não é um partido nem a campanha de um candidato.</li>
              <li><b>Cuidado com golpes.</b> A única chave do movimento é a desta página. Desconfie de quem pedir PIX em nome do LEAO por mensagem privada.</li>
              <li><b>Dúvidas?</b> Fale com a gente no <a href={SITE.x} target="_blank" rel="noopener noreferrer">@MovimentoLEAO</a>.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bloco bloco-royal" aria-labelledby="doa-fim">
        <div className="container chamada">
          <h2 className="chamada-titulo" id="doa-fim">Sem dinheiro? Ajude de outro jeito.</h2>
          <p className="chamada-texto">Entre no grupo, chame um amigo e compartilhe o movimento. Isso também faz o LEAO crescer.</p>
          <div className="chamada-acoes">
            <a className="pilula pilula-ouro pilula-grande" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">Entrar no grupo do WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}