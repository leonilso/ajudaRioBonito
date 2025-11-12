import db from "../services/db.js";

export const inserirCentro = async (dados) => {
  const query = `
    INSERT INTO centro_distribuicao (nome, latitude, longitude)
    VALUES (?, ?, ?)
  `;
  const values = [dados.nome, dados.lat, dados.lng];
  await db.query(query, values);
};

export const listarCentros = async () => {
  const query = `
    SELECT id, nome, latitude, longitude
    FROM centro_distribuicao
    ORDER BY nome ASC
  `;
  const [rows] = await db.query(query);
  return rows;
};
