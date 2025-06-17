<template>
  <div class="space-y-2">
    <label for="teams" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Antal lag:</label>
    <input id="teams" type="number" v-model.number="numberOfTeams" min="1" required
      class="w-full px-3 py-2 rounded-lg bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      <p v-if="teamError" class="text-red-500 text-sm mt-1">{{ teamError }}</p>
  </div>
</template>

<script setup lang="ts">
import { useScheduler } from '../composables/useScheduler'
const { numberOfTeams, teamError } = useScheduler()

</script>