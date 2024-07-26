import {createRouter, createWebHistory} from 'vue-router'
import GamesView from '@/views/GamesView.vue'
import BookView from '@/views/BookView.vue'
import StatsView from '@/views/StatsView.vue'
import AccountView from '@/views/AccountView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import CreateView from '@/views/auth/CreateView.vue'
import ResetView from '@/views/auth/ResetView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/games',
    },
    {
      path: '/games',
      name: 'GamesView',
      component: GamesView,
    },
    {
      path: '/book',
      name: 'BookView',
      component: BookView,
    },
    {
      path: '/stats',
      name: 'StatsView',
      component: StatsView,
    },
    {
      path: '/account',
      name: 'AccountView',
      component: AccountView,
    },
    {
      path: '/login',
      name: 'LoginView',
      component: LoginView,
    },
    {
      path: '/create',
      name: 'CreateView',
      component: CreateView,
    },
    {
      path: '/reset',
      name: 'ResetView',
      component: ResetView,
    },
  ],
})

export default router
