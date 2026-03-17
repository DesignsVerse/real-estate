import { useState, useEffect } from 'react';

// Simple simulated auth for the broker dashboard
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('broker_auth') === 'true';
  });

  const login = (pin: string) => {
    // Simulated PIN check (in reality, would hit an API)
    if (pin === '1234') {
      localStorage.setItem('broker_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('broker_auth');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
