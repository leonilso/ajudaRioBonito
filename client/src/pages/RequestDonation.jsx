import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService'; // Ajuste o caminho se necessário

const initialItem = { quantidade: '', produto_id: '' };
const initialState = { cpf: '', itens: [initialItem] };

export default function RequestDonation() {
  const [form, setForm] = useState(initialState);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  // Funções de helper para o formulário dinâmico
  function handleItemChange(index, e) {
    const { name, value } = e.target;
    const newItens = [...form.itens];
    newItens[index][name] = value;
    setForm(prev => ({ ...prev, itens: newItens }));
  }

  function addItem() {
    setForm(prev => ({ ...prev, itens: [...prev.itens, { ...initialItem }] }));
  }

  function removeItem(index) {
    const newItens = form.itens.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, itens: newItens }));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    try {
      // O apiService já sabe como formatar os dados
      console.log(form)
      const data = await apiService.requestDonation(form);
      setMsg({ type: 'success', text: data.message });
      setForm(initialState); // Limpa o formulário
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Erro ao registrar solicitação' });
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <button className="text-sm text-blue-600 mb-4" onClick={() => navigate('/')}>
        &larr; Voltar
      </button>

      <h2 className="text-2xl font-semibold mb-4">Solicitar Doações</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3">
        <input required name="cpf" placeholder="CPF do Usuário" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} className="w-full p-2 border rounded" />
        
        <h3 className="font-semibold pt-2">Itens</h3>
        {form.itens.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input required name="produto_id" placeholder="Produto necessário" value={item.produto_id} onChange={e => handleItemChange(index, e)} className="w-full p-2 border rounded" />
            <input required name="quantidade" type="number" placeholder="Qtd" value={item.quantidade} onChange={e => handleItemChange(index, e)} className="w-24 p-2 border rounded" />
            {form.itens.length > 1 && (
              <button type="button" onClick={() => removeItem(index)} className="text-red-500 p-1">&times;</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-sm text-blue-600">+ Adicionar item</button>

        <div className="flex gap-2 pt-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Solicitar</button>
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