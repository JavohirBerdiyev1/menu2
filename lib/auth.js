import crypto from 'crypto';

const secret = process.env.JWT_SECRET || 'secret';

export function sign(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verify(token) {
  if (!token) throw new Error('No token');
  const [header, body, signature] = token.split('.');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  if (signature !== expected) throw new Error('Invalid token');
  return JSON.parse(Buffer.from(body, 'base64url').toString());
}