import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importando useParams
import Carousel from '../../components/carrosel/Carrosel';
import './Jogo.css';

import sistemSolar from '../../images/capas/capa_sistema_solar.png';
import numeros from '../../images/capas/capa_batalha_numeros.png';
import cores from '../../images/capas/capa_festival_cores.png';

const Jogos: React.FC = () => {
  const { tipoControle } = useParams<{ tipoControle: string }>(); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  const items = [
    {
      image: numeros,
      title: 'Números',
      description: 'Nesta fase, você enfrentará um gigante numérico. Resolva as contas para impedi-lo de vencer. Mas corra, o tempo está contra você!',
      gameRoute: `/jogo/sistemaSolar/dificuldade/${tipoControle}`, // Passando tipoControle para a rota
    },
    {
      image: sistemSolar,
      title: 'Sistema Solar',
      description: 'Nesta fase, você viajará pelo sistema solar em busca dos planetas. Mas cuidado, obstáculos podem surgir pelo caminho! Fique atento!',
      gameRoute: `/jogo/sistemaSolar/dificuldade/${tipoControle}`, // Passando tipoControle para a rota
    },
    {
      image: cores,
      title: 'Festival das Cores',
      description: 'Nesta fase, uma chuva colorida começou. Sua missão é recolher as cores e separar elas, mas cuidado, não pegue as cores proibidas!',
      gameRoute: `/jogo/sistemaSolar/dificuldade/${tipoControle}`, // Passando tipoControle para a rota
    },
  ];

  return (
    <div className={`container-jogos ${loading ? 'loading' : ''}`}>
      {!loading && <Carousel items={items} />}
    </div>
  );
};

export default Jogos;
