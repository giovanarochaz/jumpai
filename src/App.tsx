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
  const [estrelas, setEstrelas] = useState<Estrela[]>([]);
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const planeta = imagensPlanetas[Math.floor(Math.random() * imagensPlanetas.length)];

      const novaBolaAnimada: BolinhaAnimada = {
        id: Date.now(),
        top: window.innerHeight * (margemTopo + Math.random() * (1 - 2 * margemTopo)),
        imagem: planeta.imagem,
        nome: planeta.nome,
      };

      setBolinhas(prev => [...prev, novaBolaAnimada]);

      setTimeout(() => {
        setBolinhas(prev => prev.filter(b => b.id !== novaBolaAnimada.id));
      }, 12000);
    }, 2500);

    return () => clearInterval(intervalo);
  }, [margemTopo]);

  useEffect(() => {
    const intervalColisao = setInterval(() => {
      if (bolaRef.current) {
        const bolaRect = bolaRef.current.getBoundingClientRect();

        bolinhas.forEach(bolinha => {
          const bolinhaElement = document.getElementById(`bolinha-${bolinha.id}`);
          if (bolinhaElement) {
            const bolinhaRect = bolinhaElement.getBoundingClientRect();

            if (verificarColisao(bolaRect, bolinhaRect)) {
              console.log(`Acertou o planeta ${bolinha.nome}!`);
              setBolinhas(prev => prev.filter(b => b.id !== bolinha.id));
            }
          }
        });
      }
    }, 100);

    return () => clearInterval(intervalColisao);
  }, [bolinhas]);

  useEffect(() => {
    const criarEstrelas = () => {
      const novasEstrelas: Estrela[] = Array.from({ length: 100 }).map(() => ({
        id: Math.random(),
        top: Math.random() * window.innerHeight,
        left: Math.random() * window.innerWidth,
      }));
      setEstrelas(novasEstrelas);
    };

    criarEstrelas();
    const intervalo = setInterval(criarEstrelas, 10000);
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
      {/* Estrelas */}
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

      {/* Bola/Astronauta */}
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

      {/* Bolinhas/Planetas */}
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
            title={b.nome}
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
