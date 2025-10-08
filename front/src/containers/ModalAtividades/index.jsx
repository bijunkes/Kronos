import { useState, useEffect } from "react";
import {
  Overlay,
  AreaAtividades,
  Atividade,
  Prazo,
  Input,
  ModalHeader,
  Pesquisar,
  ContainerLista,
  Conteudo,
} from "./styles";
import { salvarAtividadesSessao } from '../../services/api.js';

function ModalAtividades({ aberto, onFechar, atividades, onAdicionar }) {
  const [ativs, setAtivs] = useState(atividades || []);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const idSessao = 1;
  const [filtro, setFiltro] = useState("");
  const [novaAtividade, setNovaAtividade] = useState("");


  useEffect(() => {
    setAtivs(atividades || []);
  }, [atividades]);

  if (!aberto) return null;

  const toggleConcluido = (index) => {
    const novasAtivs = [...ativs];
    novasAtivs[index].concluido = !novasAtivs[index].concluido;
    setAtivs(novasAtivs);
  };

  const atividadesFiltradas = ativs.filter((a) =>
    a.nomeAtividade.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleAdicionarAtividade = () => {
    if (!novaAtividade.trim()) return;

    const nova = {
      idAtividade: Date.now(),
      nomeAtividade: novaAtividade,
      prazoAtividade: null,
      concluido: false,
    };

    onAdicionar(nova);
    setNovaAtividade("");
    onFechar();
  };

  const adicionarAtividadeSessao = async (atividade) => {

    const jaExiste = atividadesSelecionadas.some(a => a.idAtividade === atividade.idAtividade);
    if (jaExiste) return;

    const novasAtivs = [...atividadesSelecionadas, atividade];
    setAtividadesSelecionadas(novasAtivs);

    try {
      await salvarAtividadesSessao(idSessao, novasAtivs);
    } catch (err) {
      console.error("Erro ao salvar atividades da sessão:", err);
    }
  };

  return (
    <Overlay>
      <ContainerLista>
        <ModalHeader>
          Atividades
          <span class="material-symbols-outlined" onClick={onFechar}>
            close
          </span>
        </ModalHeader>
        <Conteudo>
          <AreaAtividades>
            {atividadesFiltradas.length === 0 && (
              <div style={{ padding: '1rem', color: '#999' }}>
                Nenhuma atividade encontrada.
              </div>
            )}

            {atividadesFiltradas.map((a, index) => {
              const isSelecionada = atividadeSelecionada?.idAtividade === a.idAtividade;
              return (
                <Atividade
                  key={a.idAtividade || index}
                  onClick={() => {
                    setAtividadeSelecionada(a);
                    onAdicionar(a);
                    onFechar();
                  }}
                >
                  <div>
                    {a.nomeAtividade}
                  </div>
                  <Prazo>
                    {a.prazoAtividade
                      ? new Date(a.prazoAtividade.replace(' ', 'T')).toLocaleDateString()
                      : 'Sem prazo'}
                  </Prazo>
                </Atividade>
              );
            })}
          </AreaAtividades>

        </Conteudo>
        <Pesquisar>
          <span className="material-symbols-outlined">search</span>
          <Input
            type="text"
            placeholder="Pesquisar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </Pesquisar>

      </ContainerLista>
    </Overlay>
  );
}

export default ModalAtividades;
