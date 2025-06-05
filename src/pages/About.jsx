import HomeHeader from "../components/HomeHeader";

const About = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HomeHeader />

      <main className="max-w-4xl mx-auto w-full px-4 py-10 flex-1">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Sobre o DKT-Learn
        </h1>

        <section className="mb-10">
          <p className="text-lg text-gray-700 text-center mb-6">
            O DKT-Learn é uma plataforma inovadora de estudos focada em Cálculo
            e Física, desenvolvida para transformar a maneira como os estudantes
            aprendem e dominam estas disciplinas fundamentais.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
            Nossa Metodologia
          </h2>
          <p className="text-base text-gray-600 text-center mb-8">
            Nossa abordagem é baseada em três pilares fundamentais que formam a
            sigla DKT:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg shadow p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold text-indigo-800 mb-2">
                D - Deduction (Dedução)
              </h3>
              <p className="text-gray-600 text-center">
                A base do raciocínio matemático e físico, onde desenvolvemos a
                capacidade de resolver problemas através do pensamento lógico e
                dedutivo.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold text-indigo-800 mb-2">
                K - Knowledge (Conhecimento)
              </h3>
              <p className="text-gray-600 text-center">
                Foco na construção sólida de fundamentos teóricos, garantindo
                uma base robusta de conhecimento em cada tópico.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold text-indigo-800 mb-2">
                T - Training (Treinamento)
              </h3>
              <p className="text-gray-600 text-center">
                Prática intensiva com exercícios e problemas desafiadores,
                permitindo a aplicação efetiva do conhecimento adquirido.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
            Nossa Missão
          </h2>
          <p className="text-base text-gray-600 text-center mb-4">
            O "LEARN" em nosso nome reforça nosso compromisso com o aprendizado
            ativo e eficaz. Acreditamos que a verdadeira aprendizagem acontece
            quando o estudante é engajado em um processo contínuo de descoberta,
            prática e aplicação do conhecimento.
          </p>
          <p className="text-base text-gray-600 text-center">
            Na DKT-Learn, não apenas ensinamos conceitos - capacitamos os
            estudantes a desenvolverem seu raciocínio dedutivo, construírem
            conhecimento sólido e reforçarem seu aprendizado através de
            treinamento prático, tudo isso em um ambiente especialmente
            projetado para aprender de verdade.
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;
