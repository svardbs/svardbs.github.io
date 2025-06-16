<template>
  <div class="space-y-2">
    <label for="teams" class="block text-sm font-medium text-gray-300">Antal lag:</label>
    <input id="teams" type="number" v-model.number="numberOfTeams" min="1"
      class="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
  </div>
</template>

<script setup lang="ts">
import { useScheduler } from '../composables/useScheduler'
const { numberOfTeams } = useScheduler()

</script>