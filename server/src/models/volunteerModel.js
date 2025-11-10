import db from "../services/db.js";

export async function createVolunteer(volunteerData) {
  const { cpf, nome, telefone, atuacao, municipioOrigem, senha } = volunteerData;
  const query = `
    INSERT INTO voluntarios (cpf, nome, telefone, atuacao, municipio_origem, senha)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await db.execute(query, [cpf, nome, telefone, atuacao, municipioOrigem, senha]);
}

export async function getVolunteerByCpf(cpf) {
  const [rows] = await db.execute("SELECT * FROM voluntarios WHERE cpf = ?", [cpf]);
  return rows[0];
}

export const listarVoluntarios = async () => {
  const query = `
    SELECT 
      cpf, nome, telefone, atuacao, municipio_origem
    FROM voluntarios
    ORDER BY nome ASC
  `;
  const [rows] = await db.promise().query(query);
  return rows;
};
