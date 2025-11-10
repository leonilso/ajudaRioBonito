import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService'; // Ajuste o caminho se necessário

// Estado inicial do formulário (copiado do original)
const initialState = {
  nome: '',
  cpf: '',
  telefone: '',
  latitude: '',
  longitude: '',
  desabrigado: false,
  problemaSaude: ''
};

export default function RegisterUser() {
  const [form, setForm] = useState(initialState);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    try {
      // Usa o serviço de API
      const data = await apiService.registerUser(form);
      setMsg({ type: 'success', text: data.message });
      setForm(initialState); // Limpa o formulário
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Erro no cadastro' });
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-md mx-auto py-8">
      {/* Botão "Voltar" agora usa o navigate */}
      <button className="text-sm text-blue-600 mb-4" onClick={() => navigate('/')}>
        &larr; Voltar
      </button>

      <h2 className="text-2xl font-semibold mb-4">Cadastrar Usuário Necessitado</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3">
        <input required name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} className="w-full p-2 border rounded" />
        <input required name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="latitude" placeholder="Latitude" value={form.latitude} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="longitude" placeholder="Longitude" value={form.longitude} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="problemaSaude" placeholder="Problema de saúde" value={form.problemaSaude} onChange={handleChange} className="w-full p-2 border rounded" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="desabrigado" checked={form.desabrigado} onChange={handleChange} />
          Desabrigado
        </label>
        
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Cadastrar</button>
        </div>
        
        {msg && (
          <div className={"p-2 mt-2 rounded " + (msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
            {msg.text}
          </div>
        )}
      </form>
    </div>
  );
}