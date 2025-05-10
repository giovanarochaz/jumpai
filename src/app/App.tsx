// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesafioSistemaSolar from '../features/jogos/sistemaSolar/desafio/DesafioSistemaSolar';
import Home from '../pages/home/Home';
import Jogos from '../pages/jogos/Jogo';
import EscolherDificuldade from '../pages/dificuldade/EscolherDificuldade';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/opcoes-jogos/:tipoControle" element={<Jogos />} />
        <Route path="/jogo/sistemaSolar/desafio/:tipoControle" element={<DesafioSistemaSolar />} />
        <Route path="/jogo/sistemaSolar/dificuldade/:tipoControle" element={<EscolherDificuldade />} />
      </Routes>
    </Router>
  );
};

export default App;
