import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-white max-w-4xl mx-auto py-20 px-4 text-center pt-20">
      <div className="max-w-4xl mx-auto py-12 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ajuda Rio Bonito de Iguaçu — Central de Doações
        </h1>

        <p className="mt-6 text-lg max-w-xl mx-auto text-gray-700">
          Plataforma rápida para cadastrar pessoas, solicitar doações e organizar voluntários.
        </p>

        <div className="mt-10 max-w-lg mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <button 
            onClick={() => navigate("/register-user")} 
            className="w-full py-3 px-6 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Cadastrar usuário
          </button>

          <button 
            onClick={() => navigate("/request-donation")} 
            className="w-full py-3 px-6 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Solicitar doações
          </button>

          <button 
            onClick={() => navigate("/register-volunteer")} 
            className="w-full py-3 px-6 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cadastrar voluntário
          </button>

          <button 
            onClick={() => navigate("/login")} 
            className="w-full py-3 px-6 text-lg font-semibold text-white bg-gray-800 rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors duration-200"
          >
            Entrar (Voluntário)
          </button>
        </div>
      </div>
    </div>
  );
}