import React from 'react';
import LoginPage from './pages/Login'
import Home from './pages/Home';
import CheckInAccountFormPage from './pages/CheckInAccountForm';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
type TokenContextType = {
  tokenContext: string | null;
  setTokenContext: React.Dispatch<React.SetStateAction<string | null>>;
};

export const TokenContext = React.createContext<TokenContextType | null>(null);

const App: React.FC = () => {
  const [tokenContext, setTokenContext] = React.useState(
    localStorage.getItem("login_token")
  );

  return (
    <TokenContext.Provider value={{ tokenContext, setTokenContext }}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={!tokenContext?<Home />:<Navigate to="/" replace />} />
          <Route path="/check-in-account" element={!tokenContext?<CheckInAccountFormPage />:<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </TokenContext.Provider>
  );
}

export default App;
