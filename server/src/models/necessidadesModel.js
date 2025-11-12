import db from "../services/db.js";

// Função auxiliar para "pegar ou criar" o produto DENTRO da transação
const getOrCreateProdutoId = async (connection, nomeProduto) => {
  // 1. Tenta encontrar
  const [rows] = await connection.query('SELECT id FROM produtos WHERE nomeProduto = ?', [nomeProduto]);

  if (rows.length > 0) {
    return rows[0].id; // Retorna o ID existente
  }

  // 2. Se não encontrou, cria
  const [result] = await connection.query('INSERT INTO produtos (nomeProduto) VALUES (?)', [nomeProduto]);
  return result.insertId; // Retorna o novo ID
};


// Sua função principal, agora usando transações
export const inserirNecessidades = async (usuario_id, itens) => {
  let connection;
  try {
    // 1. Pega uma conexão do pool
    connection = await db.getConnection();
    
    // 2. Inicia a transação
    await connection.beginTransaction();

    const queryNecessidade = `
      INSERT INTO necessidades (usuario_id, produto_id, quantidade)
      VALUES (?, ?, ?)
    `;

    for (const item of itens) {
      // 3. Busca ou cria o ID do produto usando a *mesma conexão*
      const produto_id = await getOrCreateProdutoId(connection, item.produto_id);

      // 4. Insere na tabela 'necessidades'
      await connection.query(queryNecessidade, [usuario_id, produto_id, item.quantidade]);
    }

    // 5. Se tudo no loop deu certo, confirma a transação
    await connection.commit();

  } catch (error) {
    // 6. Se qualquer passo falhar, desfaz a transação
    if (connection) {
      await connection.rollback();
    }
    console.error("Erro ao inserir necessidades, rollback executado:", error);
    throw error; // Propaga o erro para quem chamou a função

  } finally {
    // 7. Sempre libera a conexão de volta para o pool
    if (connection) {
      connection.release();
    }
  }
};

export const listarNecessidadesPorUsuario = async (usuario_id) => {
  const query = `
    SELECT n.id, p.nomeProduto, n.quantidade, n.data_registro
    FROM necessidades n
    JOIN produtos p ON n.produto_id = p.id
    WHERE n.usuario_id = ?
    ORDER BY n.data_registro DESC
  `;
  const [rows] = await db.promise().query(query, [usuario_id]);
  return rows;
};

export const atualizarNecessidade = async (id, quantidade) => {
  const query = `UPDATE necessidades SET quantidade = ? WHERE id = ?`;
  await db.promise().query(query, [quantidade, id]);
};

export const excluirNecessidade = async (id) => {
  const query = `DELETE FROM necessidades WHERE id = ?`;
  await db.promise().query(query, [id]);
};