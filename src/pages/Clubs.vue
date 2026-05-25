<template>
    <div class="container mt-4">
        <h2>Клубы</h2>
        
        <div class="mb-3">
            <button @click="filter='all'" :class="filter=='all' ? 'btn-primary' : 'btn-outline-primary'" class="btn me-2">Все</button>
            <button @click="filter='my'" :class="filter=='my' ? 'btn-primary' : 'btn-outline-primary'" class="btn">Мои</button>
            <button v-if="authStore.isAdmin" class="btn btn-success ms-2" @click="addClub">+</button>
        </div>
        
        <div class="row">
            <div class="col-md-4 mb-3" v-for="c in list" :key="c.id">
                <div class="card p-3">
                    <h5>{{ c.name }}</h5>
                    <p>Человек: {{ c.students?.length || 0 }}</p>
                    <button v-if="!inMy(c.id)" class="btn btn-sm btn-primary" @click="join(c.id)">Вступить</button>
                    <button v-else class="btn btn-sm btn-danger" @click="leave(c.id)">Выйти</button>
                    <button v-if="authStore.isAdmin" class="btn btn-sm btn-danger ms-2" @click="del(c.id)">Удалить</button>
                </div>
            </div>
            <div v-if="list.length === 0" class="text-center">Нет клубов</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ApiService from '../js/api_service'
import { useAuthStore } from '../js/auth'

const authStore = useAuthStore()
const all = ref([])
const myIds = ref([])
const filter = ref('all')

const list = computed(() => {
    return filter.value === 'my'
    ? all.value.filter(c => myIds.value.includes(c.id))
    : all.value
})

const inMy = (id) => myIds.value.includes(id)

const load = async () => {
    all.value = await ApiService.loadClubs()
    if (authStore.currentUser) {
        const clubs = await ApiService.getStudentClubs(authStore.currentUser.id)
        myIds.value = clubs.map(c => c.id)
    }
}

const join = async (id) => {
    await ApiService.addStudentToClub(authStore.currentUser.id, id)
    await load()
}

const leave = async (id) => {
    await ApiService.removeStudentFromClub(authStore.currentUser.id, id)
    await load()
}

const addClub = () => {
    const name = prompt('Название клуба:')
    if (name) ApiService.createClub({ name }).then(load)
}

const del = async (id) => {
    if (confirm('Удалить?')) await ApiService.deleteClub(id).then(load)
}

onMounted(load)
</script>