let clientes = [];

export function eventosLembretes(req, res) {
  const username = req.usuarioUsername;

  if (!username) {
    res.write(
      `event: erro\ndata: ${JSON.stringify({ error: "Usuário não autenticado na conexão SSE" })}\n\n`
    );
    return res.end();
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  if (res.flushHeaders) {
    res.flushHeaders();
  }

  res.write("event: ping\ndata: conectado\n\n");

  clientes.push({ username, res });

  console.log(`SSE conectado: ${username}. Total de clientes: ${clientes.length}`);

  req.on("close", () => {
    clientes = clientes.filter((c) => c.res !== res);
    console.log(`SSE desconectado: ${username}. Total de clientes: ${clientes.length}`);
  });
}

export function enviarEventoLembreteCriado(lembrete) {
  if (!lembrete || !lembrete.Usuarios_username) {
    console.warn("enviarEventoLembreteCriado chamado sem Usuarios_username:", lembrete);
    return;
  }

  const alvo = lembrete.Usuarios_username;

  clientes
    .filter((c) => c.username === alvo)
    .forEach((cliente) => {
      cliente.res.write(
        `event: lembreteCriado\ndata: ${JSON.stringify(lembrete)}\n\n`
      );
    });

  console.log(
    `Evento lembreteCriado enviado para ${alvo} (conexões ativas: ${clientes.length})`
  );
}

export { clientes };
