import axios from 'axios';
import { API_URL } from '../constants';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
