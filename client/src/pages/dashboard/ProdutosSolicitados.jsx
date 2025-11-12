import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService'; // Ajuste o caminho se necessário

export default function ProdutosSolicitados() {
  // Estado para guardar os dados da API, com valores padrão
  const [data, setData] = useState({ resultados: [], total: 0, totalPages: 1, currentPage: 1 });
  // Estado para controlar a página e limite
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // Estado para mensagens de erro
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSolicitacoes() {
      // Prepara os parâmetros de paginação
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', limit);
      
      try {
        setError(null); // Limpa erros anteriores
        // Chama a função (que vamos adicionar ao apiService)
        const json = await apiService.getProdutosSolicitados(params);
        setData(json);
      } catch (err) {
        console.error("Erro ao buscar solicitações:", err);
        setError(err.message || "Não foi possível carregar os dados.");
      }
    }
    
    loadSolicitacoes();
  }, [page, limit]); // Re-executa a busca quando 'page' ou 'limit' mudam

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Produtos Solicitados</h2>
      
      {/* Seletor de limite de itens por página */}
      <div className="mb-4">
        <label htmlFor="limit-select" className="mr-2 text-gray-700">Itens por página:</label>
        <select 
          id="limit-select"
          value={limit} 
          onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} 
          className="p-2 border rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Exibe mensagem de erro se houver */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabela de resultados */}
      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-600">
            <tr>
              <th className="py-2">Produto</th>
              <th className="py-2">Quantidade</th>
              <th className="py-2">Solicitado por</th>
            </tr>
          </thead>
          <tbody>
            {data.resultados?.map(item => (
              // Use uma chave única para o item da lista
              <tr key={`${item.usuario_id}-${item.id_produto}`} className="border-t">
                <td className="py-2">{item.nomeProduto}</td>
                <td className="py-2">{item.quantidade}</td>
                <td className="py-2">{item.nome_usuario} (ID: {item.usuario_id})</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Controles de Paginação */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Total de itens: {data.total ?? 0}
          </div>
          <div className="flex gap-2">
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <div className="px-3 py-1">
              Página {data.currentPage || 1} de {data.totalPages || 1}
            </div>
            <button 
              disabled={page >= (data.totalPages || 1)} 
              onClick={() => setPage(p => p + 1)} 
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}