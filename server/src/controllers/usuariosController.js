import { inserirUsuario, listarUsuarios  } from "../models/usuariosModel.js";

export const cadastrarUsuario = async (req, res) => {
  try {
    const {
      nome,
      dataNascimento,
      cpf,
      telefone,
      desabrigado,
      problemaSaude,
      detalhamentoSaude,
    } = req.body;

    const localizacao = JSON.parse(req.body.localizacao);

    await inserirUsuario({
      nome,
      dataNascimento,
      cpf,
      telefone,
      desabrigado,
      problemaSaude,
      detalhamentoSaude,
      localizacao,
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao cadastrar usuário" });
  }
};


export const consultarUsuarios = async (req, res) => {
  try {
    const usuarios = await listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao consultar usuários" });
  }
};