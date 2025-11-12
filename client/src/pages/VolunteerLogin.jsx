import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

export default function VolunteerLogin() {
  const [form, setForm] = useState({ cpf: '', senha: '' });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    try {
      const data = await apiService.loginVolunteer(form);
      setMsg({ type: 'success', text: data.message });
      login(data.volunteer || { cpf: form.cpf });
      navigate('/dashboard');
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Credenciais inválidas' });
    }
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <button
        className="text-sm text-blue-600 mb-6 hover:underline"
        onClick={() => navigate('/')}
      >
        &larr; Voltar
      </button>

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Entrar - Voluntário
      </h2>

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-2xl shadow-lg space-y-4 border border-gray-200"
      >
        <input
          required
          placeholder="CPF"
          value={form.cpf}
          onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 focus:ring-2 focus:ring-gray-300 outline-none transition"
        />
        <input
          required
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 focus:ring-2 focus:ring-gray-300 outline-none transition"
        />

        <button
          type="submit"
          className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition-colors duration-200"
        >
          Entrar
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
