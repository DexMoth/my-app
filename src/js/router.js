import LoginPage from '@/pages/LoginPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import EditProfile from '@/pages/EditProfile.vue'
import MainPage from '@/pages/MainPage.vue'
import EditStudent from '@/pages/EditStudent.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfilePage
    },
    {
      path: '/profile/edit',
      name: 'EditProfile',
      component: EditProfile
    },
    {
      path: '/',
      name: 'Main',
      component: MainPage
    },
    {
      path: '/students/create',
      name: 'CreateStudent',
      component: EditStudent
    },
    {
      path: '/students/:id/edit',
      name: 'EditStudent',
      component: EditStudent
    },
    ]

const router = createRouter({
    history: createWebHistory(),
    routes
    })
    
export default router