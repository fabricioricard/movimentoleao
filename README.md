# Movimento LEAO

Site oficial do **Movimento LEAO**, iniciativa cívica dedicada à responsabilidade fiscal, à transparência pública e à fiscalização cidadã.

**Produção:** [movimentoleao.com.br](https://movimentoleao.com.br)

## O que o site tem

| Área | O que é |
| --- | --- |
| Manifesto, Sobre nós, Posições, Liderança | Apresentação do Movimento, princípios e posicionamentos |
| Calculadora | Ferramenta interativa do Movimento |
| Revista | Matérias e posicionamentos publicados pelo Movimento, com imagem, resumo e crédito |
| Fiscalizações | Registro público dos pedidos de esclarecimento: órgão questionado, canal, protocolo, prazo, resposta e histórico |
| Camisas | Vitrine de produtos do Movimento |
| Jogo (Arena LEAO) | Jogo de estratégia por turnos com caricaturas de políticos brasileiros, com treino contra o computador e partidas online com ranking |
| Contato e Doe | Canais de contato e de apoio ao Movimento |

## Tecnologias

- [Next.js 15](https://nextjs.org) (App Router) e React 19
- CSS próprio, sem framework de UI
- Firebase (Authentication anônima e Firestore) apenas para o jogo online
- Hospedagem na [Vercel](https://vercel.com), com deploy automático a cada push na `main`

## Como rodar localmente

Requisitos: Node.js 20 ou mais recente.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm start        # serve o build
```

## Estrutura

```
app/            páginas (App Router) e folhas de estilo
components/     componentes de interface (topo, rodapé, páginas, jogo)
components/jogo telas do jogo: menu, fila, batalha, avatares
lib/            dados e regras do site e do jogo
lib/jogo/       motor do jogo, personagens, missões, sons e backends
public/         imagens (líderes, avatares, vozes, matérias)
firestore.rules regras de segurança do Firestore
```

## Como atualizar o conteúdo

O conteúdo é guiado por dados, sem banco de dados para o site institucional:

- **Revista:** `lib/noticias-dados.js`. Cada matéria tem `slug`, `tag`, `titulo`, `resumo` e `corpo`. O corpo aceita blocos `p` (parágrafo), `h` (subtítulo), `ul` e `ol` (listas). Imagem opcional com `imagem`, `imagemAlt` e `credito`.
- **Fiscalizações:** `lib/fiscalizacoes-dados.js`. Cada caso lista os pedidos com órgão, canal, protocolo, data de envio, prazo, situação (`aguardando`, `respondido`, `parcial` ou `sem_resposta`), resposta e histórico. O prazo vencido é destacado automaticamente.
- **Imagens das matérias:** `public/noticias-imagens/`, em JPG, com largura de até 1200 px e algo em torno de 100 a 300 KB.

Códigos de acesso e senhas de plataformas públicas (Fala.BR, Informa.BR) nunca devem ser publicados no site ou no repositório. Só o número do protocolo é público.

## Jogo (Arena LEAO)

- Batalha por turnos, em equipes de 1 a 3 personagens. O online é só 3×3 e vale ranking.
- Cada turno rende energias aleatórias (Voto, Mídia, Dinheiro, Articulação). As habilidades têm custo e tempo de espera.
- O motor é determinístico: cada jogador recalcula a partida a partir das jogadas e de uma semente combinada.
- Os personagens ficam em `lib/jogo/personagens.js`. Avatares e vozes opcionais ficam em `public/jogo/avatar/<id>.png` e `public/jogo/voz/<id><n>.mp3`, em que `n` é a posição da habilidade (1 a 4).
- **Versão das regras:** ao mudar habilidades ou regras, troque `VERSAO` em `lib/jogo/motor.js`. Assim, só joga junto quem está na mesma versão.
- **Nick e recuperação:** o jogador cria um nick e recebe um código de recuperação. Se limpar os dados do navegador, recupera o nick com ele.

### Configurando o Firebase

1. Crie um projeto no Firebase, ative **Authentication > Anônimo** e crie o **Firestore**.
2. Preencha `lib/jogo/firebase-config.js` com a configuração do app web. A chave da API do Firebase é pública por design: restrinja-a por domínio (referrer HTTP) no Google Cloud.
3. Publique o conteúdo de `firestore.rules` em **Firestore > Regras**.

Sem configuração, o jogo roda em modo demonstração, apenas entre abas do mesmo navegador.

O ranking não tem árbitro no servidor. As regras limitam os pontos por partida, mas não impedem combinação entre jogadores.

## Aviso

O jogo é uma paródia. Os personagens são desenhos do Movimento e as habilidades são brincadeiras com bordões e posições públicas. Não representam fatos nem opinião sobre as pessoas.

## Contato

Perfil do Movimento no X e no Instagram: **@MovimentoLEAO**.
