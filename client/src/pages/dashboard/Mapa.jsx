import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

// 1. Importações necessárias do react-leaflet e o CSS do leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// (Opcional) Corrige um problema comum com ícones do Marker no Webpack
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


export default function Mapa() {
  const [centros, setCentros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  // Posição central do mapa (Ex: centro do Brasil) e zoom
  const mapPosition = [-14.235, -51.925];
  const mapZoom = 4;

  useEffect(() => {
    async function loadMapData() {
      try {
        const data = await apiService.getMapData();
        setCentros(data.centros || []);
        setUsuarios(data.usuarios || []);
      } catch (err) {
        console.error("Erro ao carregar dados do mapa:", err);
      }
    }
    loadMapData();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Mapa</h2>
      <p className="text-sm text-gray-600">Mapa interativo com dados da API.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        
        {/* 2. Substituição do Placeholder pelo Mapa */}
        <div className="bg-white p-4 rounded shadow col-span-2" style={{ height: 400 }}>
          <MapContainer 
            center={mapPosition} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%' }}
          >
            {/* Camada do mapa base (gratuito do OpenStreetMap) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 3. Marcadores para Centros */}
            {centros
              .filter(c => c.latitude && c.longitude) // Garante que temos coords
              .map(c => (
                <Marker key={`centro-${c.id}`} position={[c.latitude, c.longitude]}>
                  <Popup>
                    <b>Centro:</b> {c.nome}
                  </Popup>
                </Marker>
            ))}

            {/* 4. Marcadores para Usuários */}
            {usuarios
              .filter(u => u.latitude && u.longitude)
              .map(u => (
                <Marker key={`usuario-${u.id}`} position={[u.latitude, u.longitude]}>
                  <Popup>
                    <b>Usuário:</b> {u.nome}
                  </Popup>
                </Marker>
            ))}
            

          </MapContainer>
        </div>

        {/* O restante do seu layout (listas) permanece o mesmo */}
        <div className="space-y-3">
          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Centros ({centros.length})</h3>
            <ul className="text-sm mt-2 max-h-24 overflow-y-auto">
              {centros.map(c => <li key={c.id}> {c.nome} ({c.latitude}, {c.longitude})</li>)}
            </ul>
          </div>

          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Usuários ({usuarios.length})</h3>
            <ul className="text-sm mt-2 max-h-24 overflow-y-auto">
              {usuarios.map(u => <li key={u.id}>{u.nome} ({u.latitude},{u.longitude})</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}