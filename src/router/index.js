import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import RegistroUsuario from '../views/RegistroUsuario.vue';
import EquiposList from '../views/EquiposList.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/signin', name: 'Signin', component: RegistroUsuario },
  { path: '/devices', name: 'Devices', component: EquiposList },
  // Otras rutas
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
