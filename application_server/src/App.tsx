import React from 'react';
import LoginPage from './pages/Login'
import Home from './pages/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;
