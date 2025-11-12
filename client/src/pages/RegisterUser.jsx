import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationPickerModal from "../components/LocationPickerModal";
import { apiService } from "../services/apiService";
import { MapPin, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

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
      setMsg({ type: "success", text: data.message || "Usuário cadastrado com sucesso!" });
      setForm(initialState);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Erro ao cadastrar usuário." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 relative border border-gray-200">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
          Cadastrar Usuário Necessitado
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            name="nome"
            placeholder="Nome completo"
            value={form.nome}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />

          <input
            required
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />

          <input
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />

          <input
            name="problemaSaude"
            placeholder="Problema de saúde"
            value={form.problemaSaude}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />

          <textarea
            name="detalhamentoSaude"
            placeholder="Detalhamento do problema"
            value={form.detalhamentoSaude}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none h-24 resize-none"
          />

          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              name="desabrigado"
              checked={form.desabrigado}
              onChange={handleChange}
              className="accent-blue-600 w-4 h-4"
            />
            Desabrigado
          </label>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-md hover:bg-blue-200 transition"
            >
              <MapPin size={18} /> Adicionar Localização
            </button>
            {form.lat && (
              <span className="text-sm text-gray-600">
                📍 {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            Cadastrar
          </button>

          {msg && (
            <div
              className={`flex items-center gap-2 p-3 mt-3 rounded-lg text-sm font-medium ${
                msg.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {msg.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <XCircle size={18} />
              )}
              {msg.text}
            </div>
          )}
        </form>
      </div>

      <LocationPickerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleSelectLocation}
      />
    </div>
  );
}
