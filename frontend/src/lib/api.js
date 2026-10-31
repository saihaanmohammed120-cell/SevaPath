import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const lang = localStorage.getItem('sevapath.lang') || 'en';
  config.params = { ...config.params, lang };
  return config;
});

export const listServices = () => api.get('/services').then((r) => r.data);
export const searchServices = (payload) =>
  api.post('/services/search', payload).then((r) => r.data);
export const getService = (id) =>
  api.get(`/services/${encodeURIComponent(id)}`).then((r) => r.data);
export const checkEligibility = (service_id, answers) =>
  api
    .post('/services/eligibility', { service_id, answers })
    .then((r) => r.data);
export const askCopilot = (payload) =>
  api.post('/copilot', payload).then((r) => r.data);
