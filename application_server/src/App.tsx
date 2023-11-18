import React from 'react';
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import Home from './pages/Home';
import Admin from './pages/Admin';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

type TokenContextType = {
  tokenContext: string | null;
  setTokenContext: React.Dispatch<React.SetStateAction<string | null>>;
};

export const TokenContext = React.createContext<TokenContextType | null>(null);

const App: React.FC = () => {
  const [tokenContext, setTokenContext] = React.useState(
    localStorage.getItem("jwtToken")
  );
  const role = localStorage.getItem("role")
  
  const providerValue = React.useMemo(() => ({
    tokenContext,
    setTokenContext
  }), [tokenContext]);

  return (
    <TokenContext.Provider value={providerValue}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute role={role}>
                <Admin />
              </AdminRoute>
            } 
          />
        </Routes>
      </Router>
    </TokenContext.Provider>
  );
}

export default App;
