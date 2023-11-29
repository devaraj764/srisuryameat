import * as jwt from 'jsonwebtoken';
import { tokenSecret } from '../config/env';

// Function to create a JWT
export function createToken(payload: Record<string, any>, expiresIn: string): string {
  const token = jwt.sign(payload, tokenSecret, { expiresIn });
  return token;
}

// Function to verify a JWT
export function verifyToken(token: string): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, tokenSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as Record<string, any>);
      }
    });
  });
}

export default { createToken, verifyToken };
