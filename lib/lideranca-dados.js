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
  nacional: "Escolhido pelo Conselho Nacional, com mandato de 4 anos.",
  regional: "Escolhido pelo Líder Nacional.",
  estadual: "Escolhido pelo Líder Regional.",
  municipal: "Escolhido pelo Líder Estadual.",
};

// O fundador lidera até o Conselho Nacional ser eleito. `asterisco` mostra o * no nome e a nota abaixo do cartão.
export const NACIONAL = {
  ocupante: {
    nome: "Fabrício Ricard",
    foto: "/lideres/fabricio-ricard.jpg",
    asterisco: true,
    como: "Fundador do movimento.",
  },
  nota:
    "Exerce provisoriamente a função de Líder Nacional, conforme o art. 65 do Estatuto Social, até a eleição e posse do primeiro Conselho Nacional e a escolha do Líder Nacional por seus integrantes.",
};

export const REGIOES = [
  {
    nome: "Nordeste",
    ocupante: { nome: "Yan Renat", foto: "/lideres/yan-renat.jpg" },
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
    nome: "Sudeste",
    ocupante: null,
    estados: [
      {
        uf: "SP",
        nome: "São Paulo",
        ocupante: null,
        cidades: [
          { nome: "São Paulo", ocupante: null },
          { nome: "Campinas", ocupante: null },
        ],
      },
      {
        uf: "RJ",
        nome: "Rio de Janeiro",
        ocupante: null,
        cidades: [{ nome: "Rio de Janeiro", ocupante: null }],
      },
      {
        uf: "MG",
        nome: "Minas Gerais",
        ocupante: null,
        cidades: [
          { nome: "Belo Horizonte", ocupante: null },
          { nome: "Juiz de Fora", ocupante: null },
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
    quem: "Equipe que cuida de conteúdo, discurso e redes.",
    como: "A equipe é formada por pessoas escolhidas pelo Líder Nacional, que também define sua composição.",
    vagas: [null],
  },
  {
    nome: "Conselho Nacional",
    quem: "Decide os rumos do movimento.",
    como: "Eleitos diretamente pelos associados formalizados em pleno gozo de seus direitos associativos. São 5 integrantes, com mandato de 4 anos.",
    vagas: [null, null, null, null, null],
    rotuloVaga: "Vaga aberta · preenchida por eleição",
  },
  {
    nome: "Honraria",
    quem: "Reconhecimento por feitos, fora da escada.",
    como: "Vagas limitadas, por desempenho.",
    vagas: [null],
    aviso: "Concessão de honrarias conforme critérios de reconhecimento e desempenho.", // no lugar do cartão de vaga
    contar: false, // não há número fixo de vagas, então não entra na contagem do topo
  },
];

// Estrutura formal da associação. Em `vagas`, troque `ocupante: null` por { nome: "Nome" } para preencher.
// A Assembleia Geral não tem vagas: reúne todos os associados formalizados.
export const ESTRUTURA = [
  {
    nome: "Assembleia Geral",
    papel: "Reúne todos os associados formalizados em pleno gozo de seus direitos associativos. É a instância soberana da associação.",
  },
  {
    nome: "Diretoria Executiva",
    papel: "Composta por Presidente, Secretário-Geral e Tesoureiro. A Diretoria administra a associação, enquanto a Tesouraria, sob responsabilidade do Tesoureiro, controla receitas, despesas e recursos financeiros.",
    vagas: [
      { cargo: "Presidente", ocupante: null },
      { cargo: "Secretário-Geral", ocupante: null },
      { cargo: "Tesoureiro", ocupante: null },
    ],
  },
  {
    nome: "Conselho Fiscal",
    papel: "Três integrantes que fiscalizam as contas.",
    vagas: [
      { cargo: null, ocupante: null },
      { cargo: null, ocupante: null },
      { cargo: null, ocupante: null },
    ],
  },
];
