<template>
    <div class="container mt-4">
        <h2>Редактировать профиль</h2>
        <div class="card p-4">
            <div class="mb-3">
                <input type="file" class="form-control" @change="onFileChange" accept="image/*">
                <img v-if="form.avatar" :src="form.avatar" width="100" height="100" style="border-radius: 50%;">
                <div v-else style="width: 100px; height: 100px; background: gray; border-radius: 50%; display: inline-block; line-height: 100px;">
                </div>
            </div>

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
const form = ref({ name: '', email: '', group: null, avatar: '' })

onMounted(async () => {
    groups.value = await ApiService.loadGroups()
    
    if (authStore.currentUser) {
        const student = await ApiService.loadStudent(authStore.currentUser.id)
        form.value = {
            name: student.name,
            email: student.email,
            group: student.group?.id || null,
            avatar: student.avatar || ''
        }
    }
})

const triggerUpload = () => {
    fileInput.value.click()
}

const onFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
        form.value.avatar = event.target.result
    }
    reader.readAsDataURL(file)
}

const save = async () => {
    const updateData = {
        name: form.value.name,
        email: form.value.email,
        group: form.value.group ? { id: form.value.group } : null,
        avatar: form.value.avatar
    }
    
    if (form.value.password) {
        updateData.password = form.value.password
    }
    
    await ApiService.updateStudent(authStore.currentUser.id, updateData)
    
    authStore.currentUser.name = form.value.name
    authStore.currentUser.email = form.value.email
    authStore.currentUser.avatar = form.value.avatar
    
    router.push('/profile')
}

const cancel = () => {
    router.push('/profile')
}
</script>