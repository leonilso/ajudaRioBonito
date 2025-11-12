import db from "../services/db.js";

export async function createDonation({ centroId, nomeProduto, descricao, tipo, quantidade, perecivel }) {
  // // 1️⃣ Normaliza o nome para busca
  const nomeNormalizado = nomeProduto.trim().toLowerCase();

  // // 2️⃣ Verifica se já existe um produto com o mesmo nome (ignorando maiúsculas/minúsculas)
  const [existing] = await db.execute(
    "SELECT id FROM produtos WHERE LOWER(TRIM(nomeProduto)) = ?",
    [nomeNormalizado]
  );

  let produtoId;

  if (existing.length > 0) {
      produtoId = existing[0].id
      // 5️⃣ Cria uma nova doação para esse centro
      const [doacao] = await db.execute(
        "INSERT INTO doacoes (produto_id, centro_id, quantidade) VALUES (?, ?, ?)",
        [produtoId, centroId, quantidade]
      );
  } else {
    // 6️⃣ Produto novo → cria e registra a doação
    const [produto] = await db.execute(
      "INSERT INTO produtos (nomeProduto, descricao, tipo, perecivel) VALUES (?, ?, ?, ?)",
      [nomeProduto.trim(), descricao, tipo, perecivel]
    );
    produtoId = produto.insertId;

    [doacao] = await db.execute(
      "INSERT INTO doacoes (produto_id, centro_id, quantidade) VALUES (?, ?, ?)",
      [produtoId, centroId, quantidade]
    );

    
  }
  return { id: produtoId};
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
    query += " WHERE p.nomeProduto LIKE ? OR p.tipo LIKE ?";
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
       p.id AS id_produto,
       p.nomeProduto,
       p.tipo,
       p.perecivel,
       e.quantidade,
       c.nome AS nome_centro
     FROM estoque e
     JOIN produtos p ON e.produto_id = p.id
     JOIN centro_distribuicao c ON e.centro_id = c.id
     WHERE p.nomeProduto LIKE ? OR p.tipo LIKE ?
     LIMIT ? OFFSET ?`,
    [likeTerm, likeTerm, Number(limit), Number(offset)]
  );
  return rows;
}

export async function buscarTodosProdutos(limit, offset) {
  const [rows] = await db.execute(
    `SELECT 
       p.id AS id_produto,
       p.nomeProduto,
       p.tipo,
       p.perecivel,
       e.quantidade,
       c.nome AS nome_centro
     FROM estoque e
     JOIN produtos p ON e.produto_id = p.id
     JOIN centro_distribuicao c ON e.centro_id = c.id
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}
