<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Aktiviteter</h2>
    <div class="flex gap-2">
      <input v-model="activity" @keyup.enter="handleAdd" placeholder="Ange aktivitet (Lunch, middag, diska osv.)"
        class="flex-1 px-3 py-2 rounded-lg bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-300 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      <button @click="handleAdd"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200">
        Lägg till
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="(a, i) in activities" :key="i"
        class="bg-gray-300 dark:bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300 shadow-sm flex justify-between items-center">
        <span class="truncate">{{ a }}</span>
        <button @click="removeActivity(i)" class="text-red-400 hover:text-red-200 font-bold ml-4">×</button>
      </div>
    </div>
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
function removeActivity(index: number) {
  activities.value.splice(index, 1)
}
</script>