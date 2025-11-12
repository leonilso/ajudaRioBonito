import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, UserPlus, LogIn } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Cadastrar Usuário",
      color: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      icon: <UserPlus className="w-5 h-5" />,
      route: "/register-user",
    },
    {
      label: "Solicitar Doações",
      color: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      icon: <Heart className="w-5 h-5" />,
      route: "/request-donation",
    },
    {
      label: "Cadastrar Voluntário",
      color: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
      icon: <Users className="w-5 h-5" />,
      route: "/register-volunteer",
    },
    {
      label: "Entrar (Voluntário)",
      color: "bg-gray-800 hover:bg-gray-900 focus:ring-gray-700",
      icon: <LogIn className="w-5 h-5" />,
      route: "/login",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white px-6 py-12">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Ajuda Rio Bonito de Iguaçu
        </h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-6">
          Central de Doações e Voluntariado
        </h2>

        <p className="text-gray-700 text-lg max-w-xl mx-auto mb-10">
          Conectamos pessoas, doações e voluntários para fortalecer nossa
          comunidade. Cadastre-se, contribua ou solicite ajuda com rapidez e
          segurança.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {actions.map(({ label, color, icon, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className={`flex items-center justify-center gap-2 py-3 px-6 text-lg font-medium text-white rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${color}`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
