// Código de recuperação do nick: 12 caracteres (sem 0/O/1/I), mostrados em grupos de 4.
// No servidor fica só o hash (SHA-256) do código; quem vê o ranking não consegue usar o hash para recuperar o nick.
const ALF = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function gerarCodigo() {
  const b = new Uint8Array(12);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => ALF[x % ALF.length]).join("");
}
export const normalizarCodigo = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
export const formatarCodigo = (c) => normalizarCodigo(c).replace(/(.{4})(?=.)/g, "$1-");
export async function hashCodigo(c) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalizarCodigo(c)));
  return Array.from(new Uint8Array(d), (x) => x.toString(16).padStart(2, "0")).join("");
}