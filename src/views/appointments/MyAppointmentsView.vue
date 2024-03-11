<script setup>
  import { useUserStore } from '@/stores/user';
  import AppointmentsCard from '@/components/AppointmentsCard.vue';
  import { onBeforeMount } from 'vue';
  import AuthAPI from '@/api/AuthAPI'
  const user = useUserStore();

  onBeforeMount(async () => {
    try {
      user.loading = true
      const { data } = await AuthAPI.auth()
      user.user = data
      await user.getUserAppointments()
    } catch (error) {
      console.log(error)
    } finally {
      user.loading = false
    }
  })

</script>



<template>
  <h2 class="text-4xl font-extrabold text-white mt-10">Mis citas</h2>
  <p class="text-white text-lg mt-5">A continuación podrás administrar tus proximas citas</p>
  
  <p v-if="user.loading" class="text-white text-2xl text-center mt-5">Cargando...</p>

  <div v-else>
    <p v-if="user.noAppointments" class="text-white text-2xl text-center mt-5">No tienes proxima cita</p>

    <div class="grid grid-cols-1 gap-5 mt-10">
      <AppointmentsCard
        v-for="appointment in user.userAppointments"
        :key="appointment._id"
        :appointment="appointment"
      />
    </div>
  </div>
</template>
