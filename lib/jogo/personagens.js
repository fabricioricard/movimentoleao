// Personagens e habilidades do jogo. Edite só este arquivo para mudar nomes, textos e números.
// Paródia: nomes de figuras públicas com desenhos nossos (sem foto) e habilidades de humor
// sobre posições e bordões públicos. Não afirme nada factual ofensivo nos textos.
//
// Energias: V = Voto, M = Mídia, D = Dinheiro, A = Articulação. "*" no custo = qualquer energia.
// alvo: "inimigo" | "inimigos" | "aliado" | "aliados" | "si"
// efeitos: dmg(v, pierce) heal(v) shield(v,t) stun(t) dot(v,t) buff(v=% a mais de dano,t)
//          weak(v=% a menos de dano,t) def(v=% a menos de dano recebido,t) inv(t) drain(n) gain(n)
//          `to:"si"` aplica o efeito no próprio personagem que usou a habilidade.
// cd = de quantos em quantos turnos pode usar de novo (0 = sem espera).

export const ENERGIAS = ["V", "M", "D", "A"];
export const ENERGIA_NOME = { V: "Voto", M: "Mídia", D: "Dinheiro", A: "Articulação", "*": "Qualquer" };
export const HP = 80;

export const PERSONAGENS = {
  zema: {
    id: "zema", nome: "Romeu Zema", titulo: "O Gestor", inicial: true,
    avatar: { fundo: "#1d4f9c", pele: "#f1c7a0", cabelo: "curto", cor: "#9aa3b2", expr: "boca", gravata: "#f2b705" },
    skills: [
      { nome: "Choque de Gestão", desc: "Causa 22 de dano.", custo: ["D"], cd: 0, alvo: "inimigo", efeitos: [{ t: "dmg", v: 22 }] },
      { nome: "Enxugar a Máquina", desc: "Causa 12 de dano em todos os inimigos.", custo: ["D", "D"], cd: 2, alvo: "inimigos", efeitos: [{ t: "dmg", v: 12 }] },
      { nome: "Privatizar", desc: "Ganha 2 energias aleatórias.", custo: ["D"], cd: 3, alvo: "si", efeitos: [{ t: "gain", n: 2 }] },
      { nome: "Reforma Fiscal", desc: "Cura 15 e reduz em 40% o dano recebido por 2 turnos.", custo: ["A", "*"], cd: 4, alvo: "si", efeitos: [{ t: "heal", v: 15 }, { t: "def", v: 40, turns: 2 }] },
    ],
  },
  tarcisio: {
    id: "tarcisio", nome: "Tarcísio de Freitas", titulo: "O Engenheiro", inicial: true,
    avatar: { fundo: "#1f7a5a", pele: "#e8b98f", cabelo: "curto", cor: "#3a2a20", oculos: true, gravata: "#1d4f9c" },
    skills: [
      { nome: "Obra Entregue", desc: "Causa 22 de dano.", custo: ["D"], cd: 0, alvo: "inimigo", efeitos: [{ t: "dmg", v: 22 }] },
      { nome: "Pedágio", desc: "Causa 8 de dano por 3 turnos.", custo: ["D", "*"], cd: 3, alvo: "inimigo", efeitos: [{ t: "dot", v: 8, turns: 3 }] },
      { nome: "Parceria Público-Privada", desc: "Cura 22 de um aliado.", custo: ["A", "*"], cd: 3, alvo: "aliado", efeitos: [{ t: "heal", v: 22 }] },
      { nome: "Plano de Voo", desc: "Aumenta em 40% o próprio dano por 2 turnos.", custo: ["*", "*"], cd: 4, alvo: "si", efeitos: [{ t: "buff", v: 40, turns: 2 }] },
    ],
  },
  haddad: {
    id: "haddad", nome: "Fernando Haddad", titulo: "O Ministro", inicial: true,
    avatar: { fundo: "#a32d3a", pele: "#efc6a0", cabelo: "curto", cor: "#4a4a4a", oculos: true, barba: "curta", expr: "serio", gravata: "#1b2a4a" },
    skills: [
      { nome: "Taxar", desc: "Causa 18 de dano e tira 1 energia do adversário.", custo: ["D"], cd: 2, alvo: "inimigo", efeitos: [{ t: "dmg", v: 18 }, { t: "drain", n: 1 }] },
      { nome: "Arcabouço Fiscal", desc: "Dá um escudo de 20 a um aliado por 2 turnos.", custo: ["A"], cd: 2, alvo: "aliado", efeitos: [{ t: "shield", v: 20, turns: 2 }] },
      { nome: "Reforma Tributária", desc: "Causa 10 de dano em todos e reduz o dano deles em 25% por 2 turnos.", custo: ["D", "A"], cd: 4, alvo: "inimigos", efeitos: [{ t: "dmg", v: 10 }, { t: "weak", v: 25, turns: 2 }] },
      { nome: "Meta de Déficit", desc: "Cura 25.", custo: ["*", "*"], cd: 4, alvo: "si", efeitos: [{ t: "heal", v: 25 }] },
    ],
  },
  lula: {
    id: "lula", nome: "Lula", titulo: "O Presidente",
    avatar: { fundo: "#b3263a", pele: "#e9bf99", cabelo: "grisalho", cor: "#d9d9d9", barba: "cheia", barbaCor: "#e5e5e5", gravata: "#b3263a" },
    skills: [
      { nome: "Discurso no Palanque", desc: "Causa 18 de dano.", custo: ["M"], cd: 0, alvo: "inimigo", efeitos: [{ t: "dmg", v: 18 }] },
      { nome: "Nunca Antes na História", desc: "Aumenta em 50% o próprio dano por 2 turnos.", custo: ["M", "*"], cd: 3, alvo: "si", efeitos: [{ t: "buff", v: 50, turns: 2 }] },
      { nome: "Programa Social", desc: "Cura 14 de todos os aliados.", custo: ["V", "*"], cd: 3, alvo: "aliados", efeitos: [{ t: "heal", v: 14 }] },
      { nome: "Abraço no Povo", desc: "Reduz em 30% o dano que um aliado recebe por 2 turnos.", custo: ["V"], cd: 2, alvo: "aliado", efeitos: [{ t: "def", v: 30, turns: 2 }] },
    ],
  },
  bolsonaro: {
    id: "bolsonaro", nome: "Jair Bolsonaro", titulo: "O Capitão",
    avatar: { fundo: "#2c8a3e", pele: "#e8bd97", cabelo: "curto", cor: "#cfcfcf", gravata: "#f2b705" },
    skills: [
      { nome: "Live de Quinta", desc: "Causa 18 de dano.", custo: ["M"], cd: 0, alvo: "inimigo", efeitos: [{ t: "dmg", v: 18 }] },
      { nome: "Motociata", desc: "Causa 12 de dano em todos os inimigos.", custo: ["V", "M"], cd: 3, alvo: "inimigos", efeitos: [{ t: "dmg", v: 12 }] },
      { nome: "Mobilizar Apoiadores", desc: "Aumenta em 30% o dano de todos os aliados por 2 turnos.", custo: ["V", "*"], cd: 3, alvo: "aliados", efeitos: [{ t: "buff", v: 30, turns: 2 }] },
      { nome: "Cercadinho", desc: "Dá um escudo de 25 a si mesmo por 2 turnos.", custo: ["V"], cd: 3, alvo: "si", efeitos: [{ t: "shield", v: 25, turns: 2 }] },
    ],
  },
  moraes: {
    id: "moraes", nome: "Alexandre de Moraes", titulo: "O Ministro do STF",
    avatar: { fundo: "#2a2f45", pele: "#efc9a4", cabelo: "calvo", cor: "#2a2a2a", oculos: false, expr: "serio", gravata: "#111" },
    skills: [
      { nome: "Despacho", desc: "Causa 20 de dano.", custo: ["A"], cd: 0, alvo: "inimigo", efeitos: [{ t: "dmg", v: 20 }] },
      { nome: "Intimação", desc: "Causa 8 de dano e atordoa por 1 turno.", custo: ["A", "*"], cd: 4, alvo: "inimigo", efeitos: [{ t: "dmg", v: 8 }, { t: "stun", turns: 1 }] },
      { nome: "Decisão Monocrática", desc: "Causa 35 de dano.", custo: ["A", "A"], cd: 4, alvo: "inimigo", efeitos: [{ t: "dmg", v: 35 }] },
      { nome: "Toga", desc: "Fica invulnerável por 1 turno.", custo: ["*"], cd: 5, alvo: "si", efeitos: [{ t: "inv", turns: 1 }] },
    ],
  },
  ciro: {
    id: "ciro", nome: "Ciro Gomes", titulo: "O Estrategista",
    avatar: { fundo: "#d97a1a", pele: "#e5b58c", cabelo: "grisalho", cor: "#b5b5b5", expr: "boca", gravata: "#1d4f9c" },
    skills: [
      { nome: "Cutucada", desc: "Causa 20 de dano.", custo: ["M"], cd: 0, alvo: "inimigo", efeitos: [{ t: "dmg", v: 20 }] },
      { nome: "Entrevista Explosiva", desc: "Causa 15 de dano e reduz o dano dele em 30% por 2 turnos.", custo: ["M", "*"], cd: 3, alvo: "inimigo", efeitos: [{ t: "dmg", v: 15 }, { t: "weak", v: 30, turns: 2 }] },
      { nome: "Projeto de Nação", desc: "Cura 25 e dá um escudo de 10 por 2 turnos.", custo: ["A", "*"], cd: 4, alvo: "si", efeitos: [{ t: "heal", v: 25 }, { t: "shield", v: 10, turns: 2 }] },
      { nome: "Boca no Trombone", desc: "Causa 15 de dano em todos os inimigos.", custo: ["M", "M"], cd: 4, alvo: "inimigos", efeitos: [{ t: "dmg", v: 15 }] },
    ],
  },
  tebet: {
    id: "tebet", nome: "Simone Tebet", titulo: "A Conciliadora",
    avatar: { fundo: "#6b3fa0", pele: "#f0c8a6", cabelo: "longo", cor: "#6b4a2b", gravata: "#f2b705" },
    skills: [
      { nome: "Emenda", desc: "Causa 16 de dano.", custo: ["A"], cd: 0, alvo: "inimigo", efeitos: [{ t: "dmg", v: 16 }] },
      { nome: "Mesa de Diálogo", desc: "Cura 22 de um aliado e reduz em 20% o dano que ele recebe por 1 turno.", custo: ["A"], cd: 3, alvo: "aliado", efeitos: [{ t: "heal", v: 22 }, { t: "def", v: 20, turns: 1 }] },
      { nome: "Voto de Minerva", desc: "Causa 30 de dano.", custo: ["V", "A"], cd: 4, alvo: "inimigo", efeitos: [{ t: "dmg", v: 30 }] },
      { nome: "Pacificar", desc: "Atordoa um inimigo por 1 turno.", custo: ["A", "A"], cd: 5, alvo: "inimigo", efeitos: [{ t: "stun", turns: 1 }] },
    ],
  },
};

export const INICIAIS = Object.values(PERSONAGENS).filter((p) => p.inicial).map((p) => p.id);
// Ordem em que as missões liberam personagens (pula quem o jogador já tem).
export const ORDEM_DESBLOQUEIO = ["lula", "bolsonaro", "moraes", "ciro", "tebet", "zema", "tarcisio", "haddad"];
