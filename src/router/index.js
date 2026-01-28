import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../Layouts/MainLayouts.vue'
import Dashboard from '../Components/Dashboard.vue'
import PostManager from '../Components/PostManager.vue'
import RevenueReport from '../Components/RevenueReport.vue'
import SalesTeam from '../Components/SalesTeam.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Dashboard },
      { path: 'posts', component: PostManager },
      { path: 'revenue', component: RevenueReport },
      { path: 'team', component: SalesTeam }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
