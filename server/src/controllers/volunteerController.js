import { createVolunteer, getVolunteerByCpf, listarVoluntarios } from "../models/volunteerModel.js";

export async function registerVolunteer(req, res) {
  try {
    const { cpf, nome, telefone, atuacao, municipioOrigem, senha } = req.body;

    if (!cpf || !nome || !telefone || !atuacao || !municipioOrigem || !senha) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    await createVolunteer({ cpf, nome, telefone, atuacao, municipioOrigem, senha });
    res.status(201).json({ message: "Voluntário cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar voluntário" });
  }
}

export async function loginVolunteer(req, res) {
  try {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
      return res.status(400).json({ error: "CPF e senha são obrigatórios" });
    }

    const volunteer = await getVolunteerByCpf(cpf);
    if (!volunteer) {
      return res.status(404).json({ error: "Voluntário não encontrado" });
    }

    if (volunteer.senha !== senha) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    res.status(200).json({ message: "Login realizado com sucesso", volunteer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao realizar login" });
  }
}

export const consultarVoluntarios = async (req, res) => {
  try {
    const voluntarios = await listarVoluntarios();
    res.status(200).json(voluntarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao consultar voluntários" });
  }
};