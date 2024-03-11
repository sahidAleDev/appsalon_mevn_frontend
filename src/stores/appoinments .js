import { defineStore } from 'pinia'
import { computed, ref, onMounted, inject, watch } from 'vue'
import AppointmentAPI from '@/api/AppointmentAPI'
import { convertToISO, convertToDDMMYY } from '@/helpers/date'
import { useRouter } from 'vue-router'
import { useUserStore } from './user'

export const useAppointmentsStore = defineStore('appointments', () => {
  
  const appointmentId = ref('')
  const services = ref([])
  const date = ref('')
  const hours = ref([])
  const time = ref('')
  const appointmentsByDate = ref([])

  const toast = inject('toast')
  const router = useRouter()
  const user = useUserStore()


  onMounted(() => {
    const startHour = 10
    const endHour = 19
    for(let hour = startHour; hour <= endHour; hour++) {
      hours.value.push(hour + ':00')
    }
  })

  const disableTime = computed(() => {
    return (hour) => {
      return appointmentsByDate.value.find(appointment => appointment.time === hour);
    }
  })

  const isServiceSelected = computed(() => {
    return (id) => services.value.some(service => service._id === id) // En los computed tambien se pueden pasar parametros
  })

  const isValidReservation = computed(() => date.value.length && time.value.length && services.value.length)
  const noServicesSelected = computed(() => services.value.length === 0)
  const totalAmount = computed(() => services.value.reduce((acc, service) => acc + service.price, 0))
  const isDateSelected = computed(() => {
    return date.value ? true : false
  })

  function clearAppointmentData() { 
    services.value = []
    date.value = ''
    time.value = ''
    appointmentId.value = ''
  }

  async function saveAppointment() {
    const appointment = { 
      services: services.value.map(service => service._id),  // Se usa map para clonar el array y desaparezac el proxy de vue, para que no se modifique el array original
      date: convertToISO( date.value ),
      time : time.value,
      totalAmount: totalAmount.value
    }

    if(appointmentId.value) {
      try {
      
        const { data } = await AppointmentAPI.update(appointmentId.value, appointment)
        toast.open({
          message: data.msg,
          type: 'success'
        })
        
      } catch (error) {
        console.log(error)
      }

    } else {
      try {
      
        const { data } = await AppointmentAPI.create(appointment)
        toast.open({
          message: data.msg,
          type: 'success'
        })

      } catch (error) {
        console.log(error)
      }
    }

    clearAppointmentData()
    user.getUserAppointments()
    router.push({ name: 'my-appointments' })
  }

  async function cancelAppointment(id) {
    if(confirm('¿Deseas cancelar esta cita?')){
      try {
        const { data } = await AppointmentAPI.delete(id)
        toast.open({
          message: data.msg,
          type: 'success'
        })

        user.userAppointments = user.userAppointments.filter(appointment => appointment._id !== id)
      } catch (error) {
        toast.open({
          message: error.response.data.msg,
          type: 'error'
        })
      }
    }
  }

  function setSelectedAppointment(appointment) { 
    services.value = appointment.services
    const newDate = convertToDDMMYY(appointment.date)
    date.value = newDate
    time.value = appointment.time
    appointmentId.value = appointment._id

  }

  function onServiceSelected(service) {
    if(services.value.some(selectedService => selectedService._id === service._id)) {
      services.value = services.value.filter(selectedService => selectedService._id !== service._id)
    } else {
      if(services.value.length === 2) {
        alert('Máximo 2 servicios por cita')
        return
      }
      services.value.push(service)
    }
  }

  watch(date, async () => {
    time.value = '' // Limpiamos el campo de la hora al cambiar la fecha para que no se mantenga la hora seleccionada
    if(date.value === '') return
    
    const { data } = await AppointmentAPI.getByDate(date.value)
    
    if(appointmentId.value){
      appointmentsByDate.value = data.filter(appointment => appointment._id !== appointmentId.value)
      time.value = data.filter(appointment => appointment._id === appointmentId.value)[0].time
    } else {
      appointmentsByDate.value = data
    }
  })

  return {
    cancelAppointment,
    clearAppointmentData,
    date,
    disableTime,
    hours,
    isDateSelected,
    isServiceSelected,
    isValidReservation,
    noServicesSelected,
    onServiceSelected,
    saveAppointment,
    services,
    setSelectedAppointment,
    time,
    totalAmount,
  }
})