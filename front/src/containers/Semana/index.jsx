import React, { useEffect, useRef, useState } from 'react'; 
import {
  Background,
  SemanaScroll,
  DiaColuna
} from './styles.js';
import { listarTodasAtividades } from '../../services/api.js';
import api from '../../services/api.js';
import ModalCriarAtividade from '../ModalCriarAtividade'; // 🔹 modal ajustado

function Semana() {
  const [dias, setDias] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    gerarDiasSemana();
    carregarAtividades();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [dias]);

  const gerarDiasSemana = () => {
    const hoje = new Date();
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() + i);
      arr.push({
        iso: d.toISOString().split('T')[0],
        nome: d.toLocaleDateString('pt-BR', { weekday: 'long' })
      });
    }
    setDias(arr);
  };

  const carregarAtividades = async () => {
    try {
      const todas = await listarTodasAtividades();
      setAtividades(todas || []);
    } catch (err) {
      console.error(err);
    }
  };

  const concluirAtividade = async (idAtividade, statusAtual) => {
    try {
      await api.put(`/atividades/${idAtividade}`, {
        statusAtividade: statusAtual === 1 ? 0 : 1
      });
      carregarAtividades();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAtividadeCriada = () => {
    carregarAtividades();
    setModalAberto(false);
    setDiaSelecionado(null);
  };

  const atividadesPorDia = (iso) =>
    atividades.filter(a => a.prazoAtividade?.split('T')[0] === iso);

  return (
    <Background>
      <SemanaScroll ref={scrollRef}>
        {dias.map(d => (
          <DiaColuna key={d.iso}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3 style={{color:'var(--cor-texto)'}}>
                {d.nome.charAt(0).toUpperCase()+d.nome.slice(1)}
              </h3>
              <span
                className="material-symbols-outlined"
                style={{cursor:'pointer'}}
                onClick={() => {
                  setDiaSelecionado(d.iso);
                  setModalAberto(true);
                }}
              >
                add
              </span>
            </div>

            <div style={{
              flex:1,
              display:'flex',
              flexDirection:'column',
              justifyContent:'flex-start',
              alignItems:'center',
              color:'#999',
              marginTop:'1vh'
            }}>
              {atividadesPorDia(d.iso).length === 0
                ? 'Sem atividades'
                : atividadesPorDia(d.iso).map(a => (
                    <div key={a.idAtividade} style={{width:'100%', marginBottom:12}}>
                      <div
                        style={{
                          display:'flex',
                          justifyContent:'space-between',
                          alignItems:'center',
                          background:'var(--fundo-menu-ativo)',
                          padding:'12px 16px',
                          borderRadius:10,
                          cursor:'pointer'
                        }}
                      >
                        <div
                          style={{display:'flex', gap:10, alignItems:'center'}}
                          onClick={() => concluirAtividade(a.idAtividade, a.statusAtividade)}
                        >
                          <span className="material-symbols-outlined">
                            {a.statusAtividade===1 ? 'radio_button_checked':'radio_button_unchecked'}
                          </span>
                          <span>{a.nomeAtividade}</span>
                        </div>
                        <div style={{color:'#bbb'}}>
                          {a.prazoAtividade
                            ? new Date(a.prazoAtividade.replace(' ','T')).toLocaleDateString()
                            : 'Sem prazo'}
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>
          </DiaColuna>
        ))}
      </SemanaScroll>

      {modalAberto && (
        <ModalCriarAtividade
          isOpen={modalAberto}
          onClose={() => {
            setModalAberto(false);
            setDiaSelecionado(null);
          }}
          onAtividadeCriada={handleAtividadeCriada}
          listaId={null}
          dataSelecionada={diaSelecionado} // 🔹 passa a data do dia clicado
        />
      )}
    </Background>
  );
}

export default Semana;
