import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { ArrowLeft, PlusCircle, XCircle, CheckCircle2 } from "lucide-react";

const initialItem = { quantidade: "", produto_id: "" };
const initialState = { cpf: "", itens: [initialItem] };

export default function RequestDonation() {
  const [form, setForm] = useState(initialState);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  function handleItemChange(index, e) {
    const { name, value } = e.target;
    const newItens = [...form.itens];
    newItens[index][name] = value;
    setForm((prev) => ({ ...prev, itens: newItens }));
  }

  function addItem() {
    setForm((prev) => ({ ...prev, itens: [...prev.itens, { ...initialItem }] }));
  }

  function removeItem(index) {
    const newItens = form.itens.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, itens: newItens }));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    try {
      const data = await apiService.requestDonation(form);
      setMsg({ type: "success", text: data.message || "Solicitação enviada com sucesso!" });
      setForm(initialState);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Erro ao registrar solicitação." });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 relative border border-gray-200">
        <button
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-6 transition-colors"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
          Solicitar Doações
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            name="cpf"
            placeholder="CPF do Usuário"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />

          <h3 className="font-semibold text-gray-800 pt-2">Itens Solicitados</h3>

          <div className="space-y-3">
            {form.itens.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-2 border border-gray-200 p-3 rounded-lg bg-gray-50"
              >
                <input
                  required
                  name="produto_id"
                  placeholder="Produto necessário"
                  value={item.produto_id}
                  onChange={(e) => handleItemChange(index, e)}
                  className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <div className="flex items-center gap-2">
                  <input
                    required
                    name="quantidade"
                    type="number"
                    placeholder="Qtd"
                    value={item.quantidade}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-24 p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  {form.itens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
          >
            <PlusCircle size={16} /> Adicionar item
          </button>

          <button
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all"
            type="submit"
          >
            Solicitar
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
    </div>
  );
}
