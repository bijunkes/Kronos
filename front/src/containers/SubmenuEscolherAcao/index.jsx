import React, { useEffect, useState } from "react";
import { MenuContainer, MenuItem } from "./styles";

function SubmenuEscolherAcao({ isOpen, onClose, onCriar, onSelecionar, anchorRef }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();

      setPos({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 8 
      });
    }
  }, [isOpen, anchorRef]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 500
        }}
      />

      <MenuContainer style={{ top: pos.top, left: pos.left }}>
        <MenuItem onClick={onCriar}>Criar atividade</MenuItem>
        <MenuItem onClick={onSelecionar}>Adicionar existente</MenuItem>
      </MenuContainer>
    </>
  );
}

export default SubmenuEscolherAcao;
