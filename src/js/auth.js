import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = 'http://localhost:8080/api'

export const useAuthStore = defineStore('auth', () => {
    const currentUser = ref(null)
    const isAuthenticated = ref(false)
    
    const checkAuth = async () => {
        try {
          const response = await fetch(API_URL + '/auth/me', {
            credentials: 'include'
          })
          
          if (response.ok) {
            currentUser.value = await response.json()
            isAuthenticated.value = true
            return true
          } else {
            currentUser.value = null
            isAuthenticated.value = false
            return false
          }
        } catch (error) {
          console.error('checkAuth error:', error)
          currentUser.value = null
          isAuthenticated.value = false
          return false
        }
      }
    
    // Роль пользователя
    const userRole = computed(() => {
        return currentUser.value?.role || 'student'
    })
    
    const isAdmin = computed(() => {
        return userRole.value === 'admin'
    })
    
    const login = async (email, password) => {
        try {
          const response = await fetch(API_URL + '/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',  // ← ВАЖНО!
            body: JSON.stringify({ email, password })
          })
    
          if (response.ok) {
            await checkAuth()
            return { success: true }
          } else {
            const error = await response.json()
            return { success: false, error: error.error || 'Ошибка авторизации' }
          }
        } catch (error) {
          console.error('login error:', error)
          return { success: false, error: 'Ошибка сети' }
        }
      }
    
    const register = async (userData) => {
        try {
            const response = await fetch(API_URL + '/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            })
            
            if (response.ok) {
                const data = await response.json()
                
                localStorage.setItem('token', data.token)
                currentUser.value = data.user
                isAuthenticated.value = true
                
                return { success: true }
            } else {
                const error = await response.json()
                return { success: false, error: error.message || 'Ошибка регистрации' }
            }
        } catch (error) {
            return { success: false, error: 'Ошибка сети' }
        }
    }
    
    const logout = async () => {
        try {
          await fetch(API_URL + '/auth/logout', {
            method: 'POST',
            credentials: 'include'
          })
        } catch (error) {
          console.error('logout error:', error)
        } finally {
          currentUser.value = null
          isAuthenticated.value = false
        }
    }
    
    return {
        currentUser,
        isAuthenticated,
        userRole,
        isAdmin,
        checkAuth,
        login,
        register,
        logout
    }
})