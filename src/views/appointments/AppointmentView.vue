<script setup>
  import { formatCurrency } from '@/helpers';
  import { useAppointmentsStore } from '@/stores/appoinments ';
  import SelectedService from '@/components/SelectedService.vue';
  import VueTailwindDatePicker from 'vue-tailwind-datepicker'
  
  import { ref } from 'vue'

  const appoinments = useAppointmentsStore()

  const formatter = ref({
    date: 'DD/MM/YYYY',
  })

  const disableDate = (date) => { // Se le pasa la fecha en automatico, es la fecha del calendario
    const today = new Date()
    return date < today || date.getMonth() > today.getMonth() + 1 || [0,6].includes(date.getDay())
    
  }
</script>
<template>
  <h2 class="text-4xl font-extrabold text-white">Detalles Cita y Resumen</h2>
  <p class="text-white text-lg">A continuación verifica la información y confirma tu cita</p>

  <h3 class="text-3xl font-extrabold text-white">Servicios</h3>

  <p v-if="appoinments.noServicesSelected" class="text-white text-2xl text-center">No hay servicios seleccionados</p>

  <div v-else class="grid gap-5">
    <SelectedService 
      v-for="service in appoinments.services"
      :key="service._id"
      :service="service"
    />

    <p class="text-right text-white text-2xl">
      Total a pagar: 
      <span class="font-black">{{ formatCurrency(appoinments.totalAmount) }}</span>
    </p>
  </div>

  <div class="space-y-8" v-if="!appoinments.noServicesSelected">
    <h3 class="text-3xl font-extrabold text-white">Fecha y Hora</h3>

    <div class="lg:flex gap-5 items-center">
      <div class="w-full lg:w-96 bg-white flex justify-center rounded-lg">
        <VueTailwindDatePicker
          :disable-date="disableDate"
          disable-in-range
          i18n="es-mx"
          as-single
          no-input
          :formatter="formatter"
          v-model="appoinments.date"
        />

      </div>
      <div v-if="appoinments.isDateSelected" class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-5 mt-10 lg:mt-0">
        <button
          v-for="hour in appoinments.hours"
          class="block rounded-lg text-xl font-black p-3 disabled:opacity-10"
          :class="appoinments.time === hour ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'"
          :key="hour"
          @click="appoinments.time = hour"
          :disabled="appoinments.disableTime(hour)"
          >
          {{ hour }}
        </button>
      </div>
    </div>

    <div class="flex justify-end" v-if="appoinments.isValidReservation">
      <button 
        class="w-full md:w-auto bg-blue-500 p-3 rounded-lg uppercase font-black text-white"
        @click="appoinments.saveAppointment"
      >
        Confirmar Reservación
      </button>
    </div>
  </div>


</template>

