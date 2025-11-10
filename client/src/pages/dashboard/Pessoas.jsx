import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

export default function Pessoas() {
  const [pessoas, setPessoas] = useState([]);

  useEffect(() => {
    async function loadPessoas() {
      try {
        const data = await apiService.getPessoas();
        setPessoas(data || []);
      } catch (err) {
        console.error("Erro ao buscar pessoas:", err);
      }
    }
    loadPessoas();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Pessoas necessitadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pessoas.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{p.nome}</h3>
            <div className="text-sm text-gray-600">CPF: {p.cpf} — Telefone: {p.telefone}</div>
            <div className="mt-2 text-sm">Desabrigado: {p.desabrigado ? 'Sim' : 'Não'}</div>
            <div className="mt-2 text-sm">Problema de saúde: {p.problemaSaude || '—'}</div>
            <div className="mt-2 text-sm">Localização: {p.latitude},{p.longitude}</div>
          </div>
        ))}
      </div>
    </div>
  );
}