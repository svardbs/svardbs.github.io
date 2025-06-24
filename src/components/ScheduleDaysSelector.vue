<template>
  <div class="mb-6">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Schemadagar</h2>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Välj vilken veckodag schemat ska börja på och hur många dagar det ska vara</p>
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Start Day Dropdown -->
      <div class="flex-1">
        <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Startdag</label>
        <select
          v-model="scheduleStartDay"
          class="w-full bg-gray-300 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md h-[42px]"
        >
          <option v-for="day in allDays" :key="day" :value="day">{{ day }}</option>
        </select>
      </div>

      <!-- Number of Days Input -->
      <div class="flex-1">
        <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Antal dagar</label>
        <input
          type="number"
          min="1"
          max="28"
          v-model.number="scheduleDayCount"
          class="w-full bg-gray-300 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md h-[42px]"
        />
      </div>
      <div class="flex items-end">
        <button @click="handleAdd"
          class="h-[42px] bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200">
          Lägg till
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScheduler } from '../composables/useScheduler'

// Access state from the composable
const { scheduleStartDay, scheduleDayCount, allDays, getAllDisplayDays } = useScheduler()

function handleAdd() {
  if (scheduleDayCount.value && scheduleStartDay.value) {
    getAllDisplayDays();
  }
}

</script>
