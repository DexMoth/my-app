<script setup lang="ts"></script>

<template>
  <nav class="navbar navbar-dark bg-primary">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        Хогвартс
      </router-link>
      
      <div class="ms-auto me-3">
        <router-link to="/students" class="btn btn-outline-light me-2">Студенты</router-link>
        <router-link to="/groups" class="btn btn-outline-light me-2">Группы</router-link>
      </div>

      <div v-if="authStore.isAuthenticated" class="ms-auto">
        <router-link to="/profile" class="btn btn-sm btn-outline-light me-1">{{ authStore.currentUser?.name || 'Пользователь' }}</router-link>
        <button @click="logout" class="btn btn-sm btn-outline-light">Выйти</button>
      </div>
      
      <div v-else>
        <router-link to="/login" class="btn btn-sm btn-outline-light">Войти</router-link>
      </div>
    </div>
  </nav>
  <div id="main">
    <RouterView/>
  </div>
</template>

<script setup>
import { useAuthStore } from './js/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  authStore.checkAuth()
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>