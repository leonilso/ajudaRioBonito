const BASE_URL = "/"; // Ou seu prefixo de API, ex: "/api"

// Função helper para lidar com o fetch
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      // Se não for OK, joga um erro com a mensagem do backend
      throw new Error(data.error || "Ocorreu um erro na API");
    }
    
    return data;

  } catch (err) {
    console.error(`API Error: ${err.message}`);
    throw err; // Re-joga o erro para o componente tratar
  }
}

// Exportar funções específicas para cada endpoint
export const apiService = {
  registerUser: (formData) => {
    return apiFetch("usuarios/cadastrarUsuario", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  requestDonation: (formData) => {
     // Lógica de formatação dos itens
     const body = {
        cpf: formData.cpf,
        itens: formData.itens.map(it => ({ 
            produto_id: Number(it.produto_id), 
            quantidade: Number(it.quantidade) 
        }))
     };
    return apiFetch("necessidades/cadastrarNecessidades", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  registerVolunteer: (formData) => {
    console.log(formData)
    return apiFetch("voluntarios/cadastro", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },
  
  loginVolunteer: (credentials) => {
    return apiFetch("voluntarios/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  
  // Funções do Dashboard
  getStats: async () => {
      const [prodRes, pessoasRes, centrosRes] = await Promise.all([
          apiFetch('doacoes/produtos').catch(()=>({resultados:[] })),
          apiFetch('usuarios/usuarios').catch(()=>([])),
          apiFetch('centros/centros').catch(()=>([])),
      ]);
      return { prodRes, pessoasRes, centrosRes };
  },
  getMapData: async () => {
      const [centros, usuarios, voluntarios] = await Promise.all([
          apiFetch('centros/centros').catch(()=>[]),
          apiFetch('usuarios/usuarios').catch(()=>[]),
          apiFetch('/voluntarios/all').catch(()=>[]),
      ]);
      return { centros, usuarios, voluntarios };
  },
  getProducts: (params) => {
      return apiFetch(`doacoes/produtos?${params.toString()}`);
  },
  getPessoas: () => {
      return apiFetch('usuarios/usuarios');
  }
};