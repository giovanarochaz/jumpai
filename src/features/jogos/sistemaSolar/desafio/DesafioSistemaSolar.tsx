// DesafioSistemaSolar.tsx
import React, { useState, useEffect, useRef } from 'react';
import './DesafioSistemaSolar.css'; // Estilos separados

import astronautaImg from '../../../../images/jogos/sistemaSolar/atronauta.png';
import mercurio from '../../../../images/jogos/sistemaSolar/mercurio.png';
import venus from '../../../../images/jogos/sistemaSolar/venus.png';
import terra from '../../../../images/jogos/sistemaSolar/terra.png';
import marte from '../../../../images/jogos/sistemaSolar/marte.png';
import jupiter from '../../../../images/jogos/sistemaSolar/jupiter.png';
import saturno from '../../../../images/jogos/sistemaSolar/saturno.png';
import urano from '../../../../images/jogos/sistemaSolar/urano.png';
import netuno from '../../../../images/jogos/sistemaSolar/netuno.png';
import { Estrela } from '../../../../types/estrela';
import { Planeta } from '../../../../types/planeta';

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

const DesafioSistemaSolar: React.FC = () => {
  // Estados principais
  const [posY, setPosY] = useState<number>(80);
  const [bolinhas, setBolinhas] = useState<Planeta[]>([]);
  const [coletados, setColetados] = useState<string[]>([]);
  const [loteAtual, setLoteAtual] = useState<Planeta[]>([]);
  const [loteIndex, setLoteIndex] = useState<number>(0);
  const [estrelas, setEstrelas] = useState<Estrela[]>([]);
  const [particulas, setParticulas] = useState<{ id: number; x: number; y: number; dx: number; dy: number }[]>([]);

  const bolaRef = useRef<HTMLDivElement>(null);
  const margemTopo = 0.15;

  // Controle com teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") setPosY(window.innerHeight * margemTopo);
      if (event.key === "ArrowDown") setPosY(window.innerHeight * (1 - margemTopo));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Geração de planetas por lote
  const gerarLotePlanetas = () => {
    const novoLote: Planeta[] = [];
    for (let i = 0; i < 5; i++) {
      const index = coletados.length;
      const planeta = i === 0 && index < imagensPlanetas.length
        ? imagensPlanetas[index]
        : imagensPlanetas[Math.floor(Math.random() * imagensPlanetas.length)];
      novoLote.push({
        id: Date.now() + i,
        top: window.innerHeight * (margemTopo + Math.random() * (1 - 2 * margemTopo)),
        imagem: planeta.imagem,
        nome: planeta.nome,
      });
    }
    return novoLote;
  };

  // Animação de entrada de planetas
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

  // Geração de partículas após colisão
  const criarParticulas = (x: number, y: number) => {
    const novas = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + i,
      x, y,
      dx: Math.random() * 40 - 20,
      dy: Math.random() * 40 - 20,
    }));
    setParticulas(prev => [...prev, ...novas]);
    setTimeout(() => setParticulas(prev => prev.filter(p => !novas.includes(p))), 1000);
  };

  // Verificação de colisão entre astronauta e planeta
  useEffect(() => {
    const verificarColisao = (bola: DOMRect, bolinha: DOMRect) =>
      bola.left < bolinha.right - 5 && bola.right > bolinha.left + 5 &&
      bola.top < bolinha.bottom - 5 && bola.bottom > bolinha.top + 5;

    const intervalo = setInterval(() => {
      if (!bolaRef.current) return;
      const bolaRect = bolaRef.current.getBoundingClientRect();

      bolinhas.forEach(b => {
        const el = document.getElementById(`bolinha-${b.id}`);
        if (!el) return;
        const bolinhaRect = el.getBoundingClientRect();

        if (verificarColisao(bolaRect, bolinhaRect)) {
          criarParticulas(bolinhaRect.left, bolinhaRect.top);

          if (!coletados.includes(b.nome)) {
            const indexColetado = imagensPlanetas.findIndex(p => p.nome === b.nome);
            const indexMaisAlto = Math.max(...coletados.map(n => imagensPlanetas.findIndex(p => p.nome === n)), -1);

            if (indexColetado === indexMaisAlto + 1) {
              setColetados(prev => [...prev, b.nome]);
            } else if (indexColetado >= indexMaisAlto) {
              const novos = coletados.filter(n => imagensPlanetas.findIndex(p => p.nome === n) >= indexColetado);
              setColetados(novos);
            }
          }

          setBolinhas(prev => prev.filter(item => item.id !== b.id));
        }
      });
    }, 100);

    return () => clearInterval(intervalo);
  }, [bolinhas, coletados]);

  // Criação de estrelas de fundo
  useEffect(() => {
    const gerar = () => setEstrelas(Array.from({ length: 100 }).map(() => ({
      id: Math.random(),
      top: Math.random() * window.innerHeight,
      left: Math.random() * window.innerWidth,
    })));
    gerar();
    const intervalo = setInterval(gerar, 10000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="container-sistema-solar">
      {/* Painel de progresso */}
      <div className="painel-planetas">
        {imagensPlanetas.map(p => (
          <img
            key={p.nome}
            src={p.imagem}
            alt={p.nome}
            title={p.nome}
            className={`icone-planeta ${coletados.includes(p.nome) ? 'ativo' : ''}`}
          />
        ))}
      </div>

      {/* Estrelas */}
      {estrelas.map(e => (
        <div
          key={e.id}
          className="estrela"
          style={{ top: e.top, left: e.left, animationDelay: `${Math.random() * 5}s` }}
        />
      ))}

      {/* Astronauta */}
      <div ref={bolaRef} className="astronauta" style={{ top: `${posY}px` }}>
        <img src={astronautaImg} alt="Astronauta" />
      </div>

      {/* Planetas animados */}
      {bolinhas.map(b => (
        <div
          key={b.id}
          id={`bolinha-${b.id}`}
          className="bolinha"
          style={{ top: `${b.top}px` }}
        >
          <img src={b.imagem} alt={b.nome} />
        </div>
      ))}

      {/* Efeitos de partículas */}
      {particulas.map(p => (
        <div
          key={p.id}
          className="particula"
          style={{
            top: p.y,
            left: p.x,
            ['--x' as any]: `${p.dx}px`,
            ['--y' as any]: `${p.dy}px`,
          }}
        />
      ))}
    </div>
  );
};

export default DesafioSistemaSolar;
