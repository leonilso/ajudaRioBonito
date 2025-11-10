import { createDonation, baixaDoacao, buscarProdutos, buscarTodosProdutos, contarProdutos   } from "../models/donationModel.js";

export async function registerDonation(req, res) {
  try {
    const { localizacao, nomeProduto, descricao, tipo, quantidade, perecivel } = req.body;

    if (!localizacao || !nomeProduto || !tipo || !quantidade) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const id = await createDonation({
      localizacao,
      nomeProduto,
      descricao,
      tipo,
      quantidade,
      perecivel,
    });

    res.status(201).json({ message: "Doação cadastrada com sucesso", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar doação" });
  }
}

export async function baixarDoacao(req, res) {
  try {
    const { id } = req.params;
    const { quantidade } = req.body;

    if (!quantidade || quantidade <= 0) {
      return res.status(400).json({ error: "Informe uma quantidade válida" });
    }

    const resultado = await baixaDoacao(id, quantidade);
    if (!resultado) {
      return res.status(404).json({ error: "Doação não encontrada" });
    }

    res.status(200).json({
      message: resultado.status === "removida"
        ? "Doação removida do estoque"
        : "Quantidade atualizada com sucesso",
      novaQuantidade: resultado.novaQuantidade
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao dar baixa na doação" });
  }
}

export async function buscarProdutosController(req, res) {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const total = await contarProdutos(q && q.trim() !== "" ? q : null);
    const totalPages = Math.ceil(total / limit);

    let resultados;
    if (q && q.trim() !== "") {
      resultados = await buscarProdutos(q, limit, offset);
    } else {
      resultados = await buscarTodosProdutos(limit, offset);
    }

    res.status(200).json({
      total,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
      resultados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
}