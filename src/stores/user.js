import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppointmentAPI from '@/api/AppointmentAPI'

export const useUserStore = defineStore('user',() => {

  const user = ref({})
  const router = useRouter()  
  const userAppointments = ref([])   
  const loading = ref(true)   
  
  async function getUserAppointments() {
    const { data } = await AppointmentAPI.getUserAppointments(user.value._id)
    userAppointments.value = data
  }

  function logout() { 
    localStorage.removeItem('AUTH_TOKEN')
    user.value = {}
    router.push({ name: 'login' })
  }

  const getUserName = computed(() => user.value?.name ? user.value?.name : '')
  const noAppointments = computed(() => userAppointments.value.length === 0)

  return {
    getUserName,
    loading,
    logout,
    noAppointments,
    user,
    userAppointments,
    getUserAppointments
  }
})