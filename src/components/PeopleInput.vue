<template>
  <div class="space-y-2">
    <div class="flex gap-2">
      <input v-model="name" @keyup.enter="handleAdd" placeholder="Ange namn"
        class="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button @click="handleAdd"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200">
        Lägg till
      </button>
    </div>
    <ul class="list-disc pl-5 text-sm text-gray-300">
      <li v-for="(p, i) in people" :key="i">{{ p }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScheduler } from '../composables/useScheduler'

const { people, addPerson } = useScheduler()
const name = ref('')
function handleAdd() {
  if (name.value.trim()) {
    addPerson(name.value)
    name.value = ''
  }
}
</script>