// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesafioSistemaSolar from '../features/jogos/sistemaSolar/desafio/DesafioSistemaSolar';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rota para o jogo do sistema solar */}
        <Route path="/jogo/sistemaSolar/desafio" element={<DesafioSistemaSolar />} />

        {/* Outras rotas, se houver */}
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </Router>
  );
};

export default App;
