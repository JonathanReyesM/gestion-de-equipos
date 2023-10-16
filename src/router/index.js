import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import RegistroUsuario from '../views/RegistroUsuario.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/RegistroUsuario', name: 'Registrar Nuevo Usuario', component: RegistroUsuario },
  // Otras rutas
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
