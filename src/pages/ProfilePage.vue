<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Профиль</h2>
            <router-link to="/profile/edit" class="btn btn-primary">Редактировать</router-link>
        </div>
        <div v-if="authStore.currentUser">
            <p><strong>ID:</strong> {{ authStore.currentUser.id }}</p>
            <p><strong>Имя:</strong> {{ authStore.currentUser.name }}</p>
            <p><strong>Email:</strong> {{ authStore.currentUser.email }}</p>
            <p><strong>Группа:</strong> {{ groupName || 'Не назначена'  }}</p>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '../js/auth'
import { ref, onMounted } from 'vue'
import ApiService from '../js/api_service'

const authStore = useAuthStore()
const groupName = ref('')
const full = ref(null)

onMounted(async () => {
    if (authStore.currentUser) {
        try {
            full.value = await ApiService.loadStudent(authStore.currentUser.id)
            const group = full.value.group
            groupName.value = group.name
            console.info(full.value)
        } catch (error) {
            console.error('Ошибка загрузки группы:', error)
        }
    }
})
</script>