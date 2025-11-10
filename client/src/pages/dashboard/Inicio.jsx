import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService'; // Ajuste o caminho se necessário

export default function Inicio() {
  const [stats, setStats] = useState({ produtos: 0, pessoas: 0, centros: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        // Usa o serviço de API centralizado
        const { prodRes, pessoasRes, centrosRes } = await apiService.getStats();

        // A lógica de contagem permanece a mesma
        const produtosCount = prodRes.total ?? (Array.isArray(prodRes) ? prodRes.length : (prodRes.resultados?.length || 0));
        const pessoasCount = Array.isArray(pessoasRes) ? pessoasRes.length : (pessoasRes.length || 0);
        const centrosCount = Array.isArray(centrosRes) ? centrosRes.length : (centrosRes.length || 0);

        setStats({ produtos: produtosCount, pessoas: pessoasCount, centros: centrosCount });
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
        // Opcional: mostrar um estado de erro para o usuário
      }
    }
    loadStats();
  }, []); // Roda apenas uma vez na montagem

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Início</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Produtos em estoque</div>
          <div className="text-2xl font-bold">{stats.produtos}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Pessoas cadastradas</div>
          <div className="text-2xl font-bold">{stats.pessoas}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Centros de distribuição</div>
          <div className="text-2xl font-bold">{stats.centros}</div>
        </div>
      </div>
    </div>
  );
}