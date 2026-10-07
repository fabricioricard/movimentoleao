import Link from "next/link";
import { SITE } from "../../lib/config";
import Topo from "../../components/Topo";
import Rodape from "../../components/Rodape";

export const metadata = {
  title: "Manifesto — LEAO",
  description:
    "O manifesto do Movimento LEAO: quem somos, os 4 pilares da nossa causa, a jornada do movimento ao partido e o que esperamos de cada membro.",
};

const SIGLA = ["Liderança", "Eficiência", "Autonomia", "Ordem"];

const PILARES = [
  {
    titulo: "Liderança com Servidão Estatal",
    texto:
      "O governante não é um rei, é um servidor. Toda ação do governo deve ser medida pelo benefício real na vida da população.",
  },
  {
    titulo: "Eficiência e Harmonia Corporativa",
    texto:
      "Chega de divisão, parasitismo e luta de classes. Defendemos a cooperação inteligente entre o capital, o trabalho, a ciência e a produção, garantindo um Estado enxuto, ágil e focado na entrega de resultados reais.",
  },
  {
    titulo: "Autonomia do Cidadão",
    texto:
      "Desburocratização total. O Estado só deve intervir onde a iniciativa individual, familiar e comunitária não for suficiente.",
  },
  {
    titulo: "Ordem e Justiça",
    texto:
      "Sem ordem não há liberdade real. Tolerância zero com a impunidade e valorização do mérito em todas as instâncias da gestão pública.",
  },
];

const FASES = [
  {
    nome: "Movimento Popular",
    atual: true,
    texto: "Formação de base, debate de propostas, expansão nos municípios e organização dos núcleos setoriais.",
  },
  {
    nome: "Estruturação Institucional",
    texto: "Formalização das comissões regionais e coleta de apoio em todo o território nacional.",
  },
  {
    nome: "O Partido LEAO",
    texto: "Registro oficial perante a Justiça Eleitoral para apresentar candidaturas comprometidas com o nosso programa.",
  },
];

const ESPERAMOS = [
  { titulo: "Respeito e Lealdade", texto: "Este é um ambiente de construção e debates de alto nível." },
  {
    titulo: "Engajamento",
    texto: "Compartilhe nossas ideias, traga novos membros de confiança e participe dos debates temáticos.",
  },
  { titulo: "Ação", texto: "Um movimento forte é feito por pessoas que agem." },
];

export default function Manifesto() {
  return (
    <>
      <Topo />

      <main>
        <section className="hero pagina-hero">
          <div className="container">
            <h1 className="hero-titulo">
              <span className="linha">Manifesto</span>
              <span className="linha destaque">do movimento</span>
            </h1>
            <p className="hero-sub">Seja bem-vindo ao Movimento LEAO!</p>
          </div>
        </section>

        <section className="bloco bloco-gelo" aria-label="Apresentação">
          <div className="container manifesto">
            <p className="manifesto-frase">
              Nós não aceitamos mais um país onde o cidadão trabalha para sustentar uma máquina estatal pesada,
              ineficiente e distante da realidade.{" "}
              <mark>O Estado existe para servir ao Povo, e não o contrário.</mark>
            </p>
            <p className="manifesto-apoio">
              Se você está neste grupo, é porque entende que o Brasil precisa de uma mudança profunda na forma como o
              poder e a sociedade se relacionam.
            </p>
          </div>
        </section>

        <section className="bloco bloco-marinho" aria-labelledby="titulo-quem">
          <div className="container">
            <h2 className="titulo-secao junto" id="titulo-quem">
              Quem somos?
            </h2>
            <p className="secao-intro">
              O LEAO nasce como um Movimento de Cidadãos, unindo trabalhadores, empreendedores, estudantes,
              profissionais liberais e famílias, comprometidos em devolver a dignidade, o respeito e a eficiência ao
              nosso país.
            </p>
            <p className="sigla-chamada">
              Nosso objetivo final é a consolidação de uma força política nacional guiada pela sigla que carrega nosso
              propósito:
            </p>
            <ol className="sigla-lista">
              {SIGLA.map((p, i) => (
                <li className={i % 2 ? "sigla-ouro" : "sigla-royal"} key={p}>
                  <span className="sigla-l" aria-hidden="true">
                    {p[0]}
                  </span>
                  <span className="sigla-p">{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bloco bloco-gelo" aria-labelledby="titulo-pilares">
          <div className="container">
            <h2 className="titulo-secao junto" id="titulo-pilares">
              Os 4 pilares da nossa causa
            </h2>
            <p className="secao-intro">O que sustenta tudo o que o movimento defende.</p>
            <ol className="causa">
              {PILARES.map((p, i) => (
                <li className="causa-item" key={p.titulo}>
                  <span className="causa-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bloco bloco-marinho" aria-labelledby="titulo-jornada">
          <div className="container">
            <h2 className="titulo-secao junto" id="titulo-jornada">
              A nossa jornada: do movimento ao partido
            </h2>
            <p className="secao-intro">Não somos uma promessa vaga. Temos um plano claro de execução em fases.</p>
            <ol className="fases">
              {FASES.map((f, i) => (
                <li className={`fase${f.atual ? " fase-atual" : ""}`} key={f.nome}>
                  <span className="fase-rotulo">
                    Fase {i + 1}
                    {f.atual && <em>Atual</em>}
                  </span>
                  <h3>{f.nome}</h3>
                  <p>{f.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bloco bloco-gelo" aria-labelledby="titulo-esperamos">
          <div className="container">
            <h2 className="titulo-secao junto" id="titulo-esperamos">
              O que esperamos de você aqui
            </h2>
            <ul className="laterais esperamos">
              {ESPERAMOS.map((e) => (
                <li className="lateral" key={e.titulo}>
                  <h3>{e.titulo}</h3>
                  <p>{e.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bloco bloco-royal">
          <div className="container chamada">
            <h2 className="chamada-titulo">O leão não se curva diante da desordem. O leão protege o seu povo.</h2>
            <p className="chamada-texto">Junte-se à liderança. Construa essa história conosco desde o primeiro dia!</p>
            <div className="chamada-acoes">
              <a className="pilula pilula-ouro pilula-grande" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                Entrar no grupo do WhatsApp
              </a>
              <Link className="pilula pilula-linha pilula-grande" href="/posicoes">
                Ver as posições
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}