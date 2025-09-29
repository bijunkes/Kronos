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

function ModalAtividades({ aberto, onFechar, atividades, onAdicionar }) {
  const [ativs, setAtivs] = useState(atividades || []);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
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
      idAtividade: Date.now(), // ID temporário único
      nomeAtividade: novaAtividade,
      prazoAtividade: null,
      concluido: false,
    };

    onAdicionar(nova); // Envia para o Pomodoro
    setNovaAtividade(""); // Limpa o campo
    onFechar(); // Fecha o modal
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
                    onAdicionar(a);        // ✅ Adiciona imediatamente ao Pomodoro
                    setAtividadeSelecionada(null); // limpa seleção
                    onFechar();            // fecha o modal
                  }}

                  style={{
                    backgroundColor: isSelecionada
                      ? 'var(--cinza-claro)'
                      : 'var(--fundo-menu-ativo)',
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
