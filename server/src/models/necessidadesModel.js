import db from "../services/db.js";

export const inserirNecessidades = async (usuario_id, itens) => {
  const query = `
    INSERT INTO necessidades (usuario_id, produto_id, quantidade)
    VALUES (?, ?, ?)
  `;

  for (const item of itens) {
    await db.promise().query(query, [usuario_id, item.produto_id, item.quantidade]);
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