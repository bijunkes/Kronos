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

function ModalAtividades({ aberto, onFechar, atividades }) {
  const [ativs, setAtivs] = useState(atividades || []);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [filtro, setFiltro] = useState("");

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

  return (
    <Overlay>
      <ContainerLista>
        <ModalHeader>
            Atividades
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
        onClick={() => setAtividadeSelecionada(isSelecionada ? null : a)}
        style={{
          backgroundColor: isSelecionada
            ? 'var(--cinza-claro)'
            : 'var(--fundo-menu-ativo)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '20px', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              toggleConcluido(index);
            }}
          >
            {a.concluido ? 'radio_button_checked' : 'radio_button_unchecked'}
          </span>
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
