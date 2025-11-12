import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import LocationPickerModal from "../../components/LocationPickerModal";

export default function CentrosDistribuicao() {
  const [centros, setCentros] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [novoCentro, setNovoCentro] = useState({ nome: "", lat: "", lng: "" });

  async function carregarCentros() {
    try {
      const json = await apiService.getCentrosDistribuicao(); // deve retornar lista de centros
      setCentros(json || []);
    } catch (err) {
      console.error("Erro ao buscar centros:", err);
    }
  }

  useEffect(() => {
    carregarCentros();
  }, []);

  async function salvarCentro() {
    if (!novoCentro.nome || !novoCentro.lat) return alert("Informe nome e localização");
    try {
      await apiService.createCentroDistribuicao(novoCentro);
      setShowModal(false);
      setNovoCentro({ nome: "", lat: "", lng: "" });
      carregarCentros();
    } catch (err) {
      console.error("Erro ao cadastrar centro:", err);
      alert("Erro ao cadastrar centro");
    }
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold mb-4">Centros de Distribuição</h2>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-600">
            <tr>
              <th>Nome</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {centros.length > 0 ? (
              centros.map((c) => (
                <tr key={c.id_centro} className="border-t">
                  <td>{c.nome}</td>
                  <td>{c.lat?.toFixed?.(4) || c.lat}</td>
                  <td>{c.lng?.toFixed?.(4) || c.lng}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  Nenhum centro cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Botão flutuante */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 text-lg"
      >
        +
      </button>

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Novo Centro</h3>
            <input
              type="text"
              placeholder="Nome do centro"
              value={novoCentro.nome}
              onChange={(e) => setNovoCentro({ ...novoCentro, nome: e.target.value })}
              className="w-full p-2 border rounded mb-3"
            />

            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
              >
                Selecionar Localização
              </button>
              {novoCentro.lat && (
                <span className="text-sm text-gray-600">
                  📍 {novoCentro.lat.toFixed(4)}, {novoCentro.lng.toFixed(4)}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancelar
              </button>
              <button onClick={salvarCentro} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Mapa Reutilizável */}
      <LocationPickerModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        onSelect={(pos) =>
          setNovoCentro((prev) => ({ ...prev, lat: pos.lat, lng: pos.lng }))
        }
      />
    </div>
  );
}
