import React from "react";
import LogoKronos from "../../assets/LogoKronos.png";

function Home() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--fundo)", 
      }}
    >
      <img
        src={LogoKronos}
        alt="Logo Kronos"
        style={{
          width: "700px", 
          opacity: 0.1,
          maxWidth: "90%",
        }}
      />
    </div>
  );
}

export default Home;
