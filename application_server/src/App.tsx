import React from 'react';
import LoginPage from './pages/Login'
import Home from './pages/Home';
import CheckInAccountFormPage from './pages/CheckInAccountForm';
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
          <Route path="/check-in-account" element={<CheckInAccountFormPage />} />
        </Routes>
      </Router>
  );
}

export default App;
