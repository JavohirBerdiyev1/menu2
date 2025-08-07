import { sign } from '@/lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;
  console.log(req.body);
  
  if (username === 'admin' && password === 'password') {
    const token = sign({ user: 'admin' });
    return res.status(200).json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
}