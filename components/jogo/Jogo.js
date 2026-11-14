"use client";
import { useEffect, useRef, useState } from "react";
import { obterBackend } from "../../lib/jogo/backend.js";
import { PERSONAGENS, INICIAIS } from "../../lib/jogo/personagens.js";
import { MISSOES, TOTAL, PONTOS_INICIAIS, PONTOS_VITORIA, PONTOS_DERROTA, novoJogador, normalizarNick } from "../../lib/jogo/missoes.js";
import { gerarCodigo, formatarCodigo } from "../../lib/jogo/codigo.js";
import Avatar from "./Avatar.js";
import Partida from "./Partida.js";
import { Chip } from "./Batalha.js";

function CartaPersonagem({ id, bloqueado, selecionado, onClick, mostrarSkills }) {
  const p = PERSONAGENS[id];
  return (
    <div className={`jg-carta ${selecionado ? "jg-carta-sel" : ""} ${bloqueado ? "jg-carta-bloq" : ""}`}>
      <button type="button" className="jg-carta-btn" onClick={onClick} disabled={!onClick} aria-pressed={!!selecionado}>
        <Avatar av={p.avatar} pid={p.id} tamanho={84} bloqueado={bloqueado} />
        <strong>{bloqueado ? "Bloqueado" : p.nome}</strong>
        <span>{bloqueado ? "Complete missões" : p.titulo}</span>
      </button>
      {mostrarSkills && !bloqueado && (
        <ul className="jg-carta-skills">
          {p.skills.map((sk) => (
            <li key={sk.nome}><b>{sk.nome}</b> <span className="jg-sk-custo">{sk.custo.length ? sk.custo.map((e, j) => <Chip key={j} e={e} />) : <span style={{ fontSize: ".72rem", fontWeight: 700, color: "#f2b705" }}>Grátis</span>}</span><em>{sk.desc}</em></li>
          ))}
        </ul>
      )}
    </div>
  );
}

const limpo = (p) => (p ? { ...p, unlocked: (p.unlocked || []).filter((id) => PERSONAGENS[id]) } : p);

export default function Jogo() {
  const [bk, setBk] = useState(null);
  const [jogador, setJogador] = useState(null);
  const [fase, setFase] = useState("carregando");
  const [erro, setErro] = useState("");
  const [nick, setNick] = useState("");
  const [recuperando, setRecuperando] = useState(false);
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [codigoNovo, setCodigoNovo] = useState("");
  const [copiou, setCopiou] = useState(false);
  const [inicial, setInicial] = useState(INICIAIS[0]);
  const [time, setTime] = useState([]);
  const [fila, setFila] = useState(null);
  const [partida, setPartida] = useState(null);
  const [espera, setEspera] = useState(0);
  const [ver, setVer] = useState(false);
  const [rank, setRank] = useState(null);
  const filaRef = useRef(null);

  useEffect(() => {
    let vivo = true;
    obterBackend().then(async (b) => {
      const p = await b.me();
      if (!vivo) return;
      setBk(b); if (p) { setJogador(limpo(p)); setFase("menu"); } else setFase("nick");
    }).catch((e) => { setErro("Não foi possível conectar ao servidor do jogo. " + (e && e.message ? e.message : "")); setFase("erro"); });
    return () => { vivo = false; };
  }, []);

  useEffect(() => {
    if (!jogador) return;
    setTime((t) => { const v = t.filter((id) => jogador.unlocked.includes(id)); return v.length ? v : [jogador.unlocked[0]]; });
  }, [jogador]);

  useEffect(() => {
    if (fase !== "menu" || !bk) return;
    let vivo = true;
    bk.ranking().then((r) => vivo && setRank(r)).catch(() => vivo && setRank([]));
    return () => { vivo = false; };
  }, [fase, bk]);

  useEffect(() => {
    if (fase !== "fila") return;
    const t0 = Date.now(); const iv = setInterval(() => setEspera(Math.floor((Date.now() - t0) / 1000)), 500);
    return () => clearInterval(iv);
  }, [fase]);
  useEffect(() => () => { if (filaRef.current) filaRef.current.sair(); }, []);
  // Na batalha some o banner da página (e o rodapé), para a arena caber inteira na tela, sem rolar.
  useEffect(() => {
    document.body.classList.toggle("jg-batalha", fase === "batalha");
    return () => document.body.classList.remove("jg-batalha");
  }, [fase]);

  async function criar(e) {
    e.preventDefault(); setErro("");
    const n = normalizarNick(nick);
    if (!n) { setErro("O nick precisa ter de 3 a 16 caracteres: letras, números ou _ (sem acentos ou símbolos)."); return; }
    try {
      const codigo = gerarCodigo();
      const p = await bk.registrar(n, novoJogador(n.nick, bk.uid, inicial), codigo);
      setJogador(limpo(p)); setCodigoNovo(codigo); setCopiou(false); setFase("codigo");
    } catch (er) {
      setErro(er.message === "NICK_EM_USO" ? "Esse nick já está em uso. Escolha outro." : er.message === "JA_TEM_CONTA" ? "Este navegador já tem um nick registrado." : "Erro ao registrar o nick. Tente de novo.");
    }
  }

  async function recuperar(e) {
    e.preventDefault(); setErro("");
    const n = normalizarNick(nick);
    if (!n) { setErro("Digite o nick exatamente como você o criou."); return; }
    try {
      const p = await bk.recuperar(n.chave, codigoDigitado);
      setJogador(limpo(p)); setCodigoDigitado(""); setFase("menu");
    } catch (er) {
      setErro(er.message === "JA_TEM_CONTA" ? "Este navegador já tem um nick registrado." : "Nick ou código incorreto. Confira e tente de novo.");
    }
  }

  async function gerarNovoCodigo() {
    if (jogador.rec && !window.confirm("Gerar um código novo desativa o código antigo. Continuar?")) return;
    setErro("");
    try {
      const c = gerarCodigo();
      await bk.definirRecuperacao(jogador, c);
      setJogador((j) => ({ ...j, rec: true })); setCodigoNovo(c); setCopiou(false); setFase("codigo");
    } catch (er) { setErro("Não foi possível gerar o código agora. Tente de novo."); }
  }
  async function copiarCodigo() {
    try { await navigator.clipboard.writeText(formatarCodigo(codigoNovo)); setCopiou(true); } catch { setCopiou(false); }
  }

  function alternar(id) {
    setTime((t) => (t.includes(id) ? (t.length > 1 ? t.filter((x) => x !== id) : t) : t.length < 3 ? [...t, id] : t));
  }

  function treino() {
    const todos = Object.keys(PERSONAGENS);
    const adv = [...todos].sort(() => Math.random() - 0.5).slice(0, time.length);
    const meuLado = Math.random() < 0.5 ? "a" : "b";
    const init = { seed: Math.floor(Math.random() * 4294967295), timeA: meuLado === "a" ? time : adv, timeB: meuLado === "a" ? adv : time, primeiro: Math.random() < 0.5 ? "a" : "b", t0: Date.now(), uidA: "" };
    setPartida({ modo: "bot", init, meu: meuLado, nicks: { [meuLado]: jogador.nick, [meuLado === "a" ? "b" : "a"]: "Computador" } });
    setFase("batalha");
  }

  function entrarFila() {
    if (time.length !== 3) { setErro("Online é só 3×3: escolha 3 personagens."); return; }
    setErro(""); setEspera(0); setFase("fila");
    filaRef.current = bk.entrarFila(jogador, time, async (id) => {
      filaRef.current = null;
      const m = await bk.partida(id);
      if (!m) { setErro("Partida não encontrada."); setFase("menu"); return; }
      const meuLado = m.a.uid === bk.uid ? "a" : "b";
      const init = { seed: m.seed, timeA: m.a.time, timeB: m.b.time, primeiro: m.primeiro, t0: m.t0, uidA: m.a.uid };
      setPartida({ modo: "pvp", matchId: id, init, meu: meuLado, nicks: { a: m.a.nick, b: m.b.nick } });
      setFase("batalha");
    });
  }
  function sairFila() { if (filaRef.current) filaRef.current.sair(); filaRef.current = null; setFase("menu"); }

  function fimPartida(p) { setJogador(p); setPartida(null); setFase("menu"); }

  if (fase === "carregando") return <div className="jg"><p className="jg-centro">Carregando o jogo…</p></div>;
  if (fase === "erro") return <div className="jg"><p className="jg-erro">{erro}</p></div>;

  if (fase === "codigo") {
    return (
      <div className="jg">
        <div className="jg-nick-form">
          <h2>Seu código de recuperação</h2>
          <p>Anote este código e guarde em um lugar seguro. Se você limpar os dados do navegador ou trocar de aparelho, é com ele que recupera o nick <b>{jogador.nick}</b>, com os pontos e personagens.</p>
          <p style={{ fontSize: "1.9rem", fontWeight: 800, letterSpacing: ".12em", textAlign: "center", margin: "18px 0", userSelect: "all" }}>{formatarCodigo(codigoNovo)}</p>
          <p className="jg-peq">Ele só aparece agora. Quem tiver o código pode assumir o seu nick, então não compartilhe.</p>
          <div className="jg-acoes">
            <button type="button" className="jg-btn jg-btn-linha" onClick={copiarCodigo}>{copiou ? "Copiado ✔" : "Copiar código"}</button>
            <button type="button" className="jg-btn jg-btn-ouro jg-btn-grande" onClick={() => { setCodigoNovo(""); setFase("menu"); }}>Já anotei, continuar</button>
          </div>
        </div>
      </div>
    );
  }

  if (fase === "nick" && recuperando) {
    return (
      <div className="jg">
        <form className="jg-nick-form" onSubmit={recuperar}>
          <h2>Recuperar nick</h2>
          <p>Digite o nick e o código de recuperação que você recebeu ao criá-lo.</p>
          <label htmlFor="jg-nick-r">Nick</label>
          <input id="jg-nick-r" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={20} autoComplete="off" />
          <label htmlFor="jg-cod-r">Código de recuperação</label>
          <input id="jg-cod-r" value={codigoDigitado} onChange={(e) => setCodigoDigitado(e.target.value)} maxLength={20} autoComplete="off" placeholder="XXXX-XXXX-XXXX" />
          {erro && <p className="jg-erro" role="alert">{erro}</p>}
          <button type="submit" className="jg-btn jg-btn-ouro jg-btn-grande">Recuperar</button>
          <button type="button" className="jg-btn jg-btn-fraco" onClick={() => { setRecuperando(false); setErro(""); }}>Voltar</button>
        </form>
      </div>
    );
  }

  if (fase === "nick") {
    return (
      <div className="jg">
        {bk.demo && <p className="jg-demo"><b>Modo demonstração:</b> o servidor ainda não foi configurado. Dá para testar entre duas abas deste navegador.</p>}
        <form className="jg-nick-form" onSubmit={criar}>
          <h2>Escolha seu nick</h2>
          <p>Sem cadastro e sem senha. Cada nick é único: ninguém mais pode usar o mesmo.</p>
          <label htmlFor="jg-nick">Nick</label>
          <input id="jg-nick" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={20} autoComplete="off" placeholder="ex.: LeaoDaBahia" />
          <h3>Escolha seu primeiro personagem</h3>
          <p className="jg-peq">Você começa com um só. Os outros são liberados com missões.</p>
          <div className="jg-cartas">
            {INICIAIS.map((id) => <CartaPersonagem key={id} id={id} selecionado={inicial === id} onClick={() => setInicial(id)} mostrarSkills />)}
          </div>
          {erro && <p className="jg-erro" role="alert">{erro}</p>}
          <button type="submit" className="jg-btn jg-btn-ouro jg-btn-grande">Entrar no jogo</button>
          <p className="jg-peq">Ao criar o nick você recebe um código de recuperação. Guarde-o: se limpar os dados do navegador, é com ele que recupera o nick.</p>
          <button type="button" className="jg-btn jg-btn-fraco" onClick={() => { setRecuperando(true); setErro(""); }}>Já tenho um nick: recuperar</button>
        </form>
      </div>
    );
  }

  if (fase === "fila") {
    return (
      <div className="jg">
        <div className="jg-fila-box">
          <div className="jg-spin" aria-hidden="true" />
          <h2>Procurando adversário…</h2>
          <p>Fila do ranking 3×3 · {espera}s</p>
          {espera >= 25 && <p className="jg-peq">Ainda não tem ninguém na fila. Você pode esperar mais ou treinar contra o computador.</p>}
          <div className="jg-acoes">
            {espera >= 25 && <button type="button" className="jg-btn jg-btn-ouro" onClick={() => { sairFila(); treino(); }}>Treinar contra o computador</button>}
            <button type="button" className="jg-btn jg-btn-fraco" onClick={sairFila}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  if (fase === "batalha" && partida) {
    return <div className="jg jg-jogando"><Partida key={partida.matchId || partida.init.seed} backend={bk} jogador={jogador} {...partida} onFim={fimPartida} onSair={() => fimPartida(jogador)} /></div>;
  }

  const st = jogador.stats || {};
  return (
    <div className="jg">
      {bk.demo && <p className="jg-demo"><b>Modo demonstração:</b> o servidor ainda não foi configurado. A fila só encontra jogadores de outras abas deste navegador.</p>}
      <div className="jg-perfil">
        <div><span className="jg-rot">Jogador</span><strong className="jg-perfil-nick">{jogador.nick}</strong></div>
        <ul className="jg-stats">
          <li><b>{st.wins || 0}</b><span>vitórias</span></li>
          <li><b>{(st.played || 0) - (st.wins || 0)}</b><span>derrotas</span></li>
          <li><b>{jogador.pontos === undefined ? PONTOS_INICIAIS : jogador.pontos}</b><span>pontos</span></li>
          <li><b>{jogador.unlocked.length}/{TOTAL}</b><span>personagens</span></li>
        </ul>
      </div>

      <section className="jg-sec">
        <h2>Monte seu time <small>({time.length} de até 3)</small></h2>
        <p className="jg-peq">O treino aceita de 1 a 3 personagens. O online (valendo ranking) é só 3×3: escolha 3 personagens. {jogador.unlocked.length < 3 ? `Você tem ${jogador.unlocked.length}: complete missões para liberar mais.` : ""}</p>
        <div className="jg-cartas">
          {jogador.unlocked.map((id) => <CartaPersonagem key={id} id={id} selecionado={time.includes(id)} onClick={() => alternar(id)} />)}
        </div>
        <div className="jg-acoes">
          <button type="button" className="jg-btn jg-btn-ouro jg-btn-grande" onClick={entrarFila} disabled={time.length !== 3}>{time.length === 3 ? "Jogar online (3×3 · ranking)" : jogador.unlocked.length < 3 ? "Online: libere 3 personagens" : `Online: escolha 3 (${time.length}/3)`}</button>
          <button type="button" className="jg-btn jg-btn-linha jg-btn-grande" onClick={treino}>Treinar contra o computador</button>
        </div>
        {erro && <p className="jg-erro" role="alert">{erro}</p>}
      </section>

      <section className="jg-sec">
        <h2>Ranking</h2>
        <p className="jg-peq">Só partidas online 3×3 valem pontos: todos começam com {PONTOS_INICIAIS}, vitória dá +{PONTOS_VITORIA} e derrota tira {PONTOS_DERROTA} (nunca abaixo de 0).</p>
        {rank === null ? <p className="jg-peq">Carregando…</p> : rank.length === 0 ? <p className="jg-peq">Ainda não há jogadores no ranking.</p> : (
          <ol className="jg-rank">
            {rank.map((r, i) => (
              <li key={r.nick + i} className={r.eu ? "jg-rank-eu" : ""}>
                <span className="jg-rank-pos">{i + 1}º</span>
                <span className="jg-rank-nick">{r.nick}{r.eu ? " (você)" : ""}</span>
                <span className="jg-rank-vd">{r.vit}V · {r.der}D</span>
                <b className="jg-rank-pts">{r.pontos}</b>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="jg-sec">
        <h2>Seu acesso</h2>
        <p className="jg-peq">{jogador.rec ? "Seu nick tem um código de recuperação. Se perdeu o código, gere um novo (o antigo deixa de valer)." : "Seu nick ainda não tem código de recuperação. Gere um e guarde: sem ele, limpar os dados do navegador faz você perder o nick."}</p>
        <button type="button" className="jg-btn jg-btn-linha" onClick={gerarNovoCodigo}>{jogador.rec ? "Gerar novo código" : "Gerar código de recuperação"}</button>
      </section>

      <section className="jg-sec">
        <h2>Missões</h2>
        <p className="jg-peq">Cada missão cumprida libera um personagem novo.</p>
        <ul className="jg-missoes">
          {MISSOES.map((m) => {
            const feita = (jogador.done || []).includes(m.id); const prog = Math.min(m.meta, m.prog(st));
            return (
              <li key={m.id} className={feita ? "jg-feita" : ""}>
                <div><strong>{feita ? "✔ " : ""}{m.nome}</strong><span>{m.desc}</span></div>
                <div className="jg-barra-m"><i style={{ width: (prog / m.meta) * 100 + "%" }} /></div>
                <small>{prog}/{m.meta}</small>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="jg-sec">
        <h2>Todos os personagens</h2>
        <button type="button" className="jg-btn jg-btn-fraco" onClick={() => setVer(!ver)}>{ver ? "Esconder habilidades" : "Ver habilidades"}</button>
        <div className="jg-cartas">
          {Object.keys(PERSONAGENS).map((id) => <CartaPersonagem key={id} id={id} bloqueado={!jogador.unlocked.includes(id)} mostrarSkills={ver} />)}
        </div>
      </section>

      <section className="jg-sec jg-regras">
        <h2>Como jogar</h2>
        <ul>
          <li>Cada turno você ganha energias aleatórias: Voto, Mídia, Dinheiro ou Articulação.</li>
          <li>Clique em um personagem, escolha uma habilidade e o alvo. Cada personagem usa uma habilidade por turno.</li>
          <li>Habilidades têm custo em energia e tempo de espera. “Qualquer” (*) gasta a energia que você tem mais.</li>
          <li>Online só em 3×3 e vale ranking. O treino contra o computador aceita 1×1, 2×2 ou 3×3, sem pontos.</li>
          <li>Vence quem derrotar todos os personagens do adversário. O turno dura 20 segundos no 1×1, 30 no 2×2 e 40 no 3×3.</li>
          <li>Depois do turno 24, o desgaste tira vida de todos e a partida termina.</li>
        </ul>
        <p className="jg-peq">Paródia do Movimento LEAO. Os personagens são desenhos nossos e as habilidades são brincadeiras com bordões e posições públicas. Não representam fatos nem opinião sobre as pessoas.</p>
      </section>
    </div>
  );
}