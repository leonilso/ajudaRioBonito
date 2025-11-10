import db from "../db.js";
import { inserirNecessidades, listarNecessidadesPorUsuario, atualizarNecessidade, excluirNecessidade } from "../models/necessidadesModel.js";

export const cadastrarNecessidades = async (req, res) => {
  try {
    const { cpf, itens } = req.body;

    // Busca o ID do usuário pelo CPF
    const [usuario] = await db.promise().query("SELECT id FROM usuarios WHERE cpf = ?", [cpf]);
    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await inserirNecessidades(usuario[0].id, itens);
    res.status(201).json({ message: "Necessidades registradas com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar necessidades:", error);
    res.status(500).json({ error: "Erro interno ao registrar necessidades" });
  }
};

export const consultarNecessidades = async (req, res) => {
  try {
    const { cpf } = req.params;

    // Busca o usuário pelo CPF
    const [usuario] = await db.promise().query("SELECT id FROM usuarios WHERE cpf = ?", [cpf]);
    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const necessidades = await listarNecessidadesPorUsuario(usuario[0].id);
    res.status(200).json(necessidades);
  } catch (error) {
    console.error("Erro ao consultar necessidades:", error);
    res.status(500).json({ error: "Erro interno ao consultar necessidades" });
  }
};

export const editarNecessidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade } = req.body;

    if (!quantidade || quantidade <= 0) {
      return res.status(400).json({ error: "Quantidade inválida" });
    }

    await atualizarNecessidade(id, quantidade);
    res.status(200).json({ message: "Necessidade atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar necessidade:", error);
    res.status(500).json({ error: "Erro interno ao atualizar necessidade" });
  }
};

export const removerNecessidade = async (req, res) => {
  try {
    const { id } = req.params;

    await excluirNecessidade(id);
    res.status(200).json({ message: "Necessidade removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir necessidade:", error);
    res.status(500).json({ error: "Erro interno ao excluir necessidade" });
  }
};

