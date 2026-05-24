<template>
    <div class="container mt-4">
      <h2>{{ isEdit ? 'Редактировать' : 'Создать' }} студента</h2>
      
      <div class="card p-4">
        <div class="mb-3">
          <label class="form-label">Имя</label>
          <input class="form-control" v-model="form.name">
        </div>
        
        <div class="mb-3">
          <label class="form-label">Группа</label>
          <select class="form-select" v-model="form.group">
            <option :value="null">Без группы</option>
            <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Клубы</label>
          <div v-for="c in clubs" :key="c.id" class="form-check">
            <input 
              type="checkbox" 
              class="form-check-input" 
              :value="c.id" 
              v-model="form.clubs"
              :id="'club-' + c.id"
            >
            <label class="form-check-label" :for="'club-' + c.id">
              {{ c.name }}
            </label>
          </div>
        </div>

        <div class="mt-3">
          <button class="btn btn-primary me-2" @click="save">Сохранить</button>
          <button class="btn btn-secondary" @click="cancel">Отмена</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import ApiService from '../js/api_service.js'
  
  const router = useRouter()
  const route = useRoute()
  const isEdit = !!route.params.id
  
  const form = ref({
    name: '',
    group: null,
    clubs: []
  })
  
  const groups = ref([])
  const clubs = ref([])
  
  onMounted(async () => {
    groups.value = await ApiService.loadGroups()
    clubs.value = await ApiService.loadClubs()
    
    if (isEdit) {
      const student = await ApiService.loadStudent(route.params.id)
      form.value = {
        id: student.id,
        name: student.name,
        group: student.group?.id || null,
        clubs: student.clubs?.map(c => c.id) || []
      }
    }
  })
  
  const save = async () => {
    const body = {
      id: form.value.id,
      name: form.value.name,
      group: form.value.group ? { id: form.value.group } : null,
      clubs: form.value.clubs.map(id => ({ id }))
    }
    console.info(form.value)
    if (isEdit) {
      await ApiService.updateStudent(route.params.id, body)
    } else {
      await ApiService.createStudent(body)
    }
    router.push('/')
  }
  
  const cancel = () => {
    router.push('/')
  }
  </script>