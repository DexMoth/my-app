<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">Регистрация</h4>
            </div>
            <div class="card-body">
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
              
              <div class="mb-3">
                <label class="form-label">Имя</label>
                <input type="text" class="form-control" v-model="name">
              </div>
              
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="email">
              </div>
              
              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input type="password" class="form-control" v-model="password">
              </div>
              
              <button class="btn btn-primary w-100" @click="register" :disabled="loading">
                {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
              </button>
              
              <p class="mt-3 text-center">
                Уже есть аккаунт? <router-link to="/login">Войти</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../js/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')
  
  const register = async () => {
    if (!name.value || !email.value || !password.value) {
      error.value = 'Заполните все поля'
      return
    }
    
    loading.value = true
    error.value = ''
    
    const result = await authStore.register(name.value, email.value, password.value)
    
    if (result.success) {
      router.push('/')
    } else {
      error.value = result.error || 'Ошибка регистрации'
    }
    
    loading.value = false
  }
  </script>