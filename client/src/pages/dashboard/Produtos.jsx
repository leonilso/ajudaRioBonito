import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

export default function Produtos() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState({ resultados: [], total: 0, totalPages: 0 });

  // O 'useEffect' agora depende dos estados de filtro/paginação
  useEffect(() => {
    async function loadProducts() {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      params.set('page', page);
      params.set('limit', limit);

      try {
        const json = await apiService.getProducts(params);
        setData(json);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    }
    loadProducts();
  }, [q, page, limit]); // Re-executa quando 'q', 'page' ou 'limit' mudam

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Produtos em estoque</h2>
      <div className="mb-4 flex gap-2">
        <input placeholder="Buscar" value={q} onChange={e => setQ(e.target.value)} className="p-2 border rounded" />
        <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} className="p-2 border rounded">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-600"><tr><th>Produto</th><th>Tipo</th><th>Perecível</th><th>Qtd</th><th>Centro</th></tr></thead>
          <tbody>
            {data.resultados?.map(r => (
              <tr key={r.id_doacao} className="border-t">
                <td>{r.nome_produto || r.nomeProduto}</td>
                <td>{r.tipo}</td>
                <td>{String(r.perecivel)}</td>
                <td>{r.quantidade}</td>
                <td>{r.centro_id || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">Total: {data.total ?? 0}</div>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
            <div className="px-3 py-1">{page} / {data.totalPages || 1}</div>
            <button disabled={page >= (data.totalPages || 1)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}