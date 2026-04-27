import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET || 'supersecretjwtkey';
console.log('Using secret:', secret);

const payload = { id: 'test-id', role: 'USER' };
const token = jwt.sign(payload, secret, { expiresIn: '1d' });
console.log('Generated token:', token);

try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded successfully:', decoded);
} catch (err) {
  console.error('Verification failed:', err.message);
}
