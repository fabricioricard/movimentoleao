import "./globals.css";
import { SITE } from "../lib/config";
import { Analytics } from "@vercel/analytics/next";
import RolagemSuave from "../components/RolagemSuave";
import Flutuantes from "../components/Flutuantes";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.nome} — Um Estado que serve ao povo`,
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
  themeColor: "#050e24",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800&display=swap"
        />
      </head>
      <body>
        <RolagemSuave />
        {children}
        <Flutuantes />
        <Analytics />
      </body>
    </html>
  );
}