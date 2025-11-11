import db from "../services/db.js";

export async function createVolunteer(volunteerData) {
  const { cpf, nome, telefone, atuacao, municipioOrigem, senha } = volunteerData;
  const query = `
    INSERT INTO voluntarios (cpf, nome, telefone, atuacao, municipioOrigem, senha)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await db.execute(query, [cpf, nome, telefone, atuacao, municipioOrigem, senha]);
}

export async function getVolunteerByCpf(cpf) {
  const [results] = await db.execute("SELECT * FROM voluntarios WHERE cpf = ?", [cpf]);
  return results[0];
}

export const listarVoluntarios = async () => {
  const query = `
    SELECT 
      cpf, nome, telefone, atuacao, municipioOrigem
    FROM voluntarios
    ORDER BY nome ASC
  `;
  const [rows] = await db.promise().query(query);
  return rows;
};
