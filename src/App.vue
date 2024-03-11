<script setup>
import { RouterView } from 'vue-router'
</script>

<template>

  <div class="md:flex h-screen">
    <div class="h-64 bg-cover bg-center md:h-auto md:w-1/3 bg-app" >


    </div>

    <div class="px-10 py-5 min-h-full overflow-y-scroll md:w-2/3">
      <RouterView />
    </div>
  </div>

  
</template>