import pool from "../db.js";

/**
 * ✅ Cria uma nova sessão Pomodoro se o usuário não tiver uma em andamento.
 * Retorna a existente se já houver (evita duplicação no banco).
 */
export const criarSessaoPomodoro = async (req, res) => {
  const username = req.usuarioUsername;

  try {
    // 1️⃣ Verifica se já existe uma sessão sem fim
    const [existente] = await pool.query(
      `SELECT idStatus FROM pomodoro 
       WHERE Usuarios_username = ? AND fim IS NULL 
       ORDER BY inicio DESC 
       LIMIT 1`,
      [username]
    );

    if (existente.length > 0) {
      console.log("⚠️ Sessão já existente — retornando:", existente[0].idStatus);
      return res.status(200).json({
        idStatus: existente[0].idStatus,
        message: "Sessão já existente retornada."
      });
    }

    // 2️⃣ Caso não haja sessão, cria uma nova limpa
    const atividadesVinculadas = JSON.stringify([]);
    const duracaoFoco = JSON.stringify([25]);
    const ciclosFoco = JSON.stringify([4]);

    // 1 ciclo padrão

    const [result] = await pool.query(
      `INSERT INTO pomodoro 
        (Usuarios_username, atividadesVinculadas, duracaoFoco, ciclosFoco, duracaoIntervaloCurto, duracaoIntervaloLongo, inicio)
       VALUES (?, ?, ?, ?, 5, 15, NOW())`,
      [username, atividadesVinculadas, duracaoFoco, ciclosFoco]
    );

    console.log("🆕 Nova sessão criada:", result.insertId);

    res.status(201).json({
      idStatus: result.insertId,
      message: "Sessão criada com sucesso."
    });
  } catch (err) {
    console.error("❌ Erro ao criar sessão Pomodoro:", err);
    res.status(500).json({ error: "Falha ao criar sessão Pomodoro." });
  }
};


/**
 * ✅ Inicia sessão existente com as atividades e durações.
 */
export const iniciarSessaoPomodoro = async (req, res) => {
  const { id } = req.params;
  const {
    atividades = [],
    duracaoFoco: duracaoFocoFront,
    duracaoIntervaloCurto = 5,
    duracaoIntervaloLongo = 15,
    ciclosFoco: ciclosFocoFront,
    ciclosIntervaloCurto = 0,
    ciclosIntervaloLongo = 0
  } = req.body;

  try {
    // Busca os valores atuais da sessão
    const [atual] = await pool.query(
      `SELECT duracaoFoco, ciclosFoco, atividadesVinculadas 
       FROM pomodoro WHERE idStatus = ?`,
      [id]
    );

    if (!atual[0]) {
      return res.status(404).json({ error: "Sessão não encontrada" });
    }

    let duracaoFoco;
    let ciclosFoco;
    let atividadesVinculadas;

    if (atividades.length === 0) {
      // 🔹 Caso sem atividades, usa os valores do front ou mantém os existentes
      duracaoFoco = duracaoFocoFront != null ? JSON.stringify([duracaoFocoFront]) : atual[0].duracaoFoco || JSON.stringify([25]);
      ciclosFoco = ciclosFocoFront != null ? JSON.stringify([ciclosFocoFront]) : atual[0].ciclosFoco || JSON.stringify([4]);
      atividadesVinculadas = JSON.stringify([]); // Sem atividades
    } else {
      // 🔹 Caso com atividades, monta arrays com os valores de cada atividade
      duracaoFoco = JSON.stringify(atividades.map(a => a.foco ?? 25));
      ciclosFoco = JSON.stringify(atividades.map(a => a.ciclos ?? 1));
      atividadesVinculadas = JSON.stringify(atividades.map(a => a.idAtividade));
    }

    // Atualiza a sessão
    await pool.query(
      `UPDATE pomodoro
       SET duracaoFoco = ?, duracaoIntervaloCurto = ?, duracaoIntervaloLongo = ?,
           ciclosFoco = ?, ciclosIntervaloCurto = ?, ciclosIntervaloLongo = ?,
           atividadesVinculadas = ?, inicio = NOW()
       WHERE idStatus = ?`,
      [
        duracaoFoco,
        parseInt(duracaoIntervaloCurto),
        parseInt(duracaoIntervaloLongo),
        ciclosFoco,
        ciclosIntervaloCurto,
        ciclosIntervaloLongo,
        atividadesVinculadas,
        id
      ]
    );

    // Retorna sessão atualizada
    const [sessaoAtualizada] = await pool.query(
      `SELECT * FROM pomodoro WHERE idStatus = ?`,
      [id]
    );

    res.json({
      message: "Sessão iniciada com sucesso!",
      sessao: sessaoAtualizada[0]
    });

  } catch (err) {
    console.error("❌ Erro ao iniciar sessão Pomodoro:", err);
    res.status(500).json({ error: "Erro ao iniciar sessão Pomodoro." });
  }
};




/**
 * ✅ Retorna atividades de uma sessão específica.
 * Corrigido para suportar formato antigo e novo.
 */
export const listarAtividadesSessao = async (req, res) => {
  const idSessao = req.params.id;

  try {
    const [rows] = await pool.query(
      `SELECT atividadesVinculadas, duracaoFoco, ciclosFoco FROM pomodoro WHERE idStatus = ?`,
      [idSessao]
    );

    if (!rows[0]) return res.json([]);

    const row = rows[0];

    // Helper
    const toMinutes = (val, def = 25) => {
      if (val == null) return def;
      if (typeof val === "number") return val;
      if (typeof val === "string") {
        if (val.includes(":")) {
          const [h, m, s] = val.split(":").map(Number);
          return h * 60 + m + (s > 0 ? 1 : 0);
        }
        const n = parseInt(val);
        return Number.isFinite(n) ? n : def;
      }
      return def;
    };

    let atividadesSalvas;
    try {
      atividadesSalvas = JSON.parse(row.atividadesVinculadas || "[]");
    } catch {
      atividadesSalvas = [];
    }

    if (!Array.isArray(atividadesSalvas) || atividadesSalvas.length === 0) {
      return res.json([]); // nenhuma atividade
    }

    const ids = atividadesSalvas.map(a =>
      typeof a === "object" ? a.idAtividade : a
    );

    const [atividadesComNome] = await pool.query(
      `SELECT idAtividade, nomeAtividade FROM atividades WHERE idAtividade IN (?)`,
      [ids]
    );

    let duracaoFocoArr = JSON.parse(row.duracaoFoco || "[]"); let ciclosFocoArr = JSON.parse(row.ciclosFoco || "[]");

    // Defaults
    if (!Array.isArray(duracaoFocoArr) || duracaoFocoArr.length === 0) duracaoFocoArr = ids.map(() => 25); if (!Array.isArray(ciclosFocoArr) || ciclosFocoArr.length === 0) ciclosFocoArr = ids.map(() => 1);

    const atividades = ids.map((id, i) => {
      const nome = atividadesComNome.find(a => a.idAtividade === id)?.nomeAtividade || "Sem nome";
      return {
        idAtividade: id,
        nomeAtividade: nome,
        foco: toMinutes(duracaoFocoArr[i] ?? 25),
        ciclos: ciclosFocoArr[i] ?? 1,
        concluido: false
      };
    });

    res.json(atividades);
  } catch (err) {
    console.error("❌ Erro ao listar atividades:", err);
    res.status(500).json({ error: "Erro ao listar atividades" });
  }
};


/**
 * ✅ Resto dos endpoints — permanecem iguais
 */
export const salvarAtividadesSessao = async (req, res) => {
  const { atividades } = req.body; // array de IDs
  const idSessao = req.params.id;

  try {
    const atividadesJSON = JSON.stringify(atividades || []);

    // 1️⃣ Atualiza a sessão
    await pool.query(
      `UPDATE pomodoro SET atividadesVinculadas = ? WHERE idStatus = ?`,
      [atividadesJSON, idSessao]
    );

    // 2️⃣ Vincula as atividades à sessão correta
    if (atividades && atividades.length > 0) {
      await pool.query(
        `UPDATE atividades SET Pomodoro_idStatus = ? WHERE idAtividade IN (?)`,
        [idSessao, atividades]
      );
    }

    res.json({ message: "Atividades salvas com sucesso!", atividades });

  } catch (err) {
    console.error("Erro ao salvar atividades:", err);
    res.status(500).json({ error: "Erro ao salvar atividades" });
  }
};


export const registrarTempoPomodoro = async (req, res) => {
  const { idSessao } = req.params;
  const { focoSegundos = 0, curtoSegundos = 0, longoSegundos = 0 } = req.body;

  try {
    await pool.query(
      `UPDATE pomodoro 
       SET duracaoRealFocoSegundos = duracaoRealFocoSegundos + ?,
           duracaoRealCurtoSegundos = duracaoRealCurtoSegundos + ?,
           duracaoRealLongoSegundos = duracaoRealLongoSegundos + ?
       WHERE idStatus = ?`,
      [focoSegundos, curtoSegundos, longoSegundos, idSessao]
    );
    res.json({ message: "Tempo atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar tempo:", err);
    res.status(500).json({ error: "Falha ao atualizar tempos da sessão." });
  }
};

export const finalizarSessaoPomodoro = async (req, res) => {
  const idSessao = req.params.id;
  const {
    duracaoRealFocoSegundos,
    duracaoRealCurtoSegundos,
    duracaoRealLongoSegundos,
    fimAutomatico
  } = req.body;

  try {
    if (fimAutomatico === true) {
      await pool.query(
        `UPDATE pomodoro
         SET fim = NOW()
         WHERE idStatus = ?`,
        [idSessao]
      );

      return res.json({
        message: "Sessão finalizada automaticamente (reload)."
      });
    }

    await pool.query(
      `UPDATE pomodoro 
       SET duracaoRealFocoSegundos = ?, 
           duracaoRealCurtoSegundos = ?, 
           duracaoRealLongoSegundos = ?, 
           fim = NOW() 
       WHERE idStatus = ?`,
      [
        duracaoRealFocoSegundos,
        duracaoRealCurtoSegundos,
        duracaoRealLongoSegundos,
        idSessao
      ]
    );

    res.json({ message: "Sessão finalizada com sucesso!" });
  } catch (err) {
    console.error("Erro ao finalizar sessão Pomodoro:", err);
    res.status(500).json({ error: "Erro ao finalizar sessão Pomodoro" });
  }
};

/*
export const adicionarAtividadeSessao = async (req, res) => {
  const { id } = req.params;
  const { idAtividade } = req.body;

  try {
    const [result] = await pool.query(
      `SELECT atividadesVinculadas FROM pomodoro WHERE idStatus = ?`,
      [id]
    );

    let atuais = [];
    try {
      atuais = JSON.parse(result[0]?.atividadesVinculadas || "[]");
    } catch {
      atuais = [];
    }

    if (typeof atuais[0] === "number") {
      atuais = atuais.map(num => ({ idAtividade: num }));
    }

    if (!atuais.some(a => a.idAtividade === idAtividade)) {
      atuais.push({ idAtividade });
    }

    await pool.query(
      `UPDATE pomodoro SET atividadesVinculadas = ? WHERE idStatus = ?`,
      [JSON.stringify(atuais), id]
    );

    res.json({
      message: "Atividade vinculada com sucesso!",
      atividades: atuais
    });
  } catch (err) {
    console.error("❌ Erro ao adicionar atividade:", err);
    res.status(500).json({ error: "Erro ao vincular atividade à sessão." });
  }
};
*/
export const obterUltimaSessaoPomodoro = async (req, res) => {
  const username = req.usuarioUsername;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM pomodoro 
       WHERE Usuarios_username = ? 
       ORDER BY inicio DESC 
       LIMIT 1`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json();
    }

    const sessao = rows[0];
    try {
      sessao.atividadesVinculadas = JSON.parse(sessao.atividadesVinculadas || "[]");
    } catch {
      sessao.atividadesVinculadas = [];
    }

    res.json(sessao);
  } catch (err) {
    console.error("Erro ao buscar última sessão Pomodoro:", err);
    res.status(500).json({ error: "Erro ao buscar última sessão Pomodoro." });
  }
};

export const atualizarParcial = async (req, res) => {
  const id = req.params.id;

  const { foco, curto, longo } = req.body;

  if (!id) {
    return res.status(400).json({ erro: "ID da sessão não fornecido." });
  }

  try {
    await pool.query(`
      UPDATE pomodoro
      SET 
        duracaoRealFocoSegundos = ?,
        duracaoRealCurtoSegundos = ?,
        duracaoRealLongoSegundos = ?
      WHERE idStatus = ?
    `, [
      foco ?? 0,
      curto ?? 0,
      longo ?? 0,
      id
    ]);

    res.json({ ok: true, msg: "Tempo real salvo com sucesso." });

  } catch (e) {
    console.error("Erro ao atualizar parcial:", e);
    res.status(500).json({ erro: "Erro ao salvar progresso parcial." });
  }
};

