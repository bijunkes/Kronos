import React, { useEffect, useState, useRef } from 'react';
import { Background, Container, Intervalos, Intervalo, Principal, ParteTempo, Cronometro, Circulo, Reiniciar, Pular, Configuracoes, TituloConfiguracoes, OpcoesConfiguracoes, OpcaoFoco, FocoDuracao, FocoQtde, OpcaoCurto, OpcaoLongo, Atividades, Atividade, Adicionar, Lista } from './styles';
import ModalAtividades from '../ModalAtividades';
import api, { listarTodasAtividades, listarAtividadesSessao, salvarAtividadesSessao, obterUltimaSessaoPomodoro, salvarTempoRealParcial } from '../../services/api.js';

function Pomodoro() {
  const [modo, setModo] = useState("foco");
  const [config, setConfig] = useState({
    foco: 25 * 60,
    curto: 5 * 60,
    longo: 15 * 60,
    ciclos: 4,
  });
  const [tempo, setTempo] = useState(config.foco);
  const [ativo, setAtivo] = useState(false);

  const [duracoesPorCiclo, setDuracoesPorCiclo] = useState([]);
  const [indiceCicloGlobal, setIndiceCicloGlobal] = useState(0);

  const [idSessao, setIdSessao] = useState(null);

  const [atividades, setAtividades] = useState([]);
  const [atividadesSelecionadas, setAtividadesSelecionadas] = useState([]);

  const atividadeAtual = atividadesSelecionadas[indiceCicloGlobal] || null;

  const [tempoRestante, setTempoRestante] = useState(0);

  const [tempoReal, setTempoReal] = useState({
    foco: 0,
    curto: 0,
    longo: 0
  });

  const [modalAberto, setModalAberto] = useState(false);
  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const [hoverAtividade, setHoverAtividade] = useState({});

  const lerCiclosDoBackend = (val, fallback = 4) => {
    if (val == null) return fallback;
    if (typeof val === "number") return Number(val);
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) return Number(parsed[0]) || fallback;
      if (typeof parsed === "number") return Number(parsed) || fallback;
    } catch (e) {
    }
    const n = parseInt(val);
    if (!Number.isNaN(n)) return n;
    return fallback;
  };

  const calcularDuracoesTotais = () => {
    let totalFoco = 0;
    let totalCurto = 0;
    let totalLongo = 0;

    if (atividadesSelecionadas.length > 0) {
      atividadesSelecionadas.forEach(a => {
        totalFoco += (a.foco || 25) * 60;
      });
      totalCurto = config.curto;
    } else {
      totalFoco = config.foco;
      totalCurto = config.curto;
    }

    totalLongo = config.longo;

    return { totalFoco, totalCurto, totalLongo };
  };

  const garantirSessao = async (ativs = atividadesSelecionadas) => {
    if (idSessao && !sessaoTemplate?.fim) return idSessao;

    let totalFoco = 0;
    let totalCurto = config.curto;
    let totalLongo = config.longo;

    if (ativs.length > 0) {
      ativs.forEach(a => {
        totalFoco += (a.foco || 25) * 60 * (a.ciclos || 1);
      });
    } else {
      totalFoco = config.foco * config.ciclos;
    }

    const ciclosFoco = ativs.length > 0
      ? Math.max(...ativs.map(a => a.ciclos || 1))
      : config.ciclos;

    const ciclosIntervaloCurto = Math.max(0, ciclosFoco - 1);
    const ciclosIntervaloLongo = 1;

    const formatarTempoBanco = (segundos) => {
      const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
      const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
      const s = String(segundos % 60).padStart(2, "0");
      return `${h}:${m}:${s}`;
    };

    try {
      const res = await api.post("/pomodoro", {
        duracaoFoco: formatarTempoBanco(totalFoco),
        duracaoIntervaloCurto: formatarTempoBanco(totalCurto),
        duracaoIntervaloLongo: formatarTempoBanco(totalLongo),
        ciclosFoco,
        ciclosIntervaloCurto,
        ciclosIntervaloLongo
      });

      const id = res.data.idStatus;
      setIdSessao(id);
      console.log("🟢 Sessão criada com base nas atividades! ID:", id);
      return id;
    } catch (err) {
      console.error("Erro ao criar sessão:", err);
      return null;
    }
  };

  const [sessaoTemplate, setSessaoTemplate] = useState(null);

  const tempoRealRef = useRef(tempoReal);

  useEffect(() => {
  tempoRealRef.current = tempoReal;
}, [tempoReal]);

useEffect(() => {
  if (!idSessao) return;

  console.log("🟢 ENTROU NO AUTOSAVE USEEFFECT");

  const interval = setInterval(() => {
    console.log("🔁 Rodando autosave... tempoReal:", tempoRealRef.current);
    salvarTempoRealParcial(idSessao, tempoRealRef.current);
  }, 5000);

  return () => clearInterval(interval);
}, [idSessao]);




  useEffect(() => {
    console.log("🚀 Carregando última sessão...");

    const carregarUltimaSessao = async () => {
      try {
        const res = await api.get("/pomodoro/ultima");
        const dados = res.data;

        if (!dados || !dados.idStatus || dados.idStatus === null) {
          const novaSessaoId = await garantirSessao({
            foco: [25],
            curto: 5,
            longo: 15,
            ciclos: [4],
            atividades: [],
          });
          if (novaSessaoId) {
            console.log("🆕 Nova sessão criada — ID:", novaSessaoId);
            setIdSessao(novaSessaoId);
            setSessaoIniciada(false);
          }
          return;
        }

        const id = dados.idStatus;
        console.log("✅ Sessão anterior encontrada — ID:", id);

        setSessaoTemplate(dados);
        setIdSessao(null);
        setSessaoIniciada(false);

        const converterTempoParaMinutos = (tempo, padrao) => {
          if (tempo == null) return padrao;

          if (typeof tempo === "number") return tempo;

          if (typeof tempo === "string") {
            try {
              const parsed = JSON.parse(tempo);
              if (Array.isArray(parsed) && parsed.length > 0) return Number(parsed[0]) || padrao;
              if (typeof parsed === "number") return parsed;
            } catch (err) {
            }

            const partes = tempo.split(":").map(Number);
            if (partes.length === 3) {
              const [h, m, s] = partes;
              return h * 60 + m + (s > 0 ? 1 : 0);
            }

            const n = parseInt(tempo);
            return !Number.isNaN(n) ? n : padrao;
          }

          return padrao;
        };

        const atividadesBanco = await listarAtividadesSessao(id);
        console.log("🧠 Atividades brutas:", atividadesBanco);

        const novasAtividades = (atividadesBanco || []).map(a => ({
          ...a,
          foco: a.foco != null ? Number(a.foco) : 25,
          ciclos: a.ciclos != null ? Number(a.ciclos) : 4,
        }));
        console.log("🎯 Atividades normalizadas:", novasAtividades);

        setAtividadesSelecionadas(novasAtividades);

        if (novasAtividades.length > 0) {
          const primeira = novasAtividades[0];
          setConfig(prev => ({
            ...prev,
            foco: (primeira.foco || 25) * 60,
            ciclos: lerCiclosDoBackend(dados.ciclosFoco, 4),
            curto: converterTempoParaMinutos(dados.duracaoIntervaloCurto, 5) * 60,
            longo: converterTempoParaMinutos(dados.duracaoIntervaloLongo, 15) * 60,
          }));
          setTempo((primeira.foco || 25) * 60);
        } else {
          const duracaoFocoMin = converterTempoParaMinutos(dados.duracaoFoco, 25);
          const duracaoCurtoMin = converterTempoParaMinutos(dados.duracaoIntervaloCurto, 5);
          const duracaoLongoMin = converterTempoParaMinutos(dados.duracaoIntervaloLongo, 15);

          setConfig(prev => ({
            ...prev,
            foco: duracaoFocoMin * 60,
            curto: duracaoCurtoMin * 60,
            longo: duracaoLongoMin * 60,
            ciclos: lerCiclosDoBackend(dados.ciclosFoco, 4),
          }));
          setTempo(duracaoFocoMin * 60);
        }

        setAtivo(false);

      } catch (err) {
        console.warn("❌ Erro ao carregar última sessão:", err);
        console.log("⚙️ Criando sessão padrão de fallback...");

        try {
          const novaSessaoId = await garantirSessao({
            foco: [25],
            curto: 5,
            longo: 15,
            ciclos: [4],
            atividades: [],
          });
          if (novaSessaoId) {
            setIdSessao(novaSessaoId);
            setSessaoIniciada(false);
          }
        } catch (e) {
          console.error("💀 Falha ao criar fallback:", e);
        }
      }
    };

    carregarUltimaSessao();
  }, []);

  useEffect(() => {
    const carregarAtividades = async () => {
      if (!idSessao) return;
      const lista = await listarAtividadesSessao(idSessao);
      setAtividadesSelecionadas(lista);
    };
    carregarAtividades();
  }, [idSessao]);

  useEffect(() => {
    if (!ativo || tempoRestante <= 0) return;
    const interval = setInterval(() => {
      setTempoRestante(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [ativo, tempoRestante]);

  useEffect(() => {
    if (!ativo) return;
    const interval = setInterval(() => {
      setTempoReal(prev => ({
        ...prev,
        [modo]: prev[modo] + 1
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [ativo, modo]);

  useEffect(() => {
    async function fetchAtividades() {
      try {
        const dados = await listarTodasAtividades();
        setAtividades(dados);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    }
    fetchAtividades();
  }, []);

  useEffect(() => {
    let intervalo = null;
    if (ativo && tempo > 0) {
      intervalo = setInterval(() => setTempo(t => t - 1), 1000);
    } else if (tempo === 0 && ativo) {
      handleFimGlobal();
    }
    return () => clearInterval(intervalo);
  }, [ativo, tempo]);

  useEffect(() => {
    const arr = calcularDuracoesPorCiclo(atividadesSelecionadas);
    setDuracoesPorCiclo(arr);
    setIndiceCicloGlobal(0);

    if (arr.length > 0) {
      setTempo(arr[0].duracao);
      setModo(arr[0].tipo);
    } else {
      setTempo(config.foco);
      setModo("foco");
    }

    setAtivo(false);
  }, [atividadesSelecionadas, config]);

  const formatarTempo = (segundosRaw) => {
    const segundos = Math.max(0, Math.floor(segundosRaw || 0));
    const mm = String(Math.floor(segundos / 60)).padStart(2, "0");
    const ss = String(segundos % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const calcularDuracoesPorCiclo = (ativs) => {
    const sequencia = [];

    if (!ativs || ativs.length === 0) {
      for (let i = 0; i < config.ciclos; i++) {
        sequencia.push({ tipo: "foco", duracao: config.foco });
        if (i < config.ciclos - 1) sequencia.push({ tipo: "curto", duracao: config.curto });
      }
      sequencia.push({ tipo: "longo", duracao: config.longo });
      return sequencia;
    }

    const maxCiclos = Math.max(...ativs.map(a => a.ciclos || 1));
    for (let i = 0; i < maxCiclos; i++) {
      let duracaoCiclo = 0;
      ativs.forEach(a => {
        if (i < (a.ciclos || 1)) duracaoCiclo += (a.foco || 25) * 60;
      });
      sequencia.push({ tipo: "foco", duracao: duracaoCiclo });
      if (i < maxCiclos - 1) sequencia.push({ tipo: "curto", duracao: config.curto });
    }
    sequencia.push({ tipo: "longo", duracao: config.longo });

    return sequencia;
  };

  const handleFimGlobal = async () => {
    if (!idSessao) return;

    try {
      await api.patch(`/pomodoro/${idSessao}/finalizar`, {
        duracaoRealFocoSegundos: tempoReal.foco,
        duracaoRealCurtoSegundos: tempoReal.curto,
        duracaoRealLongoSegundos: tempoReal.longo
      });

      setSessaoTemplate({
        atividadesSelecionadas: [...atividadesSelecionadas],
        config: { ...config }
      });

      setIdSessao(null);
      setSessaoIniciada(false);
      setIndiceCicloGlobal(0);
      setTempo(config.foco);
      setModo("foco");
      setAtivo(false);
      setTempoReal({ foco: 0, curto: 0, longo: 0 });

    } catch (err) {
      console.error(err);
    }
  };

  const pularIntervalo = () => {
    if (indiceCicloGlobal < duracoesPorCiclo.length - 1) {
      const proximo = indiceCicloGlobal + 1;
      setIndiceCicloGlobal(proximo);
      setTempo(duracoesPorCiclo[proximo].duracao);
      setModo(duracoesPorCiclo[proximo].tipo);

      setAtivo(true);
    } else {
      handleFimGlobal();
    }
  };

  const reiniciar = () => {
    if (duracoesPorCiclo.length > 0) {
      setIndiceCicloGlobal(0);
      setTempo(duracoesPorCiclo[0].duracao);
      setModo(duracoesPorCiclo[0].tipo);
    } else {
      setTempo(config.foco);
      setModo("foco");
    }
    setAtivo(false);
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    const novoValor = value === "" ? 1 : parseInt(value) || 1;

    setConfig((prev) => ({
      ...prev,
      [name]: novoValor * (name === 'ciclos' ? 1 : 60),
    }));

    if (name === modo) setTempo(novoValor * 60);
  };

  const adicionarAtividadeSessao = async (atividade) => {
    if (atividadesSelecionadas.some(a => a.idAtividade === atividade.idAtividade)) return;

    const novasAtivs = [
      ...atividadesSelecionadas,
      { ...atividade, foco: atividade.foco ?? 25, ciclos: 1, concluido: false }
    ];

    setAtividadesSelecionadas(novasAtivs);

    try {
      await new Promise((resolve) => setTimeout(resolve, 0));

      const sessao = await garantirSessao(novasAtivs);

      if (!sessao) return;
      await salvarAtividadesSessao(sessao, novasAtivs);
      console.log("Atividades atualizadas com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar atividades:", err);
    }
  };

  const [sessaoIniciada, setSessaoIniciada] = useState(false);

  const handlePlay = async () => {
    console.log("🚀 handlePlay chamado");

    const { totalFoco, totalCurto, totalLongo } = calcularDuracoesTotais();

    let ciclosFoco = config.ciclos;
    if (atividadesSelecionadas.length > 0) {
      ciclosFoco = atividadesSelecionadas.reduce(
        (max, a) => Math.max(max, a.ciclos || 1),
        1
      );
    }

    const ciclosIntervaloCurto = Math.max(0, ciclosFoco - 1);
    const ciclosIntervaloLongo = 1;

    try {
      if (sessaoIniciada) {
        console.log("▶️ Retomando sessão já iniciada...");
        setAtivo(true);
        return;
      }

      let sessao = idSessao;

      if (!sessao || (sessaoTemplate?.fim && !ativo)) {
        console.log("🆕 Criando nova sessão porque não há sessão ativa...");
        sessao = await garantirSessao(atividadesSelecionadas);
        if (!sessao) {
          console.error("❌ Falha ao criar nova sessão");
          return;
        }
        setIdSessao(sessao);
        setSessaoTemplate(null);
      }

      if (atividadesSelecionadas.length > 0) {
        await salvarAtividadesSessao(sessao, atividadesSelecionadas);
      }

      const semAtividades = atividadesSelecionadas.length === 0;

      const body = {
        duracaoFoco: semAtividades
          ? Math.ceil(config.foco / 60)
          : Math.ceil(totalFoco / 60),

        duracaoIntervaloCurto: semAtividades
          ? Math.ceil(config.curto / 60)
          : Math.ceil(totalCurto / 60),

        duracaoIntervaloLongo: semAtividades
          ? Math.ceil(config.longo / 60)
          : Math.ceil(totalLongo / 60),

        ciclosFoco: semAtividades
          ? config.ciclos
          : ciclosFoco,

        ciclosIntervaloCurto: semAtividades
          ? Math.max(0, config.ciclos - 1)
          : ciclosIntervaloCurto,

        ciclosIntervaloLongo: 1,

        atividades: semAtividades
          ? []
          : atividadesSelecionadas.map(a => ({
            idAtividade: a.idAtividade,
            foco: a.foco,
            ciclos: a.ciclos,
            nomeAtividade: a.nomeAtividade
          }))
      };

      console.log("📦 PATCH /iniciar body:", body);
      await api.patch(`/pomodoro/${sessao}/iniciar`, body);

      console.log("✅ Sessão iniciada com sucesso!");
      setSessaoIniciada(true);
      setAtivo(true);

      try {
        const res = await api.get(`/pomodoro/ultima`);
        const dados = res.data;

        const atividadesBanco = await listarAtividadesSessao(sessao);
        const novasAtividades = atividadesBanco.map(a => ({
          ...a,
          foco: a.foco ? Number(a.foco) : 25,
          ciclos: a.ciclos ? Number(a.ciclos) : 1
        }));
        setAtividadesSelecionadas(novasAtividades);

        const converterTempoParaMinutos = (tempoStr, padrao) => {
          if (!tempoStr) return padrao;

          if (typeof tempoStr === "number") return tempoStr;

          try {
            const parsed = JSON.parse(tempoStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return Number(parsed[0]) || padrao;
            }
            if (typeof parsed === "number") return parsed;
          } catch (err) {
          }

          const partes = tempoStr.split(":").map(Number);
          if (partes.length === 3) {
            const [h, m, s] = partes;
            return h * 60 + m + (s > 0 ? 1 : 0);
          }

          const n = parseInt(tempoStr);
          return !Number.isNaN(n) ? n : padrao;
        };

        if (novasAtividades.length > 0) {
          const primeira = novasAtividades[0];
          setConfig(prev => ({
            ...prev,
            foco: (primeira.foco || 25) * 60,
            ciclos: lerCiclosDoBackend(dados.ciclosFoco, 4),
            curto: converterTempoParaMinutos(dados.duracaoIntervaloCurto, 5) * 60,
            longo: converterTempoParaMinutos(dados.duracaoIntervaloLongo, 15) * 60,
          }));
          setTempo((primeira.foco || 25) * 60);
        } else {
          setConfig(prev => ({
            ...prev,
            foco: converterTempoParaMinutos(dados.duracaoFoco, 25) * 60,
            curto: converterTempoParaMinutos(dados.duracaoIntervaloCurto, 5) * 60,
            longo: converterTempoParaMinutos(dados.duracaoIntervaloLongo, 15) * 60,
            ciclos: lerCiclosDoBackend(dados.ciclosFoco, 4),
          }));
          setTempo(converterTempoParaMinutos(dados.duracaoFoco, 25) * 60);
        }

        console.log("🔁 Sessão atualizada após iniciar:", dados);
      } catch (err) {
        console.error("Erro ao atualizar sessão após iniciar:", err);
      }

    } catch (err) {
      console.error("❌ Erro ao iniciar pomodoro:", err);
    }
  };

  const handleExcluirAtividade = (idAtividade) => {
    console.log("exluir clicado")
    const novasAtivs = atividadesSelecionadas.filter(a => a.idAtividade !== idAtividade);

    setAtividadesSelecionadas(novasAtivs);

    if (idSessao) {
      salvarAtividadesSessao(idSessao, novasAtivs);
    } else {
      setSessaoTemplate(prev => ({ ...prev, atividadesSelecionadas: novasAtivs }));
    }
  };

  const temAtividades = atividadesSelecionadas.length > 0;

  const totalFocos = duracoesPorCiclo.length > 0
    ? duracoesPorCiclo.filter(d => d.tipo === "foco").length
    : config.ciclos;

  const cicloAtual = duracoesPorCiclo.length > 0
    ? Math.max(0, duracoesPorCiclo.slice(0, indiceCicloGlobal).filter(d => d.tipo === "foco").length)
    : 0;

  const isAtividadeConcluida = (atividade) => {
    if (!atividade || !duracoesPorCiclo) return false;

    const focosPassados = duracoesPorCiclo
      .slice(0, indiceCicloGlobal)
      .filter(d => d.tipo === 'foco')
      .length;

    return focosPassados >= (atividade.ciclos || 1);
  };

  const togglePlayPause = async () => {
    console.log("🟨 togglePlayPause — ativo:", ativo);
    if (!ativo) {
      console.log("🟢 Iniciando play...");
      await handlePlay();
    } else {
      console.log("⏸️ Pausando...");
      setAtivo(false);
    }
  };

  return (
    <Background>
      <Container>
        <Principal>
          <Intervalos>
            <Intervalo $ativo>
              {modo === 'foco' && 'Foco'}
              {modo === 'curto' && 'Intervalo Curto'}
              {modo === 'longo' && 'Intervalo Longo'}
            </Intervalo>
          </Intervalos>
          <ParteTempo>
            <Cronometro>
              <Circulo>
                <p id="ciclos">{totalFocos > 0 ? `${cicloAtual} / ${totalFocos}` : "0 / 0"}</p>
                <p id="tempo">{formatarTempo(tempo)}</p>
                <span className="material-symbols-outlined" onClick={togglePlayPause}>
                  {ativo ? 'pause' : 'play_arrow'}
                </span>

              </Circulo>
              <Reiniciar onClick={reiniciar}>
                <span className="material-symbols-outlined">replay</span>
              </Reiniciar>
              <Pular onClick={pularIntervalo} style={{ marginTop: '1rem' }}>
                <span className="material-symbols-outlined">fast_forward</span>
              </Pular>
            </Cronometro>

            <Configuracoes>
              <TituloConfiguracoes>Configurações</TituloConfiguracoes>
              <OpcoesConfiguracoes>
                <OpcaoFoco>
                  <FocoDuracao>
                    Foco
                    <input
                      type="number"
                      min="1"
                      name="foco"
                      value={temAtividades ? "" : Math.floor(config.foco / 60)}
                      onChange={handleConfigChange}
                      disabled={temAtividades}
                    />
                  </FocoDuracao>
                  <FocoQtde>
                    Ciclos
                    <input
                      type="number"
                      min="1"
                      name="ciclos"
                      value={temAtividades ? "" : config.ciclos}
                      onChange={handleConfigChange}
                      disabled={temAtividades}
                    />
                  </FocoQtde>
                </OpcaoFoco>
                <OpcaoCurto>
                  Intervalo Curto
                  <input type="number" min="1" name="curto" value={Math.floor(config.curto / 60)} onChange={handleConfigChange} />
                </OpcaoCurto>
                <OpcaoLongo>
                  Intervalo Longo
                  <input type="number" min="1" name="longo" value={Math.floor(config.longo / 60)} onChange={handleConfigChange} />
                </OpcaoLongo>
              </OpcoesConfiguracoes>
            </Configuracoes>
          </ParteTempo>
        </Principal>

        <Atividades>
          <h1>Atividades</h1>
          <Lista>
            {atividadesSelecionadas.map((a, index) => (
              <Atividade
                key={a.idAtividade || index}
                onMouseEnter={() => setHoverAtividade(prev => ({ ...prev, [a.idAtividade]: true }))}
                onMouseLeave={() => setHoverAtividade(prev => ({ ...prev, [a.idAtividade]: false }))}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '20px', cursor: 'default' }}
                >
                  {isAtividadeConcluida(a) ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>

                {a.nomeAtividade || "Sem nome"}

                {hoverAtividade[a.idAtividade] && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto', marginRight: '4vh', alignItems: 'center' }}>
                    Foco:
                    <input
                      type="number"
                      min="1"
                      name="foco"
                      value={a.foco || 25}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setAtividadesSelecionadas(prev =>
                          prev.map(ativ => ativ.idAtividade === a.idAtividade ? { ...ativ, foco: value } : ativ)
                        );
                      }}
                      style={{ width: '6vh', padding: '2px' }}
                    />
                    Ciclos:
                    <input
                      type="number"
                      min="1"
                      name="ciclos"
                      value={a.ciclos || 1}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setAtividadesSelecionadas(prev =>
                          prev.map(ativ => ativ.idAtividade === a.idAtividade ? { ...ativ, ciclos: value } : ativ)
                        );
                      }}
                      style={{ width: '6vh', padding: '2px' }}
                    />
                  </div>
                )}

                <span className="material-symbols-outlined btn-excluir" onClick={() => handleExcluirAtividade(a.idAtividade)}>
                  delete
                </span>
              </Atividade>
            ))}
          </Lista>

          <Adicionar onClick={abrirModal}>Adicionar atividade</Adicionar>
        </Atividades>
      </Container>

      <ModalAtividades
        aberto={modalAberto}
        onFechar={fecharModal}
        atividades={atividades}
        onAdicionar={adicionarAtividadeSessao}
      />
    </Background>
  );
}

export default Pomodoro;
