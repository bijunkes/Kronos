import { useState } from "react";
import { criarAtividade } from "../../services/api";

function ModalCriarAtividade({ onAtividadeCriada }) {
    const [aberto, setAberto] = useState(false);
    const [nome, setNome] = useState("");
    const [prazo, setPrazo] = useState("");
    const [descricao, setDescricao] = useState("");

    const abrirModal = () => setAberto(true);
    const fecharModal = () => setAberto(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const novaAtividade = await criarAtividade({
                nomeAtividade: nome,
                prazoAtividade: prazo,
                descricaoAtividade: descricao,
            });

            if (onAtividadeCriada) {
                onAtividadeCriada(novaAtividade);
            }

            setNome("");
            setPrazo("");
            setDescricao("");
            fecharModal();
        } catch (err) {
            console.error("Erro ao criar atividade: ", err);
        }
    };

    return (
        <div>
            
        </div>
    );
}

export default ModalCriarAtividade;
