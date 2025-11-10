import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

export default function Mapa() {
  const [centros, setCentros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);

  useEffect(() => {
    async function loadMapData() {
      try {
        // Busca todos os dados do mapa em paralelo
        const data = await apiService.getMapData();
        setCentros(data.centros || []);
        setUsuarios(data.usuarios || []);
        setVoluntarios(data.voluntarios || []);
      } catch (err) {
        console.error("Erro ao carregar dados do mapa:", err);
      }
    }
    loadMapData();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Mapa</h2>
      <p className="text-sm text-gray-600">Área do mapa (integração sugerida: Leaflet). Abaixo estão os pontos carregados da API.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow col-span-2" style={{ height: 400 }}>
          <div className="text-gray-400">Mapa placeholder — integre Leaflet ou Google Maps aqui e plote marcadores usando os arrays: centros, usuarios, voluntarios.</div>
        </div>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Centros</h3>
            <ul className="text-sm mt-2">
              {centros.map(c => <li key={c.id}> {c.nome} ({c.latitude}, {c.longitude})</li>)}
            </ul>
          </div>

          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Usuários</h3>
            <ul className="text-sm mt-2">
              {usuarios.map(u => <li key={u.id}>{u.nome} ({u.latitude},{u.longitude})</li>)}
            </ul>
          </div>

          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Voluntários</h3>
            <ul className="text-sm mt-2">
              {voluntarios.map(v => <li key={v.id}>{v.nome} - {v.municipioOrigem}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-2">Dica: para mostrar o mapa com pins, instale leaflet e utilize o hook useEffect para inicializar o mapa e adicionar marcadores com os dados carregados.</div>
    </div>
  );
}