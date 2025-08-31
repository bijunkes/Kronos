import jwt from 'jsonwebtoken';
import 'dotenv/config';

const EXP_MIN = Number(process.env.EMAIL_VERIFY_EXP_MIN || 60);

export function signVerifyToken(payload) {
 
  return jwt.sign(payload, process.env.EMAIL_VERIFY_SECRET, {
    expiresIn: `${EXP_MIN}m`,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);
}
