import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

const initialState = {
  nome: '',
  cpf: '',
  atuacao: '',
  telefone: '',
  municipioOrigem: '',
  senha: '',
  confirmarSenha: ''
};

export default function RegisterVolunteer() {
  const [form, setForm] = useState(initialState);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    if (form.senha !== form.confirmarSenha) {
      setMsg({ type: 'error', text: 'As senhas não conferem' });
      return;
    }

    try {
      const data = await apiService.registerVolunteer(form);
      setMsg({ type: 'success', text: data.message });
      setForm(initialState);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Erro no cadastro' });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <button
        className="text-sm text-blue-600 mb-6 hover:underline"
        onClick={() => navigate('/')}
      >
        &larr; Voltar
      </button>

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Cadastrar Voluntário
      </h2>

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-2xl shadow-lg space-y-4 border border-gray-200"
      >
        {[
          { name: 'nome', placeholder: 'Nome', required: true },
          { name: 'telefone', placeholder: 'Telefone' },
          { name: 'atuacao', placeholder: 'Área de Atuação' },
          { name: 'municipioOrigem', placeholder: 'Município de Origem' },
          { name: 'cpf', placeholder: 'CPF', required: true },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          />
        ))}

        <input
          required
          name="senha"
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
        />
        <input
          required
          name="confirmarSenha"
          type="password"
          placeholder="Confirmar Senha"
          value={form.confirmarSenha}
          onChange={handleChange}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
        />

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Cadastrar
        </button>

        {msg && (
          <div
            className={`p-3 mt-2 text-center font-medium rounded-lg ${
              msg.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {msg.text}
          </div>
        )}
      </form>
    </div>
  );
}
