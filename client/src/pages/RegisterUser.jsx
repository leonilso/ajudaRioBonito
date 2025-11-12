import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationPickerModal from "../components/LocationPickerModal";
import { apiService } from "../services/apiService";

const initialState = {
  nome: "",
  cpf: "",
  telefone: "",
  desabrigado: false,
  problemaSaude: "",
  detalhamentoSaude: "",
  lat: "",
  lng: "",
};

export default function RegisterUser() {
  const [form, setForm] = useState(initialState);
  const [msg, setMsg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectLocation = (pos) => {
    setForm((prev) => ({
      ...prev,
      lat: pos.lat,
      lng: pos.lng,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiService.registerUser(form);
      setMsg({ type: "success", text: data.message });
      setForm(initialState);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Erro no cadastro" });
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <button
        className="text-sm text-blue-600 mb-4"
        onClick={() => navigate("/")}
      >
        &larr; Voltar
      </button>

      <h2 className="text-2xl font-semibold mb-4">Cadastrar Usuário Necessitado</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3">
        <input required name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} className="w-full p-2 border rounded" />
        <input required name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="problemaSaude" placeholder="Problema de saúde" value={form.problemaSaude} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="detalhamentoSaude" placeholder="Detalhe seu problema" value={form.detalhamentoSaude} onChange={handleChange} className="w-full p-2 border rounded" />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="desabrigado" checked={form.desabrigado} onChange={handleChange} />
          Desabrigado
        </label>

        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setShowModal(true)} className="bg-gray-100 border px-3 py-2 rounded hover:bg-gray-200">
            Adicionar Localização
          </button>
          {form.lat && (
            <span className="text-sm text-gray-600">
              📍 {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
            </span>
          )}
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Cadastrar
        </button>

        {msg && (
          <div className={`p-2 mt-2 rounded ${msg.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {msg.text}
          </div>
        )}
      </form>

      <LocationPickerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleSelectLocation}
      />
    </div>
  );
}
