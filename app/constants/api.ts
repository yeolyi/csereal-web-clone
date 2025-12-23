// const PROD_API_BASE = 'https://cse.snu.ac.kr/api';
const PROD_API_BASE = 'https://168.107.16.249.nip.io/api';
// In dev, route API calls through Vite's proxy to avoid CORS.
export const BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api'
  : PROD_API_BASE;
