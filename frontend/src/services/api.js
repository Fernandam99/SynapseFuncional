import axios from 'axios';
import cfg from './config';
import { getToken } from './auth';

const api = axios.create({ baseURL: cfg.apiBase, timeout:12000 });

// Use getToken() helper so token access is centralized and avoid issues with timing
api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
