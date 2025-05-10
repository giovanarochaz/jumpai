import React from 'react';
import './Home.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import luva from '../../images/home/1.png';
import olho from '../../images/home/2.png';
import teclado from '../../images/home/3.png';

const Home: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação

  const opcoes = [
    { id: 1, nome: 'Luva', imagem: luva },
    { id: 2, nome: 'Olho', imagem: olho },
    { id: 3, nome: 'Teclado', imagem: teclado },
  ];

  // Função que será chamada ao clicar no botão
  const handleControleClick = (tipoControle: string) => {
    navigate(`/opcoes-jogos/${tipoControle}`);
  };

  return (
    <motion.div
      className="container-inicio"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <h1 className="titulo-inicio">JumpAI – Onde a acessibilidade encontra a diversão</h1>
      <p className="descricao-inicio">
        Escolha um tipo de controle para começar a jogar. Você pode usar a luva, os movimentos dos olhos ou o teclado para se divertir com o JumpAI. A acessibilidade é nossa prioridade, então selecione o controle que melhor se adapta a você!
      </p>

      <div className="caixa-botoes">
        {opcoes.map(({ id, nome, imagem }) => (
          <motion.div
            key={id}
            className="botao-interativo"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1.4 }}
            onClick={() => handleControleClick(nome.toLowerCase())} 
          >
            <img
              src={imagem}
              alt={`Ícone de ${nome}`}
              className="imagem-botao"
            />
            <p className="texto-botao">{nome}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Home;
