// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesafioSistemaSolar from '../features/jogos/sistemaSolar/desafio/DesafioSistemaSolar';
import Home from '../pages/home/Home';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogo/sistemaSolar/desafio" element={<DesafioSistemaSolar />} />
      </Routes>
    </Router>
  );
};

export default App;
