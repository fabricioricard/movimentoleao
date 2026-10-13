import Inicio from "../../components/Inicio";

// Mesmo conteúdo da home, aberto já na seção "pilares". O endereço fica /pilares, sem #.
export const metadata = { alternates: { canonical: "/" } };

export default function Pagina() {
  return <Inicio alvo="pilares" />;
}