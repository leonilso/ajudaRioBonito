import { inserirCentro, listarCentros } from "../models/centrosModel.js";

export const cadastrarCentro = async (req, res) => {
  try {
    const { nome, localizacao } = req.body;
    const loc = JSON.parse(localizacao);

    await inserirCentro({ nome, localizacao: loc });
    res.status(201).json({ message: "Centro de distribuição cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao cadastrar centro de distribuição" });
  }
};

export const consultarCentros = async (req, res) => {
  try {
    const centros = await listarCentros();
    res.status(200).json(centros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao consultar centros de distribuição" });
  }
};
