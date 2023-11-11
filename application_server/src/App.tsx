import React from 'react';
import LoginPage from './pages/Login'
import Home from './pages/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

type TokenContextType = {
  tokenContext: string | null;
  setTokenContext: React.Dispatch<React.SetStateAction<string | null>>;
};

export const TokenContext = React.createContext<TokenContextType | null>(null);

const App: React.FC = () => {
  const [tokenContext, setTokenContext] = React.useState(
    localStorage.getItem("jwtToken")
  );
  const providerValue = React.useMemo(() => ({
    tokenContext,
    setTokenContext
  }), [tokenContext]);

  return (
    <TokenContext.Provider value={providerValue}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </TokenContext.Provider>
  );
}

export default App;
