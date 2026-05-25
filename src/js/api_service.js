const ApiService = {
    
API_URL: "http://192.168.0.12:8080/api",

async loadStudents() {
    try {
        const resp = await fetch(this.API_URL + '/student')
        return await resp.json()
    } catch (err) {
        console.error('Ошибка загрузки студентов', err)
        return []
    }
},

async loadStudent(id) {
    try {
        const resp = await fetch(this.API_URL + '/student/' + id)
        return resp.json();
    } catch (err) {
        console.error('Ошибка загрузки студента', err);
    }
},

async createStudent(data) {
    const res = await fetch(this.API_URL + '/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return res.json()
},

async updateStudent(id, data) {
    const res = await fetch(this.API_URL + '/student/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return res.json()
},

async deleteStudent(id) {
    const res = await fetch(this.API_URL + '/student/' + id, {
        method: 'DELETE'
    })
    return res.ok
},

async loadGroups() {
    try {
        const resp = await fetch(this.API_URL + '/group')
        return await resp.json();
    } catch (err) {
        console.error('Ошибка загрузки групп', err);
        return []
    }
},

async loadGroup(id) {
    try {
        const resp = await fetch(this.API_URL + '/group/' + id)
        return resp.json();
    } catch (err) {
        console.error('Ошибка загрузки группы', err);
    }
},

async createGroup(data) {
    const resp = await fetch(`${this.API_URL}/group`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return resp.json()
},

async deleteGroup(id) {
    const resp = await fetch(`${this.API_URL}/group/${id}`, {
        method: 'DELETE'
    })
    return resp.ok
},

async loadClub(id) {
    try {
        const resp = await fetch(this.API_URL + '/club' + id)
        return resp.json();
    } catch (err) {
        console.error('Ошибка загрузки клуба', err);
        return []
    }
},

async loadClubs() {
    try {
        const resp = await fetch(this.API_URL + '/club')
        return resp.json();
    } catch (err) {
        console.error('Ошибка загрузки клубов', err);
    }
},

async getStudentClubs(studentId) {
    const resp = await fetch(`${this.API_URL}/student/${studentId}/clubs`)
    return resp.json()
},

async addStudentToClub(studentId, clubId) {
    const resp = await fetch(`${this.API_URL}/club/${clubId}/students/${studentId}`,
    {
        method: 'POST'
    })
    return resp.ok
},

async removeStudentFromClub(studentId, clubId) {
    const resp = await fetch(`${this.API_URL}/club/${clubId}/students/${studentId}`, {
        method: 'DELETE'
    })
    return resp.ok
}

}
export default ApiService

export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token')
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    })
    
    if (response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
    }
    
    return response
}