import Inicio from "../../components/Inicio";

// Mesmo conteúdo da home, aberto já na seção "participe". O endereço fica /participe, sem #.
export const metadata = { alternates: { canonical: "/" } };

export default function Pagina() {
  return <Inicio alvo="participe" />;
}