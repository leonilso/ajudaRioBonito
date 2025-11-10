import db from "../services/db.js";

export async function createDonation({ localizacao, nomeProduto, descricao, tipo, quantidade, perecivel }) {
  // 1️⃣ Cria o centro de distribuição (ou use um existente)
  const [centro] = await db.execute(
    "INSERT INTO centro_distribuicao (localizacao) VALUES (?)",
    [JSON.stringify(localizacao)]
  );
  const centroId = centro.insertId;

  // 2️⃣ Cria o produto
  const [produto] = await db.execute(
    "INSERT INTO produtos (nome_produto, descricao, tipo, perecivel) VALUES (?, ?, ?, ?)",
    [nomeProduto, descricao, tipo, perecivel]
  );
  const produtoId = produto.insertId;

  // 3️⃣ Cria o registro de doação
  const [doacao] = await db.execute(
    "INSERT INTO doacoes (produto_id, centro_id, quantidade) VALUES (?, ?, ?)",
    [produtoId, centroId, quantidade]
  );

  return doacao.insertId;
}

export async function baixaDoacao(id, quantidadeBaixa) {
  // Verifica a doação
  const [rows] = await db.execute("SELECT quantidade FROM doacoes WHERE id = ?", [id]);
  if (rows.length === 0) return null;

  const atual = rows[0].quantidade;
  const novaQuantidade = atual - quantidadeBaixa;

  if (novaQuantidade <= 0) {
    // Remove doação se zerar o estoque
    await db.execute("DELETE FROM doacoes WHERE id = ?", [id]);
    return { status: "removida", novaQuantidade: 0 };
  } else {
    // Atualiza a quantidade
    await db.execute("UPDATE doacoes SET quantidade = ? WHERE id = ?", [novaQuantidade, id]);
    return { status: "atualizada", novaQuantidade };
  }
}

export async function contarProdutos(term = null) {
  let query = `
    SELECT COUNT(*) AS total
    FROM doacoes d
    JOIN produtos p ON d.produto_id = p.id
    JOIN centro_distribuicao c ON d.centro_id = c.id
  `;
  const params = [];

  if (term) {
    query += " WHERE p.nome_produto LIKE ? OR p.tipo LIKE ?";
    const likeTerm = `%${term}%`;
    params.push(likeTerm, likeTerm);
  }

  const [rows] = await db.execute(query, params);
  return rows[0].total;
}

export async function buscarProdutos(term, limit, offset) {
  const likeTerm = `%${term}%`;
  const [rows] = await db.execute(
    `SELECT 
       d.id AS id_doacao,
       p.id AS id_produto,
       p.nome_produto,
       p.tipo,
       p.perecivel,
       d.quantidade,
       c.localizacao
     FROM doacoes d
     JOIN produtos p ON d.produto_id = p.id
     JOIN centro_distribuicao c ON d.centro_id = c.id
     WHERE p.nome_produto LIKE ? OR p.tipo LIKE ?
     LIMIT ? OFFSET ?`,
    [likeTerm, likeTerm, Number(limit), Number(offset)]
  );
  return rows;
}

export async function buscarTodosProdutos(limit, offset) {
  const [rows] = await db.execute(
    `SELECT 
       d.id AS id_doacao,
       p.id AS id_produto,
       p.nome_produto,
       p.tipo,
       p.perecivel,
       d.quantidade,
       c.localizacao
     FROM doacoes d
     JOIN produtos p ON d.produto_id = p.id
     JOIN centro_distribuicao c ON d.centro_id = c.id
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}