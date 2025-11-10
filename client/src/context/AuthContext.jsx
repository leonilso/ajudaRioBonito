import React, { createContext, useState, useContext } from 'react';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// 2. Criar o Provedor (que vai gerenciar o estado)
export function AuthProvider({ children }) {
  const [volunteer, setVolunteer] = useState(null);

  // A lógica de login agora vive aqui
  const login = (volunteerData) => {
    setVolunteer(volunteerData);
    // Você pode salvar no localStorage aqui se quiser persistência
  };

  const logout = () => {
    setVolunteer(null);
    // Limpar do localStorage
  };

  return (
    <AuthContext.Provider value={{ volunteer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Criar um Hook customizado para facilitar o uso
export const useAuth = () => {
  return useContext(AuthContext);
};