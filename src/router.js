import { createRouter, createWebHistory } from 'vue-router';
import Inicio from './components/Inicio.vue';
import Pagina2 from './components/Products.vue'; // Asegúrate de tener este componente

const routes = [
  { path: '/', component: Inicio },
  { path: '/otra-pagina', component: Pagina2 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;