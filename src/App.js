import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { LoginForm } from './components/LoginForm';
import { AutomotoresForm } from './components/AutomotoresForm';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/Formulario" element={<AutomotoresForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;