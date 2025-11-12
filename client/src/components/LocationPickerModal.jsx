import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige ícone do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function LocationPickerModal({ isOpen, onClose, onSelect }) {
  const [position, setPosition] = useState(null);

  // Pega localização atual
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("Erro ao obter localização:", err)
      );
    }
  }, [isOpen]);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return position ? <Marker position={position} /> : null;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-4 w-[90%] max-w-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Selecione a Localização</h2>
        <div className="h-80 w-full mb-4">
          {position ? (
            <MapContainer
              center={position}
              zoom={15}
              className="h-full w-full rounded"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />
              <MapClickHandler />
            </MapContainer>
          ) : (
            <p className="text-center text-gray-500">
              Carregando mapa...
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (position) onSelect(position);
              onClose();
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
