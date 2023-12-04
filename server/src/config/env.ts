import { config } from 'dotenv'
config();

export const secretKey = process.env.SECRET_KEY || 'your-secret-key';
export const databaseURL = process.env.DB_URL;
export const port = process.env.PORT || 4000;
export const tokenSecret = process.env.TOKEN_SECRET || 'asdfghjkl';