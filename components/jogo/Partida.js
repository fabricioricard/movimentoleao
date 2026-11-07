"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { reproduzir, bot, outro, turnoMs } from "../../lib/jogo/motor.js";
import { concluirPartida } from "../../lib/jogo/missoes.js";
import { PERSONAGENS } from "../../lib/jogo/personagens.js";
import Batalha from "./Batalha.js";

// Controla uma partida: contra o computador (local) ou contra outro jogador (movimentos pelo servidor).
export default function Partida({ backend, jogador, modo, init, meu, nicks, matchId, onFim, onSair }) {
  const [movs, setMovs] = useState([]);
  const [seg, setSeg] = useState(Math.round(turnoMs(init) / 1000));
  const [resultado, setResultado] = useState(null);
  const [aguardando, setAguardando] = useState(false);
  const movsRef = useRef(movs); movsRef.current = movs;
  const prazo = useRef(Date.now() + turnoMs(init));
  const contou = useRef(false);

  // Movimentos do servidor (PvP). O lado de cada movimento vem de QUEM escreveu, nunca do conteúdo.
  useEffect(() => {
    if (modo !== "pvp") return;
    return backend.observarMovs(matchId, (l) => setMovs(l.map((m) => ({ ...m, lado: m.uid === init.uidA ? "a" : "b" }))));
  }, [backend, modo, matchId, init.uidA]);

  const s = useMemo(() => reproduzir(init, movs), [init, movs]);
  const sRef = useRef(s); sRef.current = s;
  useEffect(() => { prazo.current = Date.now() + turnoMs(init); setAguardando(false); }, [movs.length]);

  const enviar = useCallback(async (mov) => {
    if (modo === "bot") { setMovs((l) => [...l, { ...mov, lado: meu, ts: Date.now() }]); return; }
    setAguardando(true);
    for (let k = 0; k < 4; k++) {
      const ok = await backend.enviarMov(matchId, mov, movsRef.current.length + 1);
      if (ok) return;
      await new Promise((r) => setTimeout(r, 500));
      if (sRef.current.turno !== mov.turn || sRef.current.venc) break;
    }
    setAguardando(false);
  }, [backend, modo, matchId, meu]);

  // Vez do computador.
  useEffect(() => {
    if (modo !== "bot" || s.venc || s.lado === meu) return;
    const t = setTimeout(() => {
      const cur = sRef.current; if (cur.venc || cur.lado === meu) return;
      setMovs((l) => [...l, { t: "turn", turn: cur.turno, acts: bot(cur, cur.lado), lado: cur.lado, ts: Date.now() }]);
    }, 700);
    return () => clearTimeout(t);
  }, [modo, s, meu]);

  // Relógio e estouro de tempo.
  useEffect(() => {
    const iv = setInterval(() => {
      const cur = sRef.current; if (cur.venc) return;
      const falta = Math.round((prazo.current - Date.now()) / 1000);
      setSeg(falta);
      if (modo === "bot" && cur.lado !== meu) return;
      if (falta <= -1 && cur.lado === meu) { enviar({ t: "timeout", turn: cur.turno }); prazo.current = Date.now() + turnoMs(init); }
      else if (modo === "pvp" && cur.lado !== meu && falta <= -2) { enviar({ t: "timeout", turn: cur.turno }); prazo.current = Date.now() + turnoMs(init); }
    }, 1000);
    return () => clearInterval(iv);
  }, [enviar, modo, meu]);

  // Fim: grava estatísticas e missões uma única vez.
  useEffect(() => {
    if (!s.venc || contou.current) return;
    contou.current = true;
    const venceu = s.venc === meu;
    const usadas = movs.filter((m) => m.lado === meu && m.t === "turn").reduce((a, m) => a + (m.acts ? m.acts.length : 0), 0);
    const flawless = venceu && s.lados[meu].u.every((u) => u.hp > 0);
    const r = concluirPartida(jogador, { venceu, pvp: modo === "pvp", usadas, flawless, matchId });
    setResultado({ venceu, motivo: s.motivo, pvp: modo === "pvp", ...r });
    backend.salvar(r.jogador, modo === "pvp" ? { matchId, venceu, delta: r.delta } : null).catch(() => {});
  }, [s.venc]); // eslint-disable-line

  return (
    <>
      <Batalha s={s} meu={meu} nicks={nicks} seg={seg} onEnviar={enviar} aguardando={aguardando} onDesistir={() => { if (s.venc) return; if (window.confirm("Desistir da partida? Conta como derrota.")) { if (modo === "bot") setMovs((l) => [...l, { t: "surrender", lado: meu, ts: Date.now() }]); else enviar({ t: "surrender" }); } }} />
      {resultado && (
        <div className="jg-modal" role="dialog" aria-modal="true">
          <div className="jg-modal-in">
            <h2>{resultado.venceu ? "Vitória!" : "Derrota"}</h2>
            <p className="jg-modal-sub">{resultado.motivo === "desistência" ? "Por desistência." : resultado.motivo === "tempo" ? "Por tempo esgotado." : resultado.venceu ? "Você venceu a batalha." : "Não foi desta vez."}</p>
            {resultado.pvp && <p className="jg-pontos">{resultado.delta > 0 ? "+" : resultado.delta < 0 ? "−" : ""}{Math.abs(resultado.delta)} pontos · agora você tem <b>{resultado.jogador.pontos}</b></p>}
            {resultado.missoes.length > 0 && (
              <div className="jg-novos">
                <h3>Missão cumprida</h3>
                {resultado.missoes.map((m) => <p key={m.id}>✔ {m.nome}</p>)}
                {resultado.novos.map((id) => <p key={id} className="jg-novo">Novo personagem: <b>{PERSONAGENS[id].nome}</b></p>)}
              </div>
            )}
            <button type="button" className="jg-btn jg-btn-ouro jg-btn-grande" onClick={() => onFim(resultado.jogador)}>Voltar ao menu</button>
          </div>
        </div>
      )}
    </>
  );
}