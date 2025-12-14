/**
 * API Configuration
 * 
 * In development: Uses proxy from package.json (http://localhost:4000)
 * In production: Uses environment variable REACT_APP_API_URL
 */

export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const config = {
    apiUrl: API_BASE_URL,
};

export default config;
