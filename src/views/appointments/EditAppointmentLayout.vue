<script setup>
  import { onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router'
  import AppointmentAPI from '@/api/AppointmentAPI';
  import { useAppointmentsStore } from '@/stores/appoinments ';

  const appoinments = useAppointmentsStore()
  const route = useRoute()
  const router = useRouter()

  const { id } = route.params

  onMounted(async () => {
    try {
      const { data } = await AppointmentAPI.getById(id)  
      appoinments.setSelectedAppointment(data)  
    } catch (error) {
      router.push({ name: 'my-appointments' })
    }
  })
</script>

<template>
  Desde Edit
  <nav class="my-5 flex gap-3">
    <RouterLink
      :to="{ name: 'edit-appointment' }"
      class="flex-1 text-center p-3 uppercase font-extrabold hover:bg-blue-700 hover:text-white" 
      :class="route.name === 'edit-appointment' ? 'bg-blue-700 text-white' : 'bg-white text-blue-500'"
    >
      <!-- flex-1 Toma todo el espacio que haya disponible, como hay flex en el padre -->
      Servicios
    </RouterLink>

    <RouterLink
      :to="{ name: 'edit-appointment-details' }"
      class="flex-1 text-center p-3 uppercase font-extrabold hover:bg-blue-700 hover:text-white" 
      :class="route.name === 'edit-appointment-details' ? 'bg-blue-700 text-white' : 'bg-white text-blue-500'"
    >
      <!-- flex-1 Toma todo el espacio que haya disponible, como hay flex en el padre -->
      Cita y Resumen
    </RouterLink>
  </nav>

  <div class="space-y-5">
    <RouterView />
  </div>
</template>
