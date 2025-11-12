import { listarInfos } from "../models/infosModel.js";

export const consultarInfos = async (req, res) => {
  try {
    // 'infos' agora será o objeto: 
    // { total_estoque: X, total_pessoas: Y, total_centros: Z }
    const infos = await listarInfos();
    
    res.status(200).json(infos);
  } catch (error) {
    console.error(error);
    // Mudamos a mensagem de erro para ser mais genérica
    res.status(500).json({ error: "Erro ao consultar informações do painel" });
  }
};