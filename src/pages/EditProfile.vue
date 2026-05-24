<template>
    <div class="container mt-4">
        <h2>Редактировать профиль</h2>
        
        <div class="card p-4">
            <div class="mb-3">
                <label class="form-label">Имя</label>
                <input class="form-control" v-model="form.name">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input class="form-control" v-model="form.email">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Группа</label>
                <select class="form-select" v-model="form.group">
                    <option :value="null">Без группы</option>
                    <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
                </select>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Новый пароль</label>
                <input type="password" class="form-control" v-model="form.password" placeholder="Оставьте пустым, чтобы не менять">
            </div>
            
            <button class="btn btn-primary" @click="save">Сохранить</button>
            <button class="btn btn-secondary ms-2" @click="cancel">Отмена</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../js/auth'
import ApiService from '../js/api_service'

const router = useRouter()
const authStore = useAuthStore()
const groups = ref([])
const form = ref({ name: '', email: '', group: null, password: '' })

onMounted(async () => {
    groups.value = await ApiService.loadGroups()
    
    if (authStore.currentUser) {
        const student = await ApiService.loadStudent(authStore.currentUser.id)
        form.value = {
            name: student.name,
            email: student.email,
            group: student.group?.id || null,
            password: ''
        }
    }
})

const save = async () => {
    const updateData = {
        name: form.value.name,
        email: form.value.email,
        group: form.value.group ? { id: form.value.group } : null 
    }
    
    if (form.value.password) {
        updateData.password = form.value.password
    }
    
    await ApiService.updateStudent(authStore.currentUser.id, updateData)
    
    authStore.currentUser.name = form.value.name
    authStore.currentUser.email = form.value.email
    
    router.push('/profile')
}

const cancel = () => {
    router.push('/profile')
}
</script>