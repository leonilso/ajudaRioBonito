import React from 'react';
import { Outlet, NavLink } from 'react-router-dom'; // Outlet é onde as rotas filhas aparecem
import { useAuth } from '../../context/AuthContext';

// Estilo para o link ativo (com NavLink)
const activeClassName = "bg-gray-100";
const linkClasses = "w-full text-left p-2 rounded";

export default function DashboardLayout() {
  const { volunteer, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow p-4">
        <div className="mb-6">
          <h3 className="font-bold">Painel do Voluntário</h3>
          <p className="text-sm text-gray-600">{volunteer?.nome || volunteer?.cpf || 'Voluntário'}</p>
        </div>
        <nav className="space-y-2">
          {/* NavLink sabe qual rota está ativa e aplica a classe */}
          <NavLink to="/dashboard" end className={({isActive}) => `${linkClasses} ${isActive ? activeClassName : ''}`}>Início</NavLink>
          <NavLink to="/dashboard/mapa" className={({isActive}) => `${linkClasses} ${isActive ? activeClassName : ''}`}>Mapa</NavLink>
          <NavLink to="/dashboard/produtos" className={({isActive}) => `${linkClasses} ${isActive ? activeClassName : ''}`}>Produtos</NavLink>
          <NavLink to="/dashboard/pessoas" className={({isActive}) => `${linkClasses} ${isActive ? activeClassName : ''}`}>Pessoas</NavLink>
        </nav>

        <div className="mt-6">
          <button className="text-sm text-red-600" onClick={logout}>Sair</button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        {/* As páginas (Inicio, Mapa, etc.) serão renderizadas aqui! */}
        <Outlet />
      </main>
    </div>
  );
}