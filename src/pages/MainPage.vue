<template>
    <div class="container mt-4">
        <h2>Главная страница</h2>
        <div class="row mt-3 mb-2">
            <div class="col-auto">
                <button class="btn btn-primary" @click="addStudent">Добавить студента</button>
            </div>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Группа</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="s in students" :key="s.id">
                    <td>{{ s.id }}</td>
                    <td>{{ s.name }}</td>
                    <td>{{ s.group?.name || '-' }}</td>
                    <td><button @click="editStudent(s.id)">✏️</button></td>
                    <td><button @click="deleteStudent(s.id)">🗑️</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ApiService from '../js/api_service.js'
import router from '../js/router.js'

const students = ref([])
const name = ref('')
const groupId = ref(null)

const loadAll = async () => {
    students.value = await ApiService.loadStudents()
}

const addStudent = () => router.push('/students/create')
const editStudent = (id) => router.push(`/students/${id}/edit`)

const deleteStudent = async (id) => {
    if (confirm('Удалить студента?')) {
        await ApiService.deleteStudent(id)
        loadAll()
    }
}

onMounted(() => {
    loadAll()
})
</script>