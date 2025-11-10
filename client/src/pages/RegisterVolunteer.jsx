import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService'; // Ajuste o caminho se necessário

const initialState = {
  nome: '',
  cpf: '',
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
      setForm(initialState); // Limpa o formulário
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Erro no cadastro' });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <button className="text-sm text-blue-600 mb-4" onClick={() => navigate('/')}>
        &larr; Voltar
      </button>

      <h2 className="text-2xl font-semibold mb-4">Cadastrar Voluntário</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3">
        <input required name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} className="w-full p-2 border rounded" />
        <input required name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="municipioOrigem" placeholder="Município de Origem" value={form.municipioOrigem} onChange={handleChange} className="w-full p-2 border rounded" />
        <input required name="senha" type="password" placeholder="Senha" value={form.senha} onChange={handleChange} className="w-full p-2 border rounded" />
        <input required name="confirmarSenha" type="password" placeholder="Confirmar Senha" value={form.confirmarSenha} onChange={handleChange} className="w-full p-2 border rounded" />

        <div className="flex gap-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" type="submit">Cadastrar</button>
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