import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Ajuda Rio Bonito de Iguaçu — Central de Doações</h1>
      <p className="mb-8 text-gray-700">Plataforma rápida para cadastrar pessoas, solicitar doações e organizar voluntários.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => navigate("/register-user")} className="bg-blue-600 ...">Cadastrar usuário</button>
        <button onClick={() => navigate("/request-donation")} className="bg-green-600 ...">Solicitar doações</button>
        <button onClick={() => navigate("/register-volunteer")} className="bg-indigo-600 ...">Cadastrar voluntário</button>
        <button onClick={() => navigate("/login")} className="bg-gray-800 ...">Entrar voluntário</button>
      </div>
    </div>
  );
}