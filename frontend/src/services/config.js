export default {
  apiBase: 'http://localhost:5000',
  paths: {
    login: '/auth/login',
    register: '/auth/register',
    tareas: '/tarea',
    estadisticas: '/tarea/estadisticas'
  },
  tokenField: 'access_token',
  usuarioField: 'usuario'
};
