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
  from { right: 0; opacity: 1; }
  to { right: 100vw; opacity: 0; }
}
@keyframes piscar {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
@keyframes explode {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--x), var(--y)) scale(0.5);
  }
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
  const [loteIndex, setLoteIndex] = useState<number>(0);
  const [estrelas, setEstrelas] = useState<Estrela[]>([]);
  const [particulas, setParticulas] = useState<{ id: number; x: number; y: number; dx: number; dy: number }[]>([]);

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

  const gerarLotePlanetas = () => {
    const novoLote: BolinhaAnimada[] = [];

    for (let i = 0; i < 5; i++) {
      let planeta;

      if (i === 0 && coletados.length < imagensPlanetas.length) {
        const próximo = imagensPlanetas[coletados.length]?.nome;
        planeta = imagensPlanetas.find(p => p.nome === próximo) || imagensPlanetas[Math.floor(Math.random() * imagensPlanetas.length)];
      } else {
        planeta = imagensPlanetas[Math.floor(Math.random() * imagensPlanetas.length)];
      }

      novoLote.push({
        id: Date.now() + i,
        top: window.innerHeight * (margemTopo + Math.random() * (1 - 2 * margemTopo)),
        imagem: planeta.imagem,
        nome: planeta.nome,
      });
    }

    return novoLote;
  };

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (loteIndex < loteAtual.length) {
        setBolinhas(prev => [...prev, loteAtual[loteIndex]]);
        setLoteIndex(prev => prev + 1);
      }
    }, 2500);
    return () => clearInterval(intervalo);
  }, [loteAtual, loteIndex]);

  useEffect(() => {
    if (loteIndex >= loteAtual.length) {
      setLoteAtual(gerarLotePlanetas());
      setLoteIndex(0);
    }
  }, [loteIndex]);

  const criarParticulas = (x: number, y: number) => {
    const novas = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      dx: Math.random() * 40 - 20,
      dy: Math.random() * 40 - 20,
    }));
    setParticulas(prev => [...prev, ...novas]);

    setTimeout(() => {
      setParticulas(prev => prev.filter(p => !novas.includes(p)));
    }, 1000);
  };

  useEffect(() => {
    const intervalColisao = setInterval(() => {
      if (bolaRef.current) {
        const bolaRect = bolaRef.current.getBoundingClientRect();

        bolinhas.forEach(bolinha => {
          const el = document.getElementById(`bolinha-${bolinha.id}`);
          if (el) {
            const bolinhaRect = el.getBoundingClientRect();

            if (verificarColisao(bolaRect, bolinhaRect)) {
              criarParticulas(bolinhaRect.left, bolinhaRect.top);

              if (!coletados.includes(bolinha.nome)) {
                const indexDoColetado = imagensPlanetas.findIndex(p => p.nome === bolinha.nome);
                const indexMaisAlto = Math.max(
                  ...coletados.map(nome => imagensPlanetas.findIndex(p => p.nome === nome)),
                  -1
                );

                if (indexDoColetado === indexMaisAlto + 1) {
                  setColetados(prev => [...prev, bolinha.nome]);
                  console.log(`✅ Coletado: ${bolinha.nome}`);
                } else if (indexDoColetado >= indexMaisAlto) {
                  const novos = coletados.filter(nome => {
                    const idx = imagensPlanetas.findIndex(p => p.nome === nome);
                    return idx >= indexDoColetado;
                  });
                  setColetados(novos);
                  console.log(`⚠️ Ordem errada: resetando após ${bolinha.nome}`);
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

  useEffect(() => {
    const criarEstrelas = () => {
      const novas = Array.from({ length: 100 }).map(() => ({
        id: Math.random(),
        top: Math.random() * window.innerHeight,
        left: Math.random() * window.innerWidth,
      }));
      setEstrelas(novas);
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

      {/* Astronauta */}
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

      {/* Planetas */}
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

      {/* Partículas de explosão */}
      {particulas.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: p.y,
            left: p.x,
            width: '6px',
            height: '6px',
            backgroundColor: 'yellow',
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: 'explode 1s ease-out forwards',
            transformOrigin: 'center',
            // Custom props via CSS vars
            ['--x' as any]: `${p.dx}px`,
            ['--y' as any]: `${p.dy}px`,
          }}
        />
      ))}
    </div>
  );
};

export default BolaControlada;
