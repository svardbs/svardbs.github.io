<template>
  <div v-if="scheduleDays && scheduleDays.length > 0" class="my-6">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Blockera aktivitet</h2>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Välj att blockera en hel dag eller en specifik aktivitet</p>
    <div class="flex gap-4 items-center mb-4">
      <select v-model="blockedDay" class="bg-gray-300 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md">
        <option disabled value="">Välj dag</option>
        <option v-for="day in scheduleDays" :key="day">{{ day }}</option>
      </select>
      <select v-model="blockedActivity" class="bg-gray-300 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md">
        <option disabled value="">Välj aktivitet</option>
        <option v-for="activity in activities" :key="activity">{{ activity }}</option>
      </select>
      <button @click="addBlockedActivity" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">Lägg till</button>
    </div>
    <div v-if="blockedAssignments.length" class="text-sm text-gray-600 dark:text-gray-300">
      <p class="mb-1 font-medium">Blockerade aktiviteter:</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="(entry, index) in blockedAssignments" :key="index"
            class="bg-gray-300 dark:bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300 shadow-sm flex justify-between items-center">
            <span class="truncate">{{ entry.activity ? entry.day + ' - ' + entry.activity : entry.day + ' - Heldag' }}</span>
            <button @click="removeBlockedActivity(index)" class="text-red-400 hover:text-red-200 font-bold ml-4">×</button>
        </div>
      </div>    
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScheduler } from '../composables/useScheduler'
const { activities, blockedAssignments, scheduleDays } = useScheduler()

const blockedDay = ref('')
const blockedActivity = ref('')

function addBlockedActivity() {
  if (blockedDay.value) {
    blockedAssignments.value.push({ day: blockedDay.value, activity: blockedActivity.value })
    blockedDay.value = ''
    blockedActivity.value = ''
  }
}

function removeBlockedActivity(index: number) {
  blockedAssignments.value.splice(index, 1)
}
</script>