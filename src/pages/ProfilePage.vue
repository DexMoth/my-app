<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Профиль</h2>
            <router-link to="/profile/edit" class="btn btn-primary">Редактировать</router-link>
        </div>
        
        <div v-if="fullStudent">
            <div class="text-center mb-3">
                <img 
                    v-if="fullStudent.avatar" 
                    :src="fullStudent.avatar" 
                    class="rounded-circle" 
                    width="150" height="150"
                    style="object-fit: cover"
                >
                <div v-else class="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center" 
                     style="width:150px;height:150px; font-size:3rem; color:white">
                    =)
                </div>
            </div>
            <p><strong>ID:</strong> {{ fullStudent.id }}</p>
            <p><strong>Имя:</strong> {{ fullStudent.name }}</p>
            <p><strong>Email:</strong> {{ fullStudent.email }}</p>
            <p><strong>Группа:</strong> {{ fullStudent.group?.name || 'Не назначена' }}</p>
        </div>
        
        <div v-else>Загрузка...</div>
    </div>
</template>

<script setup>
import { useAuthStore } from '../js/auth'
import { ref, onMounted } from 'vue'
import ApiService from '../js/api_service'

const authStore = useAuthStore()
const fullStudent = ref(null)

onMounted(async () => {
    if (authStore.currentUser) {
        try {
            // Загружаем полные данные студента (с аватаркой и группой)
            fullStudent.value = await ApiService.loadStudent(authStore.currentUser.id)
            console.info('Загружен студент:', fullStudent.value)
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error)
        }
    }
})
</script>