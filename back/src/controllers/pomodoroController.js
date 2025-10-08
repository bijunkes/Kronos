import pool from "../db.js";

// Salvar atividades na sessão
export const salvarAtividadesSessao = async (req, res) => {
  const { atividades } = req.body; // [{ idAtividade, concluido }]
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

// Listar atividades da sessão
export const listarAtividadesSessao = async (req, res) => {
  const idSessao = req.params.id;

  try {
    const [sessao] = await pool.query(
      `SELECT atividadesVinculadas FROM pomodoro WHERE idStatus = ?`,
      [idSessao]
    );

    if (!sessao[0]) return res.status(404).json({ error: "Sessão não encontrada" });

    const atividadesSalvas = JSON.parse(sessao[0].atividadesVinculadas || '[]');

    if (!atividadesSalvas.length) return res.json([]);

    // Buscar nomes das atividades na tabela 'atividades'
    const ids = atividadesSalvas.map(a => a.idAtividade);
    const [atividadesComNome] = await pool.query(
      `SELECT idAtividade, nomeAtividade FROM atividades WHERE idAtividade IN (?)`,
      [ids]
    );

    const atividades = atividadesSalvas.map(a => {
      const atividade = atividadesComNome.find(x => x.idAtividade === a.idAtividade);
      return {
        idAtividade: a.idAtividade,
        concluido: a.concluido ?? false,
        nomeAtividade: atividade?.nomeAtividade || "Sem nome"
      };
    });

    res.json(atividades);
  } catch (err) {
    console.error("Erro ao listar atividades da sessão:", err);
    res.status(500).json({ error: "Erro ao listar atividades" });
  }
};
