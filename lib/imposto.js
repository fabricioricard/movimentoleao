// Cálculo dos tributos de um trabalhador CLT, valores mensais, tabelas de 2026.
// Fontes: INSS (tabela 2026), IRRF (tabela vigente desde mai/2025 + redutor da Lei 15.270/2025),
// carga tributária 2024 (Tesouro Nacional).

export const INSS_TETO = 8475.55;
const INSS_FAIXAS = [
  { ate: 1621.0, aliq: 0.075 },
  { ate: 2902.84, aliq: 0.09 },
  { ate: 4354.27, aliq: 0.12 },
  { ate: 8475.55, aliq: 0.14 },
];

export const DESCONTO_SIMPLIFICADO = 607.2;
const IR_FAIXAS = [
  { ate: 2428.8, aliq: 0, ded: 0 },
  { ate: 2826.65, aliq: 0.075, ded: 182.16 },
  { ate: 3751.05, aliq: 0.15, ded: 394.16 },
  { ate: 4664.68, aliq: 0.225, ded: 675.49 },
  { ate: Infinity, aliq: 0.275, ded: 908.73 },
];

// Encargos que o empregador paga sobre a folha (fora do Simples): INSS patronal 20%,
// RAT médio 2% e contribuições a terceiros (Sistema S, salário-educação) ~5,8%.
export const ENCARGOS_PATRONAIS = 0.278;

// Impostos embutidos no preço do que se compra: estimativa do LEAO, em % do preço.
export const ALIQUOTA_CONSUMO = 0.2;

export function calcInss(salario) {
  const base = Math.min(salario, INSS_TETO);
  let total = 0;
  let anterior = 0;
  for (const f of INSS_FAIXAS) {
    if (base > anterior) total += (Math.min(base, f.ate) - anterior) * f.aliq;
    anterior = f.ate;
  }
  return total;
}

export function calcIr(salario, inss) {
  if (salario <= 5000) return 0; // isenção da Lei 15.270/2025
  const base = salario - Math.max(inss, DESCONTO_SIMPLIFICADO);
  const f = IR_FAIXAS.find((x) => base <= x.ate);
  const normal = Math.max(0, base * f.aliq - f.ded);
  if (salario <= 7350) {
    const reducao = 978.62 - 0.133145 * salario;
    return Math.max(0, normal - Math.max(0, reducao));
  }
  return normal;
}

export function calcular({ salario, patronal = true, gastoPct = 0.85 }) {
  const inss = calcInss(salario);
  const ir = calcIr(salario, inss);
  const enc = patronal ? salario * ENCARGOS_PATRONAIS : 0;
  const liquido = salario - inss - ir;
  const gasto = liquido * gastoPct;
  const consumo = gasto * ALIQUOTA_CONSUMO;
  const base = salario + enc; // o que o seu trabalho custa/gera
  const total = inss + ir + enc + consumo;
  const fica = base - total;
  const parte = total / base;
  const dia = Math.max(1, Math.min(365, Math.ceil(parte * 365)));
  return { salario, inss, ir, enc, consumo, liquido, base, total, fica, parte, dia };
}
