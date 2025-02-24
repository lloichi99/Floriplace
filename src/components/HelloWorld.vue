<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
<div>
  <h1>{{ msg }}</h1>

  <p>
    hola
  </p>
  <p>
   dos 
  </p>
 
  <button
  class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900">
  Button
</button>
<div class="mockup-window bg-base-300 border">
  <div class="bg-base-200 flex justify-center px-4 py-16">Hello!</div>
</div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
