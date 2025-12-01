import { useEffect, useState } from "react";
import {
    Overlay,
    ContainerLista,
    ModalHeader,
    Conteudo,
    AreaAtividades,
    Atividade,
    Prazo,
    Pesquisar,
    Input,
} from "./styles";

import { listarAtividades } from "../../services/api";

export default function ModalTodasAtividades({
    aberto,
    onFechar,
    onSelecionarAtividade,
    atividadesJaSelecionadas = []
}) {
    const [atividades, setAtividades] = useState([]);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        if (!aberto) return;

        async function carregar() {
            try {
                const response = await listarAtividades();
                setAtividades(response);
            } catch (e) {
                console.error("Erro ao buscar atividades:", e);
            }
        }

        carregar();
    }, [aberto]);

    if (!aberto) return null;

    // 🔥 Remover do modal as atividades já selecionadas
    const idsJaSelecionados = new Set(
        atividadesJaSelecionadas.map(a => a.idAtividade)
    );

    const filtradas = atividades
        .filter(a => !idsJaSelecionados.has(a.idAtividade)) // ← remove já adicionadas
        .filter(a =>
            a.nomeAtividade.toLowerCase().includes(filtro.toLowerCase())
        );

    return (
        <Overlay>
            <ContainerLista>
                <ModalHeader style={{ cursor: "default" }}>
                    Atividades
                    <span className="material-symbols-outlined" onClick={onFechar}>
                        close
                    </span>
                </ModalHeader>

                <Conteudo>
                    <AreaAtividades>
                        {filtradas.map(a => (
                            <Atividade
                                key={a.idAtividade}
                                onClick={() => onSelecionarAtividade(a)}
                                style={{ cursor: "pointer" }}
                            >
                                <div>{a.nomeAtividade}</div>
                                <Prazo>
                                    {a.prazoAtividade
                                        ? new Date(a.prazoAtividade.replace(" ", "T")).toLocaleDateString()
                                        : "Sem prazo"}
                                </Prazo>
                            </Atividade>
                        ))}

                        {filtradas.length === 0 && (
                            <p style={{ textAlign: "center", opacity: 0.6 }}>
                                Nenhuma atividade disponível
                            </p>
                        )}
                    </AreaAtividades>
                </Conteudo>

                <Pesquisar>
                    <span className="material-symbols-outlined" style={{ cursor: "default" }}>
                        search
                    </span>

                    <Input
                        type="text"
                        placeholder="Pesquisar..."
                        value={filtro}
                        onChange={e => setFiltro(e.target.value)}
                    />
                </Pesquisar>
            </ContainerLista>
        </Overlay>
    );
}
