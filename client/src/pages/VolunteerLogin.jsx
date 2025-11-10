import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

export default function VolunteerLogin() {
  const [form, setForm] = useState({ cpf: '', senha: '' });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Pega a função de login do context

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    try {
      const data = await apiService.loginVolunteer(form);
      setMsg({ type: 'success', text: data.message });
      login(data.volunteer || { cpf: form.cpf }); // Atualiza o estado global
      navigate('/dashboard'); // Navega para o dashboard
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Credenciais inválidas' });
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <button className="text-sm text-blue-600 mb-4" onClick={() => navigate('/')}>&larr; Voltar</button>
      <h2 className="text-2xl font-semibold mb-4">Entrar - Voluntário</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3">
        {/* ...inputs... */}
        <input required placeholder="CPF" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} className="w-full p-2 border rounded" />
        <input required type="password" placeholder="Senha" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} className="w-full p-2 border rounded" />
        <div className="flex gap-2">
          <button className="bg-gray-800 text-white px-4 py-2 rounded" type="submit">Entrar</button>
        </div>
        {msg && <div className={"p-2 mt-2 rounded " + (msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{msg.text}</div>}
      </form>
    </div>
  );
}