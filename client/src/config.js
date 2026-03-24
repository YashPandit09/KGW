/**
 * API Configuration
 *
 * In development: Uses proxy from package.json (http://localhost:4000)
 * In production: Uses REACT_APP_API_URL when provided.
 * Fallback keeps production functional if env is accidentally missing.
 */
const envApiUrl = process.env.REACT_APP_API_URL?.trim();
const defaultProdApiUrl = 'https://kgw.onrender.com';

export const API_BASE_URL =
    envApiUrl || (process.env.NODE_ENV === 'production' ? defaultProdApiUrl : '');

export const config = {
    apiUrl: API_BASE_URL,
};

export default config;
