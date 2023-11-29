// env exports
export const googleCientId = process.env.GOOGLE_CLIENT_ID || '';
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
export const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
export const localToken = typeof window !== "undefined" ? window.localStorage.getItem('token') : "";