// Quem ocupa cada posição do movimento. Edite só este arquivo para atualizar a página /lideranca.
//
// COMO PREENCHER UMA VAGA: troque `ocupante: null` por
//   ocupante: { nome: "Nome da Pessoa" }
// e, se quiser foto, ponha o arquivo em public/lideres/ e use
//   ocupante: { nome: "Nome da Pessoa", foto: "/lideres/nome.jpg" }
//
// COMO ADICIONAR UMA CIDADE: acrescente { nome: "Cidade", ocupante: null } em `cidades` do estado.
// COMO ADICIONAR UM ESTADO: acrescente um bloco { uf, nome, ocupante: null, cidades: [...] } em `estados` da região.
// COMO ADICIONAR UMA REGIÃO: acrescente um bloco { nome, ocupante: null, estados: [...] } em REGIOES.

export const COMO = {
  nacional: "Escolhido pelo Conselho, com mandato de 4 anos.",
  regional: "Escolhido pelo Líder Nacional.",
  estadual: "Escolhido pelo Líder Regional.",
  municipal: "Escolhido pelo Líder Estadual.",
};

export const NACIONAL = { ocupante: null };

export const REGIOES = [
  {
    nome: "Nordeste",
    ocupante: null,
    estados: [
      {
        uf: "BA",
        nome: "Bahia",
        ocupante: null,
        cidades: [
          { nome: "Salvador", ocupante: null },
          { nome: "Lauro de Freitas", ocupante: null },
        ],
      },
    ],
  },
  {
    nome: "Sul",
    ocupante: null,
    estados: [
      {
        uf: "PR",
        nome: "Paraná",
        ocupante: null,
        cidades: [{ nome: "Bandeirantes", ocupante: null }],
      },
    ],
  },
];

// Posições ao lado da escada. `vagas` é a lista de ocupantes (null = vaga aberta).
export const LATERAIS = [
  {
    nome: "Propaganda",
    quem: "Cuida de conteúdo, discurso e redes.",
    como: "Escolhidos pelo Líder Nacional para desempenhar essa função.",
    vagas: [null],
  },
  {
    nome: "Conselho",
    quem: "Decide os rumos do movimento.",
    como: "Escolhidos por todos os membros do grupo: 5 pessoas, com mandato de 4 anos.",
    vagas: [null, null, null, null, null],
  },
  {
    nome: "Honraria",
    quem: "Reconhecimento por feitos, fora da escada.",
    como: "Vagas limitadas, por desempenho.",
    vagas: [null],
    contar: false, // não há número fixo de vagas, então não entra na contagem do topo
  },
];
