import React, { useEffect, useState } from "react";

// Single-file React dashboard app (Tailwind classes) ready to be copied into a create-react-app / Vite project.
// Usage: save as src/App.jsx (or doacoes-dashboard.jsx) and run with Tailwind configured or adjust classes.

export default function App() {
  const [view, setView] = useState("landing");
  const [volunteer, setVolunteer] = useState(null); // logged volunteer

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {view === "landing" && <Landing onNavigate={setView} />}
      {(view === "registerUser") && <RegisterUser onBack={() => setView("landing")} />}
      {(view === "requestDonation") && <RequestDonation onBack={() => setView("landing")} />}
      {(view === "registerVolunteer") && <RegisterVolunteer onBack={() => setView("landing")} />}
      {(view === "loginVolunteer") && <VolunteerLogin onBack={() => setView("landing")} onLogin={(v) => { setVolunteer(v); setView("dashboard"); }} />}

      {view === "dashboard" && (
        <Dashboard
          volunteer={volunteer}
          onLogout={() => { setVolunteer(null); setView("landing"); }}
        />
      )}
    </div>
  );
}

function Landing({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Ajuda Rio Bonito de Iguaçu — Central de Doações</h1>
      <p className="mb-8 text-gray-700">Plataforma rápida para cadastrar pessoas, solicitar doações e organizar voluntários.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => onNavigate("registerUser")} className="bg-blue-600 text-white rounded-lg py-6 shadow hover:bg-blue-700">Cadastrar usuário</button>
        <button onClick={() => onNavigate("requestDonation")} className="bg-green-600 text-white rounded-lg py-6 shadow hover:bg-green-700">Solicitar doações</button>
        <button onClick={() => onNavigate("registerVolunteer")} className="bg-indigo-600 text-white rounded-lg py-6 shadow hover:bg-indigo-700">Cadastrar voluntário</button>
        <button onClick={() => onNavigate("loginVolunteer")} className="bg-gray-800 text-white rounded-lg py-6 shadow hover:bg-black">Entrar voluntário</button>
      </div>

      <p className="mt-10 text-sm text-gray-500">Obs: este front consome os endpoints REST no mesmo host (ex: /api/...). Ajuste as URLs no código se seu backend estiver em outro domínio.</p>
    </div>
  );
}

function RegisterUser({ onBack }) {
  const [form, setForm] = useState({ nome: "", dataNascimento: "", cpf: "", telefone: "", desabrigado: false, problemaSaude: "", detalhamentoSaude: "", localizacao: JSON.stringify({ lat: 0, lng: 0 }) });
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/usuarios/cadastrarUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setMsg({ type: "success", text: data.message || "Cadastrado" });
      else setMsg({ type: "error", text: data.error || "Erro" });
    } catch (err) {
      setMsg({ type: "error", text: String(err) });
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button className="text-sm text-blue-600 mb-4" onClick={onBack}>&larr; Voltar</button>
      <h2 className="text-2xl font-semibold mb-4">Cadastrar Usuário</h2>
      <form onSubmit={submit} className="space-y-3 bg-white p-6 rounded shadow">
        <input required placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full p-2 border rounded" />
        <input type="date" placeholder="Data Nascimento" value={form.dataNascimento} onChange={e => setForm({...form, dataNascimento: e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="CPF" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} className="w-full p-2 border rounded" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.desabrigado} onChange={e=>setForm({...form, desabrigado: e.target.checked})} /> Desabrigado</label>
        <input placeholder="Problema de Saúde" value={form.problemaSaude} onChange={e => setForm({...form, problemaSaude: e.target.value})} className="w-full p-2 border rounded" />
        <textarea placeholder="Detalhamento da saúde" value={form.detalhamentoSaude} onChange={e => setForm({...form, detalhamentoSaude: e.target.value})} className="w-full p-2 border rounded" />

        <label className="text-sm text-gray-600">Localização (JSON lat/lng). Se tiver o mapa no front, envie o JSON do leaflet.</label>
        <input value={form.localizacao} onChange={e=>setForm({...form, localizacao: e.target.value})} className="w-full p-2 border rounded" />

        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Cadastrar</button>
          <button type="button" className="px-4 py-2 rounded border" onClick={()=>setForm({ nome: "", dataNascimento: "", cpf: "", telefone: "", desabrigado: false, problemaSaude: "", detalhamentoSaude: "", localizacao: JSON.stringify({lat:0,lng:0}) })}>Limpar</button>
        </div>
        {msg && <div className={"p-2 mt-2 rounded " + (msg.type==="success"?"bg-green-100 text-green-800":"bg-red-100 text-red-800")}>{msg.text}</div>}
      </form>
    </div>
  );
}

function RequestDonation({ onBack }) {
  const [form, setForm] = useState({ cpf: "", itens: [{ produto_id: "", quantidade: 1 }] });
  const [msg, setMsg] = useState(null);

  function changeItem(idx, field, value) {
    const items = [...form.itens];
    items[idx][field] = value;
    setForm({ ...form, itens: items });
  }

  function addItem(){ setForm({...form, itens: [...form.itens, {produto_id:"", quantidade:1}]}); }
  function removeItem(i){ setForm({...form, itens: form.itens.filter((_,idx)=>idx!==i)}); }

  async function submit(e){
    e.preventDefault();
    try{
      const res = await fetch('/necessidades/cadastrarNecessidades', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ cpf: form.cpf, itens: form.itens.map(it=>({ produto_id: Number(it.produto_id), quantidade: Number(it.quantidade) })) })
      });
      const data = await res.json();
      if(res.ok) setMsg({type:'success', text: data.message||'Solicitação enviada'});
      else setMsg({type:'error', text: data.error||'Erro'});
    }catch(err){ setMsg({type:'error', text: String(err)}); }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button className="text-sm text-blue-600 mb-4" onClick={onBack}>&larr; Voltar</button>
      <h2 className="text-2xl font-semibold mb-4">Solicitar Doações (Necessidades)</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3">
        <input required placeholder="CPF do solicitante" value={form.cpf} onChange={e=>setForm({...form, cpf: e.target.value})} className="w-full p-2 border rounded" />

        <div className="space-y-2">
          {form.itens.map((it, idx)=> (
            <div key={idx} className="flex gap-2">
              <input placeholder="ID Produto" value={it.produto_id} onChange={e=>changeItem(idx,'produto_id',e.target.value)} className="p-2 border rounded w-1/2" />
              <input type="number" min={1} placeholder="Quantidade" value={it.quantidade} onChange={e=>changeItem(idx,'quantidade',e.target.value)} className="p-2 border rounded w-1/3" />
              <button type="button" onClick={()=>removeItem(idx)} className="px-2 py-1 rounded bg-red-100">Rem</button>
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-sm text-blue-600">+ Adicionar item</button>
        </div>

        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Enviar</button>
          <button type="button" className="px-4 py-2 rounded border" onClick={()=>{ setForm({ cpf:'', itens:[{produto_id:'', quantidade:1}] }); setMsg(null); }}>Limpar</button>
        </div>
        {msg && <div className={"p-2 mt-2 rounded " + (msg.type==='success'?'bg-green-100 text-green-800':'bg-red-100 text-red-800')}>{msg.text}</div>}
      </form>
    </div>
  );
}

function RegisterVolunteer({ onBack }){
  const [form, setForm] = useState({ cpf:'', nome:'', telefone:'', atuacao:'', municipioOrigem:'', senha:'' });
  const [msg, setMsg] = useState(null);

  async function submit(e){
    e.preventDefault();
    try{
      const res = await fetch('/voluntarios/cadastro', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if(res.ok) setMsg({type:'success', text: data.message||'Cadastrado'});
      else setMsg({type:'error', text: data.error||'Erro'});
    }catch(err){ setMsg({type:'error', text: String(err)}); }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button className="text-sm text-blue-600 mb-4" onClick={onBack}>&larr; Voltar</button>
      <h2 className="text-2xl font-semibold mb-4">Cadastrar Voluntário</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3">
        <input required placeholder="CPF" value={form.cpf} onChange={e=>setForm({...form, cpf: e.target.value})} className="w-full p-2 border rounded" />
        <input required placeholder="Nome" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="Telefone" value={form.telefone} onChange={e=>setForm({...form, telefone: e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="Atuação" value={form.atuacao} onChange={e=>setForm({...form, atuacao: e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="Município de Origem" value={form.municipioOrigem} onChange={e=>setForm({...form, municipioOrigem: e.target.value})} className="w-full p-2 border rounded" />
        <input type="password" required placeholder="Senha" value={form.senha} onChange={e=>setForm({...form, senha: e.target.value})} className="w-full p-2 border rounded" />

        <div className="flex gap-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" type="submit">Cadastrar</button>
          <button type="button" className="px-4 py-2 rounded border" onClick={()=>setForm({ cpf:'', nome:'', telefone:'', atuacao:'', municipioOrigem:'', senha:'' })}>Limpar</button>
        </div>
        {msg && <div className={"p-2 mt-2 rounded " + (msg.type==='success'?'bg-green-100 text-green-800':'bg-red-100 text-red-800')}>{msg.text}</div>}
      </form>
    </div>
  );
}

function VolunteerLogin({ onBack, onLogin }){
  const [form, setForm] = useState({ cpf:'', senha:'' });
  const [msg, setMsg] = useState(null);

  async function submit(e){
    e.preventDefault();
    try{
      const res = await fetch('/voluntarios/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if(res.ok){ setMsg({type:'success', text: data.message}); onLogin(data.volunteer || { cpf: form.cpf }); }
      else setMsg({type:'error', text: data.error||'Credenciais inválidas'});
    }catch(err){ setMsg({type:'error', text: String(err)}); }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <button className="text-sm text-blue-600 mb-4" onClick={onBack}>&larr; Voltar</button>
      <h2 className="text-2xl font-semibold mb-4">Entrar - Voluntário</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3">
        <input required placeholder="CPF" value={form.cpf} onChange={e=>setForm({...form, cpf: e.target.value})} className="w-full p-2 border rounded" />
        <input required type="password" placeholder="Senha" value={form.senha} onChange={e=>setForm({...form, senha: e.target.value})} className="w-full p-2 border rounded" />
        <div className="flex gap-2">
          <button className="bg-gray-800 text-white px-4 py-2 rounded" type="submit">Entrar</button>
        </div>
        {msg && <div className={"p-2 mt-2 rounded " + (msg.type==='success'?'bg-green-100 text-green-800':'bg-red-100 text-red-800')}>{msg.text}</div>}
      </form>
    </div>
  );
}

function Dashboard({ volunteer, onLogout }){
  const [menu, setMenu] = useState('inicio');

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow p-4">
        <div className="mb-6">
          <h3 className="font-bold">Painel do Voluntário</h3>
          <p className="text-sm text-gray-600">{volunteer?.nome || volunteer?.cpf || 'Voluntário'}</p>
        </div>
        <nav className="space-y-2">
          <button onClick={()=>setMenu('inicio')} className={`w-full text-left p-2 rounded ${menu==='inicio'?'bg-gray-100':''}`}>Início</button>
          <button onClick={()=>setMenu('mapa')} className={`w-full text-left p-2 rounded ${menu==='mapa'?'bg-gray-100':''}`}>Mapa</button>
          <button onClick={()=>setMenu('produtos')} className={`w-full text-left p-2 rounded ${menu==='produtos'?'bg-gray-100':''}`}>Produtos</button>
          <button onClick={()=>setMenu('pessoas')} className={`w-full text-left p-2 rounded ${menu==='pessoas'?'bg-gray-100':''}`}>Pessoas</button>
        </nav>

        <div className="mt-6">
          <button className="text-sm text-red-600" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        {menu === 'inicio' && <Inicio />}
        {menu === 'mapa' && <Mapa />}
        {menu === 'produtos' && <Produtos />}
        {menu === 'pessoas' && <Pessoas />}
      </main>
    </div>
  );
}

function Inicio(){
  const [stats, setStats] = useState({ produtos: 0, pessoas: 0, centros: 0 });

  useEffect(()=>{
    // buscar estatísticas (exemplos: contar tabelas)
    async function load(){
      try{
        const [prodRes, pessoasRes, centrosRes] = await Promise.all([
          fetch('/doacoes/produtos').then(r=>r.json()).catch(()=>({resultados:[] })),
          fetch('/usuarios/usuarios').then(r=>r.json()).catch(()=>([])),
          fetch('/centros/centros').then(r=>r.json()).catch(()=>([])),
        ]);

        const produtosCount = prodRes.total ?? (Array.isArray(prodRes) ? prodRes.length : (prodRes.resultados?.length||0));
        const pessoasCount = Array.isArray(pessoasRes)? pessoasRes.length : (pessoasRes.length||0);
        const centrosCount = Array.isArray(centrosRes)? centrosRes.length : (centrosRes.length||0);

        setStats({ produtos: produtosCount, pessoas: pessoasCount, centros: centrosCount });
      }catch(err){ console.error(err); }
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Início</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow"> <div className="text-sm text-gray-500">Produtos em estoque</div><div className="text-2xl font-bold">{stats.produtos}</div></div>
        <div className="bg-white p-4 rounded shadow"> <div className="text-sm text-gray-500">Pessoas cadastradas</div><div className="text-2xl font-bold">{stats.pessoas}</div></div>
        <div className="bg-white p-4 rounded shadow"> <div className="text-sm text-gray-500">Centros de distribuição</div><div className="text-2xl font-bold">{stats.centros}</div></div>
      </div>
    </div>
  );
}

function Mapa(){
  const [centros, setCentros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);

  useEffect(()=>{
    fetch('/centros/centros').then(r=>r.json()).then(setCentros).catch(()=>{});
    fetch('/usuarios/usuarios').then(r=>r.json()).then(setUsuarios).catch(()=>{});
    fetch('/voluntarios/all').then(r=>r.json()).then(setVoluntarios).catch(()=>{});
  },[]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Mapa</h2>
      <p className="text-sm text-gray-600">Área do mapa (integração sugerida: Leaflet). Abaixo estão os pontos carregados da API.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow col-span-2" style={{height:400}}>
          <div className="text-gray-400">Mapa placeholder — integre Leaflet ou Google Maps aqui e plote marcadores usando os arrays: centros, usuarios, voluntarios.</div>
        </div>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Centros</h3>
            <ul className="text-sm mt-2">
              {centros.map(c=> <li key={c.id}> {c.nome} ({c.latitude}, {c.longitude})</li>)}
            </ul>
          </div>

          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Usuários</h3>
            <ul className="text-sm mt-2">
              {usuarios.map(u=> <li key={u.id}>{u.nome} ({u.latitude},{u.longitude})</li>)}
            </ul>
          </div>

          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Voluntários</h3>
            <ul className="text-sm mt-2">
              {voluntarios.map(v=> <li key={v.id}>{v.nome} - {v.municipioOrigem}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-2">Dica: para mostrar o mapa com pins, instale leaflet e utilize o hook useEffect para inicializar o mapa e adicionar marcadores com os dados carregados.</div>
    </div>
  );
}

function Produtos(){
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit,setLimit] = useState(10);
  const [data, setData] = useState({ resultados: [], total:0, totalPages:0 });

  useEffect(()=>{ load(); }, [q,page,limit]);

  async function load(){
    const params = new URLSearchParams();
    if(q) params.set('q', q);
    params.set('page', page);
    params.set('limit', limit);
    try{
      const res = await fetch('/doacoes/produtos?'+params.toString());
      const json = await res.json();
      setData(json);
    }catch(err){ console.error(err); }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Produtos em estoque</h2>
      <div className="mb-4 flex gap-2">
        <input placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} className="p-2 border rounded" />
        <select value={limit} onChange={e=>{ setLimit(Number(e.target.value)); setPage(1); }} className="p-2 border rounded">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-600"><tr><th>Produto</th><th>Tipo</th><th>Perecível</th><th>Qtd</th><th>Centro</th></tr></thead>
          <tbody>
            {data.resultados?.map(r=> (
              <tr key={r.id_doacao} className="border-t"><td>{r.nome_produto || r.nomeProduto}</td><td>{r.tipo}</td><td>{String(r.perecivel)}</td><td>{r.quantidade}</td><td>{r.centro_id||'—'}</td></tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">Total: {data.total ?? 0}</div>
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 border rounded">Prev</button>
            <div className="px-3 py-1">{page} / {data.totalPages || 1}</div>
            <button disabled={page>= (data.totalPages||1)} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pessoas(){
  const [pessoas, setPessoas] = useState([]);

  useEffect(()=>{ fetch('/usuarios/usuarios').then(r=>r.json()).then(setPessoas).catch(()=>{}); },[]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Pessoas necessitadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pessoas.map(p=> (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{p.nome}</h3>
            <div className="text-sm text-gray-600">CPF: {p.cpf} — Telefone: {p.telefone}</div>
            <div className="mt-2 text-sm">Desabrigado: {p.desabrigado? 'Sim':'Não'}</div>
            <div className="mt-2 text-sm">Problema de saúde: {p.problemaSaude || '—'}</div>
            <div className="mt-2 text-sm">Localização: {p.latitude},{p.longitude}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
