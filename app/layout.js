import "./globals.css";
import { SITE } from "../lib/config";

export const metadata = {
  title: `${SITE.nome} — Liderança para Eficiência, Autonomia e Ordem`,
  description: SITE.descricao,
  openGraph: {
    title: SITE.nome,
    description: SITE.descricao,
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.nome,
    description: SITE.descricao,
  },
};

export const viewport = {
  themeColor: "#06142b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
