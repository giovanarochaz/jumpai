import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importando useNavigate e useParams
import './EscolherDificuldade.css'; // Importando os estilos CSS

const EscolherDificuldade: React.FC = () => {
  // Agora estamos pegando corretamente o parâmetro tipoControle
  const { tipoControle } = useParams<{ tipoControle: string }>(); 

  const navigate = useNavigate(); // Criando o hook de navegação

  // Função para manipular a seleção de dificuldade
  const handleEscolherDificuldade = (dificuldade: string) => {
    // Navega para a rota com o tipoControle como parâmetro
    navigate(`/jogo/sistemaSolar/${dificuldade}/${tipoControle}`);
  };

  return (
    <div className="container-dificuldade">
      <h1>Escolha a Dificuldade</h1>
      <div className="cards">
        <div
          className="card"
          onClick={() => handleEscolherDificuldade('facil')}
        >
          <h2>Fácil</h2>
        </div>
        <div
          className="card"
          onClick={() => handleEscolherDificuldade('medio')}
        >
          <h2>Médio</h2>
        </div>
        <div
          className="card"
          onClick={() => handleEscolherDificuldade('dificil')}
        >
          <h2>Difícil</h2>
        </div>
        <div
          className="card"
          onClick={() => handleEscolherDificuldade('desafio')}
        >
          <h2>Desafio</h2>
        </div>
      </div>
    </div>
  );
};

export default EscolherDificuldade;
