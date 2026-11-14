// Central API configuration for Web Client
// In development, defaults to http://localhost:3000
// In production (Render / Vercel), configure VITE_API_BASE_URL in environment settings
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const API_ENDPOINT = `${API_BASE_URL}/api`;
