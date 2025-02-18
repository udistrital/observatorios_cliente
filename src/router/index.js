import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView,
  // },
  {
    path: '/espacios',
    name: 'espacios',
    component: () => import('../views/Espacios.vue'),
  },
  {
    path: '/administracion',
    name: 'administracion',
    component: () => import('../views/Administracion.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router