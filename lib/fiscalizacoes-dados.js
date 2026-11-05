// Acompanhamento das fiscalizações do Movimento. Edite só este arquivo. O caso mais novo vai no TOPO.
//
// Cada CASO é uma fiscalização (uma medida ou projeto). Ele pode ter mais de um órgão questionado:
// cada órgão tem o seu próprio protocolo, prazo, situação e resposta. O contador do topo conta casos.
//
// COMO ATUALIZAR UM ÓRGÃO QUESTIONADO:
//   orgao:     "Nome do órgão"
//   canal:     "Fala.BR (Solicitação)"           (por onde foi enviado; null = não informado)
//   protocolo: "número do protocolo"             (null = ainda não informado)
//   enviadoEm: "2026-11-05"                       (AAAA-MM-DD; null = ainda não informado)
//   prazo:     "2026-12-07"                       (AAAA-MM-DD; null = sem prazo definido)
//   situacao:  "aguardando" | "respondido" | "parcial" | "sem_resposta"
//   resposta:  { data: "2026-11-20", resumo: "O que o órgão respondeu.", link: "https://..." }   (null = nenhuma; `link` é opcional)
//   historico: [{ data: "2026-11-05", texto: "Pedido enviado." }]   (opcional; mais antigo primeiro)
// Se `situacao` for "aguardando" e o prazo passar, o site mostra "Prazo vencido" sozinho.
//
// `materia` = slug da matéria na Revista (lib/noticias-dados.js). `copia` = quem recebeu só para conhecimento.
//
// ATENÇÃO: nunca coloque aqui o código de acesso do Fala.BR nem outra senha. Esta página é pública.

export const SITUACOES = {
  aguardando: { rotulo: "Aguardando resposta", cor: "espera" },
  respondido: { rotulo: "Respondido", cor: "ok" },
  parcial: { rotulo: "Respondido em parte", cor: "parcial" },
  sem_resposta: { rotulo: "Sem resposta", cor: "alerta" },
};

export const FISCALIZACOES = [
  {
    id: "mpv-1384-2026",
    titulo: "MPV 1.384/2026: crédito de R$ 924,9 milhões para estoques públicos e segurança alimentar",
    referencia: "Medida Provisória nº 1.384/2026",
    pedidos: [
      { orgao: "Companhia Nacional de Abastecimento (CONAB)", canal: "Fala.BR (Solicitação)", protocolo: "21213.000793/2026-89", enviadoEm: null, prazo: "2026-12-07", situacao: "aguardando", resposta: null, historico: [] },
      { orgao: "Senador Carlos Fávaro, relator da medida provisória", canal: null, protocolo: null, enviadoEm: null, prazo: null, situacao: "aguardando", resposta: null, historico: [] },
    ],
    copia: "Comissão Mista de Orçamento (CMO)",
    pontos: [
      "Aquisição de alimentos: quantidades de arroz e milho, preços de referência e critérios de seleção dos fornecedores.",
      "Estoques públicos: memória de cálculo da meta de 603.650 toneladas de arroz e discriminação das 490.350 toneladas previstas no anexo.",
      "Custos operacionais: detalhamento dos R$ 99,48 milhões para manutenção, remoção, movimentação e armazenagem.",
      "Distribuição dos recursos: critérios de seleção dos beneficiários (140 mil famílias em insegurança alimentar e 1.323 famílias da agricultura familiar) e distribuição territorial.",
      "Demonstração financeira: composição dos R$ 79,9 bilhões registrados como outras alterações orçamentárias e memória de cálculo do saldo final.",
    ],
    materia: "mpv-1384-2026-esclarecimentos",
  },
  {
    id: "mpv-1383-2026",
    titulo: "MPV 1.383/2026: R$ 360 milhões para proteção e defesa civil",
    referencia: "Medida Provisória nº 1.383/2026",
    pedidos: [
      { orgao: "Deputado federal Mauro Benevides Filho, relator da medida provisória", canal: null, protocolo: null, enviadoEm: null, prazo: null, situacao: "aguardando", resposta: null, historico: [] },
    ],
    pontos: [
      "Distribuição dos recursos: critérios para escolher estados e municípios e divulgação dos valores de cada localidade.",
      "Estimativa de beneficiários: metodologia da previsão de atendimento a 3 milhões de pessoas.",
      "Rejeição das emendas: fundamentação jurídica para considerar inadmissíveis as duas emendas parlamentares, diante do art. 111 da Resolução nº 1/2006-CN.",
      "Prestação de contas: acompanhamento dos valores empenhados, pagos e efetivamente aplicados em cada estado e município.",
    ],
    materia: "mpv-1383-2026-esclarecimentos",
  },
  {
    id: "pln-23-2026",
    titulo: "PLN 23/2026: crédito suplementar para a Seguridade Social",
    referencia: "Projeto de Lei do Congresso Nacional nº 23/2026",
    pedidos: [
      { orgao: "Parlamentares do Congresso Nacional (CMO: relator, deputado Hugo Leal; presidente, deputado Domingos Neto)", canal: null, protocolo: null, enviadoEm: null, prazo: null, situacao: "aguardando", resposta: null, historico: [] },
    ],
    pontos: [
      "Atualização do crédito: se o relatório considerará o saldo de R$ 153,57 bilhões, no lugar dos R$ 185,55 bilhões iniciais.",
      "Origem dos recursos: fontes orçamentárias da reclassificação de R$ 40 bilhões e disponibilidade efetiva desses recursos.",
      "Endividamento público: montante de títulos públicos a emitir e impacto estimado sobre a dívida.",
    ],
    materia: "pln-23-2026-esclarecimentos",
  },
];
