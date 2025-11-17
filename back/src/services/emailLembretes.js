import { transporter } from '../config/email.js';
import 'dotenv/config';

export async function enviarEmailNovoLembrete({ nome, email, tipo }) {
  const assunto =
    tipo === 'proximo'
      ? 'Você tem atividades próximas — Kronos'
      : 'Algumas atividades suas expiraram — Kronos';

  const mensagem =
    tipo === 'proximo'
      ? 'Você tem atividades agendadas para amanhã. Acesse o Kronos e confira seus prazos.'
      : 'Algumas de suas atividades expiraram recentemente. Acesse o Kronos e verifique o que precisa ser atualizado.';

  const corBotao = tipo === 'proximo' ? '#FFCC00' : '#B3261E';

  const html = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #ffffff; padding: 40px 30px; color: #333;">
  
    <h2 style="margin: 0 0 20px 0; color: #111; font-weight: 600;">
      Olá, ${nome || 'usuário'}!
    </h2>

    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
      ${mensagem}
    </p>

    <a href="${process.env.APP_BASE_URL}/login?email=${encodeURIComponent(usuario.email)}"
      style="display: inline-block; padding: 12px 24px; background-color: ${corBotao}; color: #ffffff; 
      text-decoration: none; font-weight: 600; border-radius: 6px;">
      Acessar Kronos
    </a>

    <div style="margin-top: 40px; font-size: 13px; color: #555;">
      <p style="margin: 0 0 5px 0;">Equipe Kronos.</p>
      <p style="margin: 0;">Este é um e-mail automático — não responda este e-mail.</p>
    </div>

  </div>
  `;

  await transporter.sendMail({
    from: `Kronos <${process.env.MAIL_USER || 'kronosgestaooo@gmail.com'}>`,
    to: email,
    subject: assunto,
    html,
  });
}
