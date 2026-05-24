import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import EditProfile from '@/pages/EditProfile.vue'
import MainPage from '@/pages/MainPage.vue'
import EditStudent from '@/pages/EditStudent.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/js/auth'

const routes = [
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage,
      meta: { requiresAuth: false }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfilePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/edit',
      name: 'EditProfile',
      component: EditProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'Main',
      component: MainPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/students/create',
      name: 'CreateStudent',
      component: EditStudent,
      meta: { requiresAuth: true }
    },
    {
      path: '/students/:id/edit',
      name: 'EditStudent',
      component: EditStudent,
      meta: { requiresAuth: true }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    if (to.meta.requiresAuth) {
        if (!authStore.isAuthenticated) {
            await authStore.checkAuth()
        }
        if (!authStore.isAuthenticated) {
            next('/login')
            return
        }
    }
    
    if (to.path === '/login' && authStore.isAuthenticated) {
        next('/')
        return
    }
    next()
})

export default router