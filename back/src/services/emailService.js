import { transporter } from '../config/email.js';
import { signVerifyToken } from './verifyToken.js';
import 'dotenv/config';

export async function enviarEmailVerificacaoCadastro({ username, nome, email, senhaHash, icon }) {
  const token = signVerifyToken({
    username, nome, email, senhaHash, icon,
    iat_ms: Date.now(), 
  });

  const link = `${process.env.APP_BASE_URL}/verificar-email?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Confirme seu cadastro - Kronos',
    html: `
      <h2>Olá, ${nome || username}!</h2>
      <p>Para concluir seu cadastro no <b>Kronos</b>, confirme seu email:</p>
      <p><a href="${link}">Confirmar meu email</a></p>
      <p>Este link expira em ${process.env.EMAIL_VERIFY_EXP_MIN || 60} minutos.</p>
    `,
  });
}
