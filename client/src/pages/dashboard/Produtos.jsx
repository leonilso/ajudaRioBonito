import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";

export default function Produtos() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState({ resultados: [], total: 0, totalPages: 0 });
  const [centros, setCentros] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    centroId: "",
    nomeProduto: "",
    descricao: "",
    tipo: "",
    quantidade: "",
    perecivel: false,
  });

  useEffect(() => {
    async function loadProducts() {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("page", page);
      params.set("limit", limit);

      try {
        const json = await apiService.getProducts(params);
        setData(json);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    }
    loadProducts();
  }, [q, page, limit]);

  // Buscar centros de distribuição
  useEffect(() => {
    async function loadCentros() {
      try {
        const json = await apiService.getCentrosDistribuicao();
        setCentros(json);
      } catch (err) {
        console.error("Erro ao carregar centros:", err);
      }
    }
    loadCentros();
  }, []);

  async function salvarProduto() {
    if (!novoProduto.nomeProduto || !novoProduto.centroId)
      return alert("Informe o nome do produto e selecione um centro");

    try {
      await apiService.createProduct(novoProduto);
      setShowModal(false);
      setNovoProduto({
        centroId: "",
        nomeProduto: "",
        descricao: "",
        tipo: "",
        quantidade: "",
        perecivel: false,
      });
      async function loadProducts() {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        params.set("page", page);
        params.set("limit", limit);

        try {
          const json = await apiService.getProducts(params);
          setData(json);
        } catch (err) {
          console.error("Erro ao buscar produtos:", err);
        }
      }
      loadProducts();
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      alert("Erro ao cadastrar produto");
    }
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold mb-4">Produtos em estoque</h2>

      <div className="mb-4 flex gap-2">
        <input
          placeholder="Buscar"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="p-2 border rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-600">
            <tr>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Perecível</th>
              <th>Qtd</th>
              <th>Centro</th>
            </tr>
          </thead>
          <tbody>
            {data.resultados?.map((r) => (
              <tr key={r.id_doacao || r.id_produto} className="border-t">
                <td>{r.nome_produto || r.nomeProduto}</td>
                <td>{r.tipo}</td>
                <td>{String(r.perecivel)}</td>
                <td>{r.quantidade}</td>
                <td>{r.nome_centro || r.centroNome || r.centro_id || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">Total: {data.total ?? 0}</div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>
            <div className="px-3 py-1">{page} / {data.totalPages || 1}</div>
            <button
              disabled={page >= (data.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Botão flutuante */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 text-lg"
      >
        +
      </button>

      {/* Modal de cadastro */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Novo Produto</h3>

            <select
              value={parseInt(novoProduto.centroId)}
              onChange={(e) =>
                setNovoProduto({ ...novoProduto, centroId: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            >
              <option value="">Selecione o centro</option>
              {centros.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <input
              placeholder="Nome do produto"
              value={novoProduto.nomeProduto}
              onChange={(e) =>
                setNovoProduto({ ...novoProduto, nomeProduto: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <input
              placeholder="Descrição"
              value={novoProduto.descricao}
              onChange={(e) =>
                setNovoProduto({ ...novoProduto, descricao: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <input
              placeholder="Tipo"
              value={novoProduto.tipo}
              onChange={(e) =>
                setNovoProduto({ ...novoProduto, tipo: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={novoProduto.quantidade}
              onChange={(e) =>
                setNovoProduto({
                  ...novoProduto,
                  quantidade: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={novoProduto.perecivel}
                onChange={(e) =>
                  setNovoProduto({
                    ...novoProduto,
                    perecivel: e.target.checked,
                  })
                }
              />
              Perecível
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={salvarProduto}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
