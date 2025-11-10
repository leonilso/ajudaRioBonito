import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Importar as páginas
import Landing from "./pages/Landing";
import RegisterUser from "./pages/RegisterUser";
import RequestDonation from "./pages/RequestDonation";
import RegisterVolunteer from "./pages/RegisterVolunteer";
import VolunteerLogin from ".pages/VolunteerLogin";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Inicio from "./pages/dashboard/Inicio";
import Mapa from "./pages/dashboard/Mapa";
import Produtos from "./pages/dashboard/Produtos";
import Pessoas from "./pages/dashboard/Pessoas";

// Componente para proteger rotas
function ProtectedRoute({ children }) {
  const { volunteer } = useAuth();
  if (!volunteer) {
    // Se não estiver logado, redireciona para o login
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/request-donation" element={<RequestDonation />} />
        <Route path="/register-volunteer" element={<RegisterVolunteer />} />
        <Route path="/login" element={<VolunteerLogin />} />

        {/* Rotas Protegidas (Dashboard) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Essas rotas serão renderizadas DENTRO do DashboardLayout */}
          <Route index element={<Inicio />} /> {/* 'index' é a rota padrão /dashboard */}
          <Route path="mapa" element={<Mapa />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="pessoas" element={<Pessoas />} />
        </Route>

        {/* Rota para qualquer outra coisa */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

// O App raiz agora só envolve os Provedores e o Roteador
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}