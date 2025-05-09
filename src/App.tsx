import React, { useState, useEffect, CSSProperties, useRef } from 'react';

import astronautaImg from './images/jogos/sistemaSolar/atronauta.png';
import mercurio from './images/jogos/sistemaSolar/mercurio.png';
import venus from './images/jogos/sistemaSolar/venus.png';
import terra from './images/jogos/sistemaSolar/terra.png';
import marte from './images/jogos/sistemaSolar/marte.png';
import jupiter from './images/jogos/sistemaSolar/jupiter.png';
import saturno from './images/jogos/sistemaSolar/saturno.png';
import urano from './images/jogos/sistemaSolar/urano.png';
import netuno from './images/jogos/sistemaSolar/netuno.png';

const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes mover {
  from {
    right: 0;
    opacity: 1;
  }
  to {
    right: 100vw;
    opacity: 0;
  }
}

@keyframes piscar {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
`;
document.head.appendChild(styleSheet);
interface Estrela {
  id: number;
  top: number;
  left: number;
}

interface BolinhaAnimada {
  id: number;
  top: number;
  imagem: string;
  nome: string;
}

const imagensPlanetas = [
  { nome: 'Mercúrio', imagem: mercurio },
  { nome: 'Vênus', imagem: venus },
  { nome: 'Terra', imagem: terra },
  { nome: 'Marte', imagem: marte },
  { nome: 'Júpiter', imagem: jupiter },
  { nome: 'Saturno', imagem: saturno },
  { nome: 'Urano', imagem: urano },
  { nome: 'Netuno', imagem: netuno },
];


const BolaControlada: React.FC = () => {  
  const [posY, setPosY] = useState<number>(80);
  const [bolinhas, setBolinhas] = useState<BolinhaAnimada[]>([]);
  const [coletados, setColetados] = useState<string[]>([]);
  const [loteAtual, setLoteAtual] = useState<BolinhaAnimada[]>([]);
  const [loteIndex, setLoteIndex] = useState<number>(0); // Índice para liberar planetas do lote
  const [estrelas, setEstrelas] = useState<{ id: number; top: number; left: number }[]>([]);
  const margemTopo = 0.1;

  const bolaRef = useRef<HTMLDivElement>(null);
  const bolaWidth = 100;
  const bolaHeight = 100;
  const bolinhaWidth = 40;
  const bolinhaHeight = 40;
  const margemColisao = 5;


  const verificarColisao = (bolaRect: DOMRect, bolinhaRect: DOMRect) => {
    return (
      bolaRect.left < bolinhaRect.right - margemColisao &&
      bolaRect.right > bolinhaRect.left + margemColisao &&
      bolaRect.top < bolinhaRect.bottom - margemColisao &&
      bolaRect.bottom > bolinhaRect.top + margemColisao
    );
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      setPosY(window.innerHeight * margemTopo);
    } else if (event.key === "ArrowDown") {
      setPosY(window.innerHeight * (1 - margemTopo * 2));
    }
  };


  // Ouvir teclas
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Função para gerar um lote de 5 planetas
  const gerarLotePlanetas = () => {
    const novoLote: BolinhaAnimada[] = [];
    
    for (let i = 0; i < 5; i++) {
      let planeta: { nome: string, imagem: string };

      if (i === 0 && coletados.length < imagensPlanetas.length) {
        // Garantir que o próximo planeta da sequência seja o primeiro do lote
        const próximoPlanetaNome = imagensPlanetas[coletados.length]?.nome;
        planeta = imagensPlanetas.find(p => p.nome === próximoPlanetaNome) || imagensPlanetas[Math.floor(Math.random() * imagensPlanetas.length)];
      } else {
        // Escolher planeta aleatoriamente para os outros
        planeta = imagensPlanetas[Math.floor(Math.random() * imagensPlanetas.length)];
      }

      novoLote.push({
        id: Date.now() + i,  // id único por planetas no lote
        top: window.innerHeight * (margemTopo + Math.random() * (1 - 2 * margemTopo)),
        imagem: planeta.imagem,
        nome: planeta.nome,
      });
    }

    return novoLote;
  };


  // Função para liberar planetas um por vez a cada 2500ms
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (loteIndex < loteAtual.length) {
        setBolinhas(prev => [...prev, loteAtual[loteIndex]]);
        setLoteIndex(prev => prev + 1); // Avançar para o próximo planeta do lote
      }
    }, 2500); // Libera um planeta a cada 2500ms

    return () => clearInterval(intervalo);
  }, [loteAtual, loteIndex]);

    // Função para reiniciar o ciclo de planetas e gerar um novo lote
  useEffect(() => {
    if (loteIndex >= loteAtual.length) {
      setLoteAtual(gerarLotePlanetas()); // Gerar novo lote de planetas
      setLoteIndex(0); // Resetar o índice para liberar planetas do novo lote
    }
  }, [loteIndex]);

  // Verificar colisão e coletar planetas
  useEffect(() => {
    const intervalColisao = setInterval(() => {
      if (bolaRef.current) {
        const bolaRect = bolaRef.current.getBoundingClientRect();

        bolinhas.forEach(bolinha => {
          const bolinhaElement = document.getElementById(`bolinha-${bolinha.id}`);
          if (bolinhaElement) {
            const bolinhaRect = bolinhaElement.getBoundingClientRect();

            if (verificarColisao(bolaRect, bolinhaRect)) {
              if (!coletados.includes(bolinha.nome)) {
                const indexDoColetado = imagensPlanetas.findIndex(p => p.nome === bolinha.nome);
                const indexMaisAltoColetado = Math.max(
                  ...coletados.map(nome => imagensPlanetas.findIndex(p => p.nome === nome)),
                  -1
                );

                if (indexDoColetado === indexMaisAltoColetado + 1) {
                  setColetados(prev => [...prev, bolinha.nome]);
                  console.log(`✅ Coletado na ordem: ${bolinha.nome}`);
                } else if (indexDoColetado >= indexMaisAltoColetado) {

                  const novosColetados = coletados.filter(nome => {
                    const idx = imagensPlanetas.findIndex(p => p.nome === nome);
                    return idx >= indexDoColetado;
                  });

                  setColetados(novosColetados);
                  console.log(`⚠️ Fora de ordem: resetando planetas após ${bolinha.nome}`);
                } else {
                  console.log(`❌ Precisa coletar ${imagensPlanetas[indexMaisAltoColetado + 1]?.nome} antes.`);
                }
              }

              setBolinhas(prev => prev.filter(b => b.id !== bolinha.id));
            }
          }
        });
      }
    }, 100);

    return () => clearInterval(intervalColisao);
  }, [bolinhas, coletados]);


  // Criar estrelas piscando
  useEffect(() => {
    const criarEstrelas = () => {
      const novasEstrelas = Array.from({ length: 100 }).map(() => ({
        id: Math.random(),
        top: Math.random() * window.innerHeight,
        left: Math.random() * window.innerWidth,
      }));
      setEstrelas(novasEstrelas);
    };

    criarEstrelas();
    const intervalo = setInterval(criarEstrelas, 10000); // renovar a cada 10s

    return () => clearInterval(intervalo);
  }, []);

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(to bottom, #0a1c3c, #132b62)',
  };

  const bolaStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    width: `${bolaWidth}px`,
    height: `${bolaHeight}px`,
    transform: 'translateX(-50%)',
    top: `${posY}px`,
    transition: 'top 1.8s ease',
  };

  const estrelaStyle: CSSProperties = {
    position: 'absolute',
    width: '2px',
    height: '2px',
    backgroundColor: 'white',
    borderRadius: '50%',
    opacity: 0.2,
    animation: 'piscar 2s infinite ease-in-out',
  };

  return (
    <div style={containerStyle}>
      {/* Painel com planetas coletáveis */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '15px',
        zIndex: 10,
        marginTop: '15px'
      }}>
        {imagensPlanetas.map(planeta => (
          <img
            key={planeta.nome}
            src={planeta.imagem}
            alt={planeta.nome}
            title={planeta.nome}
            style={{
              width: '60px',
              height: '60px',
              opacity: coletados.includes(planeta.nome) ? 1 : 0.3,
              transition: 'opacity 0.3s ease-in-out',
              filter: 'drop-shadow(0 0 2px white)',
            }}
          />
        ))}
      </div>

      {/* Estrelas de fundo */}
      {estrelas.map(e => (
        <div
          key={e.id}
          style={{
            ...estrelaStyle,
            top: e.top,
            left: e.left,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Astronauta controlável */}
      <div ref={bolaRef} style={bolaStyle}>
        <img
          src={astronautaImg}
          alt="Astronauta"
          style={{
            width: '200px',
            height: '200px',
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Planetas animados (como bolinhas) */}
      {bolinhas.map(b => (
        <div
          key={b.id}
          id={`bolinha-${b.id}`}
          style={{
            position: 'absolute',
            right: 0,
            width: `${bolinhaWidth}px`,
            height: `${bolinhaHeight}px`,
            top: `${b.top}px`,
            animation: 'mover 5s linear forwards',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <img
            src={b.imagem}
            alt={b.nome}
            style={{
              width: '100px',
              height: '100px',
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default BolaControlada;
