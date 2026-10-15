"use client";

import { useMemo, useRef, useState } from "react";
import { SITE } from "../lib/config";
import { calcular, ALIQUOTA_CONSUMO, ENCARGOS_PATRONAIS } from "../lib/imposto";

// Endereço que aparece escrito no cartão de compartilhar.
const DOMINIO_CARTAO = "movimentoleao.com.br";

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const pct = (v) => (v * 100).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) + "%";

function dataDoDia(dia) {
  const d = new Date(2026, 0, dia);
  return `${d.getDate()} de ${MESES[d.getMonth()]}`;
}

// Reduz o tamanho da fonte até o texto caber na largura máxima (evita corte se a fonte não carregar).
function ajustar(g, texto, peso, tam, familia, maxW) {
  let t = tam;
  g.font = `${peso} ${t}px ${familia}`;
  while (t > 12 && g.measureText(texto).width > maxW) {
    t -= 2;
    g.font = `${peso} ${t}px ${familia}`;
  }
  return t;
}

export default function Calculadora() {
  const [texto, setTexto] = useState("4.000");
  const [patronal, setPatronal] = useState(true);
  const [gastoPct, setGastoPct] = useState(85);
  const [msg, setMsg] = useState("");
  const canvasRef = useRef(null);

  const salario = Number(texto.replace(/\./g, "").replace(",", ".")) || 0;
  const r = useMemo(() => (salario > 0 ? calcular({ salario, patronal, gastoPct: gastoPct / 100 }) : null), [salario, patronal, gastoPct]);

  function aoDigitar(e) {
    const so = e.target.value.replace(/\D/g, "").slice(0, 7);
    setTexto(so ? Number(so).toLocaleString("pt-BR") : "");
  }

  const partes = r
    ? [
        { chave: "inss", nome: "Previdência (INSS)", valor: r.inss },
        { chave: "ir", nome: "Imposto de renda", valor: r.ir },
        ...(patronal ? [{ chave: "enc", nome: "Encargos do empregador", valor: r.enc }] : []),
        { chave: "cons", nome: "Impostos no que você compra", valor: r.consumo },
        { chave: "fica", nome: "Fica com você", valor: r.fica },
      ]
    : [];

  const frase = r
    ? `Eu trabalho até ${dataDoDia(r.dia)} só para pagar impostos. De cada R$ 100 que o meu trabalho gera, R$ ${Math.round(r.parte * 100)} vão para o Estado. Calcule o seu:`
    : "";

  async function desenhar() {
    if (document.fonts) {
      await Promise.all([document.fonts.load('800 80px "Barlow Condensed"'), document.fonts.load('600 30px "Barlow"')]).catch(() => {});
    }
    const c = canvasRef.current;
    const W = 1200, H = 675;
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#08183a");
    grad.addColorStop(1, "#050e24");
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    g.fillStyle = "#d9a21b";
    g.fillRect(0, H - 14, W, 14);

    g.textBaseline = "alphabetic";
    g.fillStyle = "#c5cfe6";
    g.font = '600 34px "Barlow", Arial, sans-serif';
    g.fillText("EU TRABALHO ATÉ", 70, 130);
    g.fillStyle = "#ffe08a";
    ajustar(g, dataDoDia(r.dia).toUpperCase(), 800, 190, '"Barlow Condensed", "Arial Narrow", Impact, sans-serif', W - 140);
    g.fillText(dataDoDia(r.dia).toUpperCase(), 66, 300);
    g.fillStyle = "#fff";
    g.font = '700 46px "Barlow Condensed", "Arial Narrow", Impact, sans-serif';
    g.fillText("SÓ PARA PAGAR IMPOSTOS.", 70, 365);
    g.fillStyle = "#c5cfe6";
    g.font = '500 30px "Barlow", Arial, sans-serif';
    g.fillText(`De cada R$ 100 que o meu trabalho gera, R$ ${Math.round(r.parte * 100)} vão para o Estado.`, 70, 418);

    // barra de composição
    const cores = { inss: "#1f54a8", ir: "#3b78d4", enc: "#7fa6e6", cons: "#d9a21b", fica: "#f2f5fa" };
    const x0 = 70, larg = W - 140, y = 470, alt = 46;
    let x = x0;
    partes.forEach((p) => {
      const w = (p.valor / r.base) * larg;
      g.fillStyle = cores[p.chave];
      g.fillRect(x, y, Math.max(w, 0), alt);
      x += w;
    });
    // legenda
    const nomeCurto = (n) => n.replace("Impostos no que você compra", "Consumo").replace("Encargos do empregador", "Encargos").replace("Previdência (INSS)", "INSS").replace("Imposto de renda", "IR").replace("Fica com você", "Fica com você");
    const textos = partes.map((p) => `${nomeCurto(p.nome)} ${pct(p.valor / r.base)}`);
    let tamLeg = 22;
    const larguraLeg = () => { g.font = `600 ${tamLeg}px "Barlow", Arial, sans-serif`; return textos.reduce((a, t) => a + g.measureText(t).width + 28 + 34, 0) - 34; };
    while (tamLeg > 12 && larguraLeg() > larg) tamLeg -= 1;
    g.font = `600 ${tamLeg}px "Barlow", Arial, sans-serif`;
    let lx = x0;
    partes.forEach((p, i) => {
      g.fillStyle = cores[p.chave];
      g.fillRect(lx, y + 70, 18, 18);
      g.fillStyle = "#fff";
      const t = textos[i];
      g.fillText(t, lx + 28, y + 86);
      lx += g.measureText(t).width + 28 + 34;
    });

    g.fillStyle = "#ffe08a";
    const chamada = `CALCULE O SEU: ${DOMINIO_CARTAO.toUpperCase()}/CALCULADORA`;
    ajustar(g, chamada, 800, 40, '"Barlow Condensed", "Arial Narrow", Impact, sans-serif', W - 140 - 0);
    g.fillText(chamada, 70, 620);

    await new Promise((res) => {
      const img = new Image();
      img.onload = () => {
        const h = 70, w = (img.width / img.height) * h;
        g.drawImage(img, W - w - 60, 40, w, h);
        res();
      };
      img.onerror = res;
      img.src = "/logo.png";
    });
  }

  async function baixar() {
    if (!r) return;
    await desenhar();
    canvasRef.current.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "meu-dia-da-liberdade-leao.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      setMsg("Imagem baixada. Anexe ela ao seu post no X.");
    }, "image/png");
  }

  const linkX = r
    ? `https://x.com/intent/post?text=${encodeURIComponent(frase)}&url=${encodeURIComponent(SITE.url + "/calculadora")}`
    : "#";

  return (
    <>
      <section className="bloco bloco-gelo calc-bloco" aria-labelledby="calc-titulo">
        <div className="container calc-grade">
          <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
            <h2 className="calc-h" id="calc-titulo">Quanto você ganha por mês?</h2>
            <label className="calc-label" htmlFor="salario">Salário bruto mensal (CLT)</label>
            <div className="calc-input">
              <span aria-hidden="true">R$</span>
              <input id="salario" inputMode="numeric" autoComplete="off" value={texto} onChange={aoDigitar} placeholder="0" />
            </div>

            <label className="calc-check">
              <input type="checkbox" checked={patronal} onChange={(e) => setPatronal(e.target.checked)} />
              <span>Contar os encargos que o empregador paga por você (≈ {pct(ENCARGOS_PATRONAIS)} da folha)</span>
            </label>

            <label className="calc-label" htmlFor="gasto">
              Quanto do que sobra você gasta: <strong>{gastoPct}%</strong>
            </label>
            <input id="gasto" className="calc-range" type="range" min="50" max="100" step="5" value={gastoPct} onChange={(e) => setGastoPct(Number(e.target.value))} />
            <p className="calc-nota">Valores de 2026, mensais, sem 13º, férias, dependentes ou outros descontos. É uma estimativa, não um cálculo de folha.</p>
          </form>

          <div className="calc-resultado" aria-live="polite">
            {!r ? (
              <p className="calc-vazio">Digite o seu salário para ver o resultado.</p>
            ) : (
              <>
                <p className="calc-pre">Você trabalha até</p>
                <p className="calc-data">{dataDoDia(r.dia)}</p>
                <p className="calc-pos">só para pagar impostos. Só depois disso o dinheiro é seu.</p>
                <p className="calc-destaque">
                  De cada <strong>R$ 100</strong> que o seu trabalho gera, <strong>R$ {Math.round(r.parte * 100)}</strong> vão para o Estado.
                </p>

                <div className="calc-barra" role="img" aria-label={partes.map((p) => `${p.nome}: ${pct(p.valor / r.base)}`).join(", ")}>
                  {partes.map((p) => (
                    <span key={p.chave} className={`calc-seg calc-${p.chave}`} style={{ width: `${(p.valor / r.base) * 100}%` }} />
                  ))}
                </div>
                <ul className="calc-lista">
                  {partes.map((p) => (
                    <li key={p.chave}>
                      <i className={`calc-pt calc-${p.chave}`} aria-hidden="true" />
                      <span>{p.nome}</span>
                      <b>{brl(p.valor)}<small>/mês</small></b>
                    </li>
                  ))}
                </ul>

                <div className="calc-acoes">
                  <a className="pilula pilula-ouro" href={linkX} target="_blank" rel="noopener noreferrer">Compartilhar no X</a>
                  <button type="button" className="pilula pilula-royal" onClick={baixar}>Baixar imagem</button>
                </div>
                {msg && <p className="calc-nota">{msg}</p>}
              </>
            )}
          </div>
        </div>
        <canvas ref={canvasRef} hidden />
      </section>

      <section className="bloco bloco-marinho" aria-labelledby="calc-como">
        <div className="container calc-como">
          <h2 className="titulo-secao junto" id="calc-como">Como calculamos</h2>
          <p className="secao-intro">Cada parte do cálculo usa uma fonte pública. O que é estimativa está marcado como estimativa.</p>
          <ul className="calc-fontes">
            <li><b>INSS:</b> tabela progressiva de 2026 (7,5% a 14%, teto de R$ 8.475,55).</li>
            <li><b>Imposto de renda:</b> tabela vigente, desconto simplificado de R$ 607,20 e a isenção até R$ 5.000 da Lei 15.270/2025, com redução gradual até R$ 7.350.</li>
            <li><b>Encargos do empregador (estimativa):</b> INSS patronal de 20%, RAT médio de 2% e terceiros de cerca de 5,8%. Varia por empresa e não vale para o Simples. Desmarque a opção para ver só o que sai do seu holerite.</li>
            <li><b>Impostos no consumo (estimativa):</b> usamos {pct(ALIQUOTA_CONSUMO)} do preço do que você compra. A base é a arrecadação sobre bens e serviços de 13,91% do PIB em 2024 (Tesouro Nacional), dividida pelo consumo das famílias, que fica em torno de 60% a 65% do PIB (IBGE). Arredondamos para baixo de propósito.</li>
            <li><b>Fora da conta:</b> IPTU, IPVA, taxas, combustíveis acima da média, FGTS e outros. O resultado real tende a ser maior.</li>
          </ul>
          <p className="calc-nota calc-nota-clara">
            Carga tributária bruta do Brasil em 2024: 32,32% do PIB, a maior em 15 anos (Tesouro Nacional).
          </p>
        </div>
      </section>

      <section className="bloco bloco-gelo calc-fim" aria-labelledby="calc-fim-t">
        <div className="container calc-fim-in">
          <h2 className="titulo-secao junto" id="calc-fim-t">E agora?</h2>
          <p className="secao-intro">
            Saber o tamanho do problema é o primeiro passo. O segundo é decidir o que fazer. O LEAO vai discutir e montar, junto com quem participa, um plano nacional. Entre no grupo e ajude a construir.
          </p>
          <a className="pilula pilula-ouro" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">Entrar no grupo do WhatsApp</a>
        </div>
      </section>
    </>
  );
}