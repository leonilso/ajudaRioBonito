import db from "../db.js";

export const inserirUsuario = async (dados) => {
  const query = `
    INSERT INTO usuarios 
    (nome, dataNascimento, cpf, telefone, desabrigado, problemaSaude, detalhamentoSaude, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    dados.nome,
    dados.dataNascimento,
    dados.cpf,
    dados.telefone,
    dados.desabrigado,
    dados.problemaSaude,
    dados.detalhamentoSaude,
    dados.localizacao.lat,
    dados.localizacao.lng,
  ];
  await db.promise().query(query, values);
};

export const listarUsuarios = async () => {
  const query = `
    SELECT 
      id, nome, dataNascimento, cpf, telefone, 
      desabrigado, problemaSaude, detalhamentoSaude, 
      latitude, longitude
    FROM usuarios
    ORDER BY nome ASC
  `;
  const [rows] = await db.promise().query(query);
  return rows;
};
