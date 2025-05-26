import React from "react";
import styled from "styled-components";

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const Subtitle = styled.h2`
  color: #34495e;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const Description = styled.p`
  color: #555;
  line-height: 1.6;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const PillarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const Pillar = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PillarTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.4rem;
`;

const PillarDescription = styled.p`
  color: #666;
  line-height: 1.5;
`;

const About = () => {
  return (
    <AboutContainer>
      <Title>Sobre o DKT-Learn</Title>
      
      <Section>
        <Description>
          O DKT-Learn é uma plataforma inovadora de estudos focada em Cálculo e Física, 
          desenvolvida para transformar a maneira como os estudantes aprendem e dominam 
          estas disciplinas fundamentais.
        </Description>
      </Section>

      <Section>
        <Subtitle>Nossa Metodologia</Subtitle>
        <Description>
          Nossa abordagem é baseada em três pilares fundamentais que formam a sigla DKT:
        </Description>
        
        <PillarContainer>
          <Pillar>
            <PillarTitle>D - Deduction (Dedução)</PillarTitle>
            <PillarDescription>
              A base do raciocínio matemático e físico, onde desenvolvemos a capacidade 
              de resolver problemas através do pensamento lógico e dedutivo.
            </PillarDescription>
          </Pillar>

          <Pillar>
            <PillarTitle>K - Knowledge (Conhecimento)</PillarTitle>
            <PillarDescription>
              Foco na construção sólida de fundamentos teóricos, garantindo uma base 
              robusta de conhecimento em cada tópico.
            </PillarDescription>
          </Pillar>

          <Pillar>
            <PillarTitle>T - Training (Treinamento)</PillarTitle>
            <PillarDescription>
              Prática intensiva com exercícios e problemas desafiadores, permitindo 
              a aplicação efetiva do conhecimento adquirido.
            </PillarDescription>
          </Pillar>
        </PillarContainer>
      </Section>

      <Section>
        <Subtitle>Nossa Missão</Subtitle>
        <Description>
          O "LEARN" em nosso nome reforça nosso compromisso com o aprendizado ativo e 
          eficaz. Acreditamos que a verdadeira aprendizagem acontece quando o estudante 
          é engajado em um processo contínuo de descoberta, prática e aplicação do 
          conhecimento.
        </Description>
        <Description>
          Na DKT-Learn, não apenas ensinamos conceitos - capacitamos os estudantes a 
          desenvolverem seu raciocínio dedutivo, construírem conhecimento sólido e 
          reforçarem seu aprendizado através de treinamento prático, tudo isso em um 
          ambiente especialmente projetado para aprender de verdade.
        </Description>
      </Section>
    </AboutContainer>
  );
};

export default About;