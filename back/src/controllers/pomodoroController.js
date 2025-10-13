import pool from "../db.js";

export const salvarAtividadesSessao = async (req, res) => {
  const { atividades } = req.body;
  const idSessao = req.params.id;

  try {
    const atividadesJSON = JSON.stringify(atividades || []);
    await pool.query(
      `UPDATE pomodoro SET atividadesVinculadas = ? WHERE idStatus = ?`,
      [atividadesJSON, idSessao]
    );
    res.json({ message: "Atividades salvas com sucesso!", atividades });
  } catch (err) {
    console.error("Erro ao salvar atividades:", err);
    res.status(500).json({ error: "Erro ao salvar atividades" });
  }
};

export const listarAtividadesSessao = async (req, res) => {
  const idSessao = req.params.id;

  try {
    const [sessao] = await pool.query(
      `SELECT atividadesVinculadas FROM pomodoro WHERE idStatus = ?`,
      [idSessao]
    );

    if (!sessao[0]) return res.status(404).json({ error: "Sessão não encontrada" });

    const atividadesSalvas = JSON.parse(sessao[0].atividadesVinculadas || '[]');

    let ids = [];

    if (typeof atividadesSalvas[0] === "number") {
      ids = atividadesSalvas;
    } else {
      ids = atividadesSalvas
        .map(a => a.idAtividade)
        .filter(id => id !== undefined && id !== null);
    }

    const [atividadesComNome] = await pool.query(
      `SELECT idAtividade, nomeAtividade FROM atividades WHERE idAtividade IN (?)`,
      [ids]
    );

    const atividades = ids.map(id => {
      const atividade = atividadesComNome.find(x => x.idAtividade === id);
      return {
        idAtividade: id,
        concluido: false,
        nomeAtividade: atividade?.nomeAtividade || "Sem nome"
      };
    });

    res.json(atividades);

  } catch (err) {
    console.error("Erro ao listar atividades da sessão:", err);
    res.status(500).json({ error: "Erro ao listar atividades" });
  }
};

