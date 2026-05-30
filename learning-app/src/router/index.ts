import { createRouter, createWebHistory } from 'vue-router'

import ChapterView from '@/views/ChapterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ReviewView from '@/views/ReviewView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/chapter/:chapterId', name: 'chapter', component: ChapterView },
    { path: '/review', name: 'review', component: ReviewView },
    { path: '/settings', name: 'settings', component: SettingsView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
