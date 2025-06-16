<template>
  <div class="space-y-2">
    <div class="flex gap-2">
      <input v-model="activity" @keyup.enter="handleAdd" placeholder="Ange aktivitet"
        class="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      <button @click="handleAdd"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200">
        Lägg till
      </button>
    </div>
    <ul class="list-disc pl-5 text-sm text-gray-300">
      <li v-for="(a, i) in activities" :key="i">{{ a }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScheduler } from '../composables/useScheduler'

const { activities, addActivity } = useScheduler()
const activity = ref('')
function handleAdd() {
  if (activity.value.trim()) {
    addActivity(activity.value)
    activity.value = ''
  }
}
</script>