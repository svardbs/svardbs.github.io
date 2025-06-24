<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Personer</h2>
    <div class="flex gap-2">
      <input v-model="name" @keyup.enter="handleAdd" placeholder="Ange namn"
        class="flex-1 px-3 py-2 rounded-lg bg-gray-300 dark:bg-gray-800 placeholder-gray-400 text-gray-600 dark:text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button @click="handleAdd"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200">
        Lägg till
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="(p, i) in people" :key="i" class="bg-gray-300 dark:bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300 shadow-sm flex justify-between items-center">
        <span class="truncate">{{ p }}</span>
        <button @click="removePerson(i)" class="text-red-400 hover:text-red-200 font-bold ml-4">×</button>
      </div>
    </div>
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
function removePerson(index: number) {
  people.value.splice(index, 1)
}
</script>