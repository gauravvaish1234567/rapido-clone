import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function getStoredSession() {
  const token = localStorage.getItem('token');
  const rawUser = localStorage.getItem('user');

  if (!token || !rawUser) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { token: null, user: null };
  }

  return { token, user: JSON.parse(rawUser) };
}

export function AuthProvider({ children }) {
  const initial = getStoredSession();
  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);

  const login = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(user && token), login, logout }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
