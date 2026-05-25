<template>
    <div class="container mt-4">
        <h2>Группы</h2>
        
        <div class="row mt-3 mb-2" v-if="authStore.isAdmin">
            <input
                    type="text" 
                    class="form-control" 
                    v-model="searchText" 
                    placeholder="Поиск по названию..."
            >
            <button class="btn btn-sm btn-primary col-auto" @click="searchGroups">Найти</button>
            <div class="col-auto">
                <button class="btn btn-primary" @click="addGroup">Добавить группу</button>
            </div>
        </div>
        
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Кол-во студентов</th>
                    <th v-if="authStore.isAdmin"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="g in groups" :key="g.id">
                    <td>{{ g.id }}</td>
                    <td>{{ g.name }}</td>
                    <td>{{ g.students?.length || 0 }}</td>
                    <td v-if="authStore.isAdmin">
                        <button class="btn btn-sm" @click="deleteGroup(g.id)">Удалить</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ApiService from '../js/api_service'
import { useAuthStore } from '../js/auth'

const authStore = useAuthStore()
const groups = ref([])
const allGroups = ref([]) 
const searchText = ref('')
const isSearching = ref(false)

const displayedGroups = computed(() => {
    return filterByCount(groups.value)
})

const searchGroups = () => {
    if (!searchText.value.trim()) {
        groups.value = allGroups.value
        isSearching.value = false
        return
    }
    
    const search = searchText.value.toLowerCase()
    groups.value = allGroups.value.filter(g => 
        g.name.toLowerCase().includes(search)
    )
    isSearching.value = true
}

const resetSearch = () => {
    searchText.value = ''
    groups.value = allGroups.value
    isSearching.value = false
}

const loadGroups = async () => {
    allGroups.value = await ApiService.loadGroups()
    groups.value = [...allGroups.value]
}

const addGroup = () => {
    const name = prompt('Введите название группы:')
    if (name) {
        ApiService.createGroup({ name }).then(() => {
            loadGroups()
            resetSearch()
        })
    }
}

const deleteGroup = async (id) => {
    if (confirm('Удалить группу?')) {
        await ApiService.deleteGroup(id)
        loadGroups()
        resetSearch()
    }
}

onMounted(() => {
    loadGroups()
})
</script>