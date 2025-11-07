import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Header,
  Aba,
  RelogioWrap,
  Relogio,
  TempoLabel,
  BotoesContainer,
  BotoesColuna,
  Botao,
  Flecha,
  CardFooterSpacer,
} from "./Styles.js";

function CronometroTemporizador() {
  const [abaAtiva, setAbaAtiva] = useState("cronometro");
  const [tempo, setTempo] = useState(0); 
  const [rodando, setRodando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [horas, setHoras] = useState(0);
  const [minutos, setMinutos] = useState(1);
  const [segundos, setSegundos] = useState(0);
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (abaAtiva === "cronometro" && rodando && !pausado) {
      intervaloRef.current = setInterval(() => {
        setTempo((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(intervaloRef.current);
  }, [rodando, pausado, abaAtiva]);

  useEffect(() => {
    if (abaAtiva === "temporizador" && rodando && !pausado) {
      intervaloRef.current = setInterval(() => {
        setTempo((t) => {
          if (t <= 1) {
            clearInterval(intervaloRef.current);
            setRodando(false);
            setPausado(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervaloRef.current);
  }, [rodando, pausado, abaAtiva]);

  const formatarTempo = (segundos) => {
    const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
    const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");
    return `${h} : ${m} : ${s}`;
  };

  const handleComecarPausarRetomar = () => {
    if (!rodando) {
      if (abaAtiva === "temporizador") {
        const totalSegundos = horas * 3600 + minutos * 60 + segundos;
        if (totalSegundos > 0) setTempo(totalSegundos);
      }
      setRodando(true);
      setPausado(false);
    } else if (rodando && !pausado) {
      setPausado(true);
      clearInterval(intervaloRef.current);
    } else if (rodando && pausado) {
      setPausado(false);
    }
  };

  const handleCancelar = () => {
    clearInterval(intervaloRef.current);
    setRodando(false);
    setPausado(false);
    setTempo(0);
  };

  const handleTrocarAba = (novaAba) => {
    clearInterval(intervaloRef.current);
    setRodando(false);
    setPausado(false);
    setAbaAtiva(novaAba);
    setTempo(0);
  };

  const ajustar = (campo, delta) => {
    if (rodando) return;
    if (campo === "horas") setHoras((h) => Math.max(0, h + delta));
    if (campo === "minutos")
      setMinutos((m) => Math.min(59, Math.max(0, m + delta)));
    if (campo === "segundos")
      setSegundos((s) => Math.min(59, Math.max(0, s + delta)));
  };

  return (
    <Container>
      <Card>
        <Header>
          <Aba
            ativo={abaAtiva === "cronometro"}
            onClick={() => handleTrocarAba("cronometro")}
          >
            Cronômetro
          </Aba>
          <Aba
            ativo={abaAtiva === "temporizador"}
            onClick={() => handleTrocarAba("temporizador")}
          >
            Temporizador
          </Aba>
        </Header>

        <RelogioWrap>
          <Relogio>
            {abaAtiva === "temporizador" && !rodando ? (
              <>
                <div className="bloco">
                  <span>{String(horas).padStart(2, "0")}</span>
                  <div className="setas">
                    <Flecha onClick={() => ajustar("horas", 1)}>▲</Flecha>
                    <Flecha onClick={() => ajustar("horas", -1)}>▼</Flecha>
                  </div>
                </div>
                <span className="dois-pontos">:</span>
                <div className="bloco">
                  <span>{String(minutos).padStart(2, "0")}</span>
                  <div className="setas">
                    <Flecha onClick={() => ajustar("minutos", 1)}>▲</Flecha>
                    <Flecha onClick={() => ajustar("minutos", -1)}>▼</Flecha>
                  </div>
                </div>
                <span className="dois-pontos">:</span>
                <div className="bloco">
                  <span>{String(segundos).padStart(2, "0")}</span>
                  <div className="setas">
                    <Flecha onClick={() => ajustar("segundos", 1)}>▲</Flecha>
                    <Flecha onClick={() => ajustar("segundos", -1)}>▼</Flecha>
                  </div>
                </div>
              </>
            ) : (
              <>{formatarTempo(tempo)}</>
            )}
          </Relogio>

          {abaAtiva === "temporizador" && !rodando && (
            <TempoLabel>Defina o tempo e pressione começar</TempoLabel>
          )}

          <BotoesContainer>
            <BotoesColuna>
              <Botao onClick={handleComecarPausarRetomar}>
                {!rodando ? "Começar" : pausado ? "Retomar" : "Pausar"}
              </Botao>
              <Botao cancelar onClick={handleCancelar}>
                Cancelar
              </Botao>
            </BotoesColuna>
          </BotoesContainer>
        </RelogioWrap>

        <CardFooterSpacer />
      </Card>
    </Container>
  );
}

export default CronometroTemporizador;
