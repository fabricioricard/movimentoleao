"use client";
import { useEffect, useRef, useState } from "react";
import { obterBackend } from "../../lib/jogo/backend.js";
import { PERSONAGENS, INICIAIS } from "../../lib/jogo/personagens.js";
import { MISSOES, TOTAL, novoJogador, normalizarNick } from "../../lib/jogo/missoes.js";
import Avatar from "./Avatar.js";
import Partida from "./Partida.js";
import { Chip } from "./Batalha.js";

function CartaPersonagem({ id, bloqueado, selecionado, onClick, mostrarSkills }) {
  const p = PERSONAGENS[id];
  return (
    <div className={`jg-carta ${selecionado ? "jg-carta-sel" : ""} ${bloqueado ? "jg-carta-bloq" : ""}`}>
      <button type="button" className="jg-carta-btn" onClick={onClick} disabled={!onClick} aria-pressed={!!selecionado}>
        <Avatar av={p.avatar} tamanho={84} bloqueado={bloqueado} />
        <strong>{bloqueado ? "Bloqueado" : p.nome}</strong>
        <span>{bloqueado ? "Complete missões" : p.titulo}</span>
      </button>
      {mostrarSkills && !bloqueado && (
        <ul className="jg-carta-skills">
          {p.skills.map((sk) => (
            <li key={sk.nome}><b>{sk.nome}</b> <span className="jg-sk-custo">{sk.custo.map((e, j) => <Chip key={j} e={e} />)}</span><em>{sk.desc}</em></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Jogo() {
  const [bk, setBk] = useState(null);
  const [jogador, setJogador] = useState(null);
  const [fase, setFase] = useState("carregando");
  const [erro, setErro] = useState("");
  const [nick, setNick] = useState("");
  const [inicial, setInicial] = useState(INICIAIS[0]);
  const [time, setTime] = useState([]);
  const [fila, setFila] = useState(null);
  const [partida, setPartida] = useState(null);
  const [espera, setEspera] = useState(0);
  const [ver, setVer] = useState(false);
  const filaRef = useRef(null);

  useEffect(() => {
    let vivo = true;
    obterBackend().then(async (b) => {
      const p = await b.me();
      if (!vivo) return;
      setBk(b); if (p) { setJogador(p); setFase("menu"); } else setFase("nick");
    }).catch((e) => { setErro("Não foi possível conectar ao servidor do jogo. " + (e && e.message ? e.message : "")); setFase("erro"); });
    return () => { vivo = false; };
  }, []);

  useEffect(() => {
    if (!jogador) return;
    setTime((t) => { const v = t.filter((id) => jogador.unlocked.includes(id)); return v.length ? v : [jogador.unlocked[0]]; });
  }, [jogador]);

  useEffect(() => {
    if (fase !== "fila") return;
    const t0 = Date.now(); const iv = setInterval(() => setEspera(Math.floor((Date.now() - t0) / 1000)), 500);
    return () => clearInterval(iv);
  }, [fase]);
  useEffect(() => () => { if (filaRef.current) filaRef.current.sair(); }, []);

  async function criar(e) {
    e.preventDefault(); setErro("");
    const n = normalizarNick(nick);
    if (!n) { setErro("O nick precisa ter de 3 a 16 caracteres: letras, números ou _ (sem acentos ou símbolos)."); return; }
    try {
      const p = await bk.registrar(n, novoJogador(n.nick, bk.uid, inicial));
      setJogador(p); setFase("menu");
    } catch (er) {
      setErro(er.message === "NICK_EM_USO" ? "Esse nick já está em uso. Escolha outro." : er.message === "JA_TEM_CONTA" ? "Este navegador já tem um nick registrado." : "Erro ao registrar o nick. Tente de novo.");
    }
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
          <p className="jg-peq">Seu nick fica ligado a este navegador. Se limpar os dados do navegador, o acesso a ele se perde.</p>
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
          <p>Fila de {time.length}×{time.length} · {espera}s</p>
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
          <li><b>{jogador.unlocked.length}/{TOTAL}</b><span>personagens</span></li>
        </ul>
      </div>

      <section className="jg-sec">
        <h2>Monte seu time <small>({time.length} de até 3)</small></h2>
        <p className="jg-peq">Quem entra na batalha: de 1 a 3 personagens. A fila junta quem escolheu o mesmo tamanho de time.</p>
        <div className="jg-cartas">
          {jogador.unlocked.map((id) => <CartaPersonagem key={id} id={id} selecionado={time.includes(id)} onClick={() => alternar(id)} />)}
        </div>
        <div className="jg-acoes">
          <button type="button" className="jg-btn jg-btn-ouro jg-btn-grande" onClick={entrarFila}>Jogar online ({time.length}×{time.length})</button>
          <button type="button" className="jg-btn jg-btn-linha jg-btn-grande" onClick={treino}>Treinar contra o computador</button>
        </div>
        {erro && <p className="jg-erro" role="alert">{erro}</p>}
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
          <li>Vence quem derrotar todos os personagens do adversário. O turno dura 20 segundos no 1×1, 30 no 2×2 e 40 no 3×3.</li>
          <li>Depois do turno 24, o desgaste tira vida de todos e a partida termina.</li>
        </ul>
        <p className="jg-peq">Paródia do Movimento LEAO. Os personagens são desenhos nossos e as habilidades são brincadeiras com bordões e posições públicas. Não representam fatos nem opinião sobre as pessoas.</p>
      </section>
    </div>
  );
}