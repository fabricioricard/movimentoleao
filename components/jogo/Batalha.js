"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { PERSONAGENS, ENERGIA_NOME, HP } from "../../lib/jogo/personagens.js";
import { validar, pagar, atordoado, outro } from "../../lib/jogo/motor.js";
import Avatar from "./Avatar.js";

const NOME_ST = { stun: "Atordoado", dot: "Dano contínuo", shield: "Escudo", buff: "Dano +", weak: "Dano −", def: "Defesa", inv: "Invulnerável" };
const ICO_ST = { stun: "💫", dot: "☠", shield: "🛡", buff: "⬆", weak: "⬇", def: "◈", inv: "✦" };

export function Chip({ e }) { return <span className={`jg-chip jg-e-${e === "*" ? "x" : e.toLowerCase()}`} title={ENERGIA_NOME[e]}>{e}</span>; }

function Pool({ pool }) {
  return (
    <div className="jg-pool" aria-label="Energias">
      {["V", "M", "D", "A"].map((e) => (<span key={e} className="jg-pool-i"><Chip e={e} /><b>{pool[e]}</b></span>))}
    </div>
  );
}

function Unidade({ u, lado, i, meu, foco, marcada, mira, onClick, acao }) {
  const p = PERSONAGENS[u.id]; const pct = Math.max(0, (u.hp / HP) * 100);
  const [flash, setFlash] = useState(null); const ant = useRef(u.hp);
  useEffect(() => { if (u.hp !== ant.current) { setFlash(u.hp < ant.current ? "dano" : "cura"); const t = setTimeout(() => setFlash(null), 600); ant.current = u.hp; return () => clearTimeout(t); } }, [u.hp]);
  return (
    <button type="button" className={`jg-un ${meu ? "jg-meu" : "jg-ini"} ${u.hp <= 0 ? "jg-morto" : ""} ${foco ? "jg-foco" : ""} ${mira ? "jg-mira" : ""} ${flash ? "jg-flash-" + flash : ""}`} onClick={onClick} disabled={false} aria-label={`${p.nome}, ${u.hp} de vida`}>
      <Avatar av={p.avatar} tamanho={72} morto={u.hp <= 0} />
      <span className="jg-un-nome">{p.nome.split(" ")[0]}</span>
      <span className="jg-hp"><i style={{ width: pct + "%" }} /></span>
      <span className="jg-hp-n">{u.hp}/{HP}</span>
      <span className="jg-sts">{u.st.map((x, k) => (<span key={k} className={`jg-st jg-st-${x.k}`} title={`${NOME_ST[x.k]}${x.v ? " " + x.v : ""} (${x.t})`}>{ICO_ST[x.k]}</span>))}</span>
      {acao && <span className="jg-acao">{acao}</span>}
    </button>
  );
}

export default function Batalha({ s, meu, nicks, seg, onEnviar, onDesistir, aguardando }) {
  const ini = outro(meu);
  const minhaVez = s.lado === meu && !s.venc;
  const [foco, setFoco] = useState({ lado: meu, i: 0 });
  const [acts, setActs] = useState({});
  const [mira, setMira] = useState(null);
  const vez = s.turno;

  useEffect(() => { setActs({}); setMira(null); }, [vez]);
  useEffect(() => { const l = s.lados[meu].u; if (l[foco.i] && l[foco.i].hp <= 0 && foco.lado === meu) { const v = l.findIndex((x) => x.hp > 0); if (v >= 0) setFoco({ lado: meu, i: v }); } }, [s, meu, foco]);

  const lista = useMemo(() => Object.entries(acts).map(([u, a]) => ({ u: +u, s: a.s, tg: a.tg })), [acts]);
  const val = useMemo(() => (minhaVez ? validar(s, meu, lista) : { ok: false }), [s, meu, lista, minhaVez]);
  const pool = val.ok ? val.pool : s.lados[meu].pool;
  const fu = s.lados[foco.lado].u[foco.i]; const fp = fu && PERSONAGENS[fu.id];

  function escolher(k) {
    if (!minhaVez || foco.lado !== meu) return;
    const sk = fp.skills[k];
    if (acts[foco.i] && acts[foco.i].s === k) { const n = { ...acts }; delete n[foco.i]; setActs(n); setMira(null); return; }
    if (sk.alvo === "inimigo" || sk.alvo === "aliado") { setMira({ u: foco.i, s: k, alvo: sk.alvo }); return; }
    setActs({ ...acts, [foco.i]: { s: k, tg: 0 } }); setMira(null);
  }
  function clicarUnidade(lado, i) {
    if (mira) {
      const alvoLado = mira.alvo === "inimigo" ? ini : meu;
      if (lado === alvoLado && s.lados[lado].u[i].hp > 0) { setActs({ ...acts, [mira.u]: { s: mira.s, tg: i } }); setMira(null); return; }
      setMira(null);
    }
    setFoco({ lado, i });
  }
  function podeUsar(k) {
    if (!minhaVez || foco.lado !== meu || !fu || fu.hp <= 0) return false;
    if (atordoado(fu) || fu.cd[k] > 0) return false;
    const sk = fp.skills[k]; const outras = { ...acts }; delete outras[foco.i];
    const base = validar(s, meu, Object.entries(outras).map(([u, a]) => ({ u: +u, ...a })));
    return !!(base.ok && pagar(base.pool, sk.custo));
  }
  const alvoNome = (a) => {
    const sk = PERSONAGENS[s.lados[meu].u[a.u].id].skills[a.s];
    if (sk.alvo === "inimigo") return "→ " + PERSONAGENS[s.lados[ini].u[a.tg].id].nome.split(" ")[0];
    if (sk.alvo === "aliado") return "→ " + PERSONAGENS[s.lados[meu].u[a.tg].id].nome.split(" ")[0];
    return "";
  };

  return (
    <div className="jg-bt">
      <div className="jg-bt-topo">
        <div className={`jg-turno ${minhaVez ? "jg-turno-meu" : ""}`}>
          {s.venc ? "Fim da partida" : minhaVez ? "Seu turno" : `Turno de ${nicks[ini]}`}
          {!s.venc && <span className="jg-tempo">{Math.max(0, seg)}s</span>}
        </div>
        <button type="button" className="jg-btn jg-btn-fraco" onClick={onDesistir}>Desistir</button>
      </div>

      <div className="jg-lado jg-lado-ini">
        <div className="jg-nick">{nicks[ini]}</div>
        <div className="jg-fila">
          {s.lados[ini].u.map((u, i) => (
            <Unidade key={i} u={u} lado={ini} i={i} meu={false} foco={foco.lado === ini && foco.i === i} mira={!!mira && mira.alvo === "inimigo" && u.hp > 0} onClick={() => clicarUnidade(ini, i)} />
          ))}
        </div>
        <Pool pool={s.lados[ini].pool} />
      </div>

      <div className="jg-meio">
        <div className="jg-log" aria-live="polite">{s.log.slice(-5).map((t, i) => (<p key={s.log.length - 5 + i}>{t}</p>))}</div>
      </div>

      <div className="jg-lado jg-lado-meu">
        <div className="jg-fila">
          {s.lados[meu].u.map((u, i) => (
            <Unidade key={i} u={u} lado={meu} i={i} meu foco={foco.lado === meu && foco.i === i} mira={!!mira && mira.alvo === "aliado" && u.hp > 0} onClick={() => clicarUnidade(meu, i)} acao={acts[i] ? PERSONAGENS[u.id].skills[acts[i].s].nome : null} />
          ))}
        </div>
        <div className="jg-nick">{nicks[meu]} (você)</div>
        <Pool pool={pool} />
      </div>

      {fp && (
        <div className="jg-painel">
          <div className="jg-painel-t"><strong>{fp.nome}</strong> <span>{fp.titulo}{foco.lado !== meu ? " · adversário" : ""}</span></div>
          <ul className="jg-skills">
            {fp.skills.map((sk, k) => {
              const ok = podeUsar(k); const sel = acts[foco.i] && foco.lado === meu && acts[foco.i].s === k;
              const cd = fu.cd[k];
              return (
                <li key={k}>
                  <button type="button" className={`jg-sk ${sel ? "jg-sk-sel" : ""} ${mira && mira.u === foco.i && mira.s === k ? "jg-sk-mira" : ""}`} disabled={!ok && !sel} onClick={() => escolher(k)}>
                    <span className="jg-sk-nome">{sk.nome}</span>
                    <span className="jg-sk-custo">{sk.custo.map((e, j) => <Chip key={j} e={e} />)}</span>
                    <span className="jg-sk-desc">{sk.desc}</span>
                    <span className="jg-sk-meta">{cd > 0 ? `Disponível em ${cd} turno${cd > 1 ? "s" : ""}` : sk.cd ? `Espera: ${sk.cd} turnos` : "Sem espera"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {fu && atordoado(fu) && foco.lado === meu && <p className="jg-aviso">Atordoado: não pode usar habilidades neste turno.</p>}
          {mira && <p className="jg-aviso jg-aviso-mira">Escolha o alvo: clique em {mira.alvo === "inimigo" ? "um adversário" : "um personagem seu"}.</p>}
        </div>
      )}

      <div className="jg-barra">
        <button type="button" className="jg-btn jg-btn-ouro jg-btn-grande" disabled={!minhaVez || !val.ok || aguardando} onClick={() => onEnviar({ t: "turn", turn: s.turno, acts: lista })}>
          {minhaVez ? (lista.length ? `Encerrar turno (${lista.length} ação${lista.length > 1 ? "ões" : ""})` : "Passar o turno") : "Aguardando adversário…"}
        </button>
        {minhaVez && lista.length > 0 && <span className="jg-resumo">{lista.map((a, i) => <span key={i}>{PERSONAGENS[s.lados[meu].u[a.u].id].nome.split(" ")[0]}: {PERSONAGENS[s.lados[meu].u[a.u].id].skills[a.s].nome} {alvoNome(a)}</span>)}</span>}
      </div>
    </div>
  );
}