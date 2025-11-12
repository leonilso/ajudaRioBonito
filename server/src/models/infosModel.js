import db from "../services/db.js";

export const listarInfos = async () => {
  // Esta query agora busca 3 métricas em uma única chamada ao banco
  const query = `
    SELECT
      (SELECT COALESCE(SUM(quantidade), 0) FROM estoque) AS total_estoque,
      (SELECT COUNT(*) FROM usuarios) AS total_pessoas,
      (SELECT COUNT(*) FROM centro_distribuicao) AS total_centros;
  `;

  try {
    const [rows] = await db.query(query);
    
    // A query acima sempre retorna UMA linha com os totais.
    // [rows] será algo como: [ { total_estoque: 500, total_pessoas: 120, total_centros: 5 } ]
    // Por isso, retornamos rows[0], que é o objeto com os dados.
    return rows[0]; 

  } catch (error) {
    console.error("Erro no model ao buscar infos:", error);
    throw new Error("Erro ao buscar estatísticas no banco de dados");
  }
};