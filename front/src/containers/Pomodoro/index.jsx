import React, { useEffect, useState } from 'react';
import { Background, Container, Intervalos, Intervalo, Principal, ParteTempo, Cronometro, Circulo, Reiniciar, Pular, Configuracoes, TituloConfiguracoes, OpcoesConfiguracoes, OpcaoFoco, FocoDuracao, FocoQtde, OpcaoCurto, OpcaoLongo, Atividades, Atividade, Adicionar, Lista } from './styles';
import ModalAtividades from '../ModalAtividades';
import { listarTodasAtividades, listarAtividadesSessao, salvarAtividadesSessao } from '../../services/api.js';

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

  const idSessao = 1;

  const [atividades, setAtividades] = useState([]);
  const [atividadesSelecionadas, setAtividadesSelecionadas] = useState([]);

  const atividadeAtual = atividadesSelecionadas[indiceCicloGlobal] || null;

  const [modalAberto, setModalAberto] = useState(false);
  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const [hoverAtividade, setHoverAtividade] = useState({});
  const [trocaAutomatica, setTrocaAutomatica] = useState(true);

  useEffect(() => {
    const carregarAtividades = async () => {
      try {
        const atividadesSessao = await listarAtividadesSessao(idSessao);
        const todasAtividades = await listarTodasAtividades();

        const atividadesComNome = atividadesSessao.map(a => {
          const atividadeCompleta = todasAtividades.find(t => t.idAtividade === a.idAtividade);
          return {
            ...a,
            nomeAtividade: a.nomeAtividade || atividadeCompleta?.nomeAtividade || "Sem nome",
            concluido: a.concluido ?? false
          };
        });

        setAtividadesSelecionadas(atividadesComNome);
      } catch (err) {
        console.error("Erro ao carregar atividades da sessão:", err);
      }
    };

    carregarAtividades();
  }, []);

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
    if (!ativs || ativs.length === 0) return [];
    const maxCiclos = Math.max(...ativs.map(a => a.ciclos || 1));
    const sequencia = [];

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


  const handleFimGlobal = () => {
    const proximo = indiceCicloGlobal + 1;

    if (proximo < duracoesPorCiclo.length) {
      setIndiceCicloGlobal(proximo);
      const proxEtapa = duracoesPorCiclo[proximo];
      setModo(proxEtapa.tipo);
      setTempo(proxEtapa.duracao);
      if (trocaAutomatica) setAtivo(true);
    } else {
      setAtivo(false);
      setTempo(0);
      setModo("foco");
      setIndiceCicloGlobal(duracoesPorCiclo.length - 1);
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
    const novasAtivs = [...atividadesSelecionadas, { ...atividade, concluido: false }];
    setAtividadesSelecionadas(novasAtivs);
    try { await salvarAtividadesSessao(idSessao, novasAtivs); }
    catch (err) { console.error("Erro ao salvar atividades da sessão:", err); }
  };

  const handleExcluirAtividade = async (idAtividade) => {
    const novasAtivs = atividadesSelecionadas.filter(a => a.idAtividade !== idAtividade);
    setAtividadesSelecionadas(novasAtivs);
    try { await salvarAtividadesSessao(idSessao, novasAtivs); }
    catch (err) { console.error("Erro ao excluir atividade da sessão:", err); }
  };

  const temAtividades = atividadesSelecionadas.length > 0;

  const totalFocos = duracoesPorCiclo.length > 0
    ? duracoesPorCiclo.filter(d => d.tipo === "foco").length
    : config.ciclos;

  const cicloAtual = duracoesPorCiclo.length > 0
    ? Math.max(
      0,
      duracoesPorCiclo.slice(0, indiceCicloGlobal).filter(d => d.tipo === "foco").length
    )
    : 0;

  const isAtividadeConcluida = (atividade) => {
    if (!atividade || !duracoesPorCiclo) return false;

    // Conta quantos ciclos de foco já passaram até o ciclo atual
    const focosPassados = duracoesPorCiclo
      .slice(0, indiceCicloGlobal)
      .filter(d => d.tipo === 'foco')
      .length;

    // Considera concluído se todos os ciclos da atividade foram passados
    return focosPassados >= (atividade.ciclos || 1);
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
                <span className="material-symbols-outlined" onClick={() => setAtivo(!ativo)}>
                  {ativo ? 'pause' : 'play_arrow'}
                </span>
              </Circulo>
              <Reiniciar onClick={reiniciar}>
                <span className="material-symbols-outlined">replay</span>
              </Reiniciar>
              <Pular onClick={handleFimGlobal} style={{ marginTop: '1rem' }}>
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
                        const { name, value } = e.target;
                        setAtividadesSelecionadas(prev =>
                          prev.map(ativ => ativ.idAtividade === a.idAtividade ? { ...ativ, [name]: parseInt(value) || 1 } : ativ)
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
                        const { name, value } = e.target;
                        setAtividadesSelecionadas(prev =>
                          prev.map(ativ => ativ.idAtividade === a.idAtividade ? { ...ativ, [name]: parseInt(value) || 1 } : ativ)
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
