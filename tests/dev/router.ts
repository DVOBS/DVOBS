import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: '',
    component: () => import('./views/V3cTest.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
