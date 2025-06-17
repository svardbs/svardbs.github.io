<template>
    <h2 class="text-xl font-semibold text-center mb-4 text-gray-600 dark:text-gray-300">Lag</h2>  
    <ul class="space-y-2">
        <li v-for="(members, team) in teams" :key="team" class="bg-gray-300 dark:bg-gray-800 p-3 rounded-lg border border-gray-700 relative">
            <strong class="block text-blue-800 dark:text-blue-300">{{ team }}</strong>
        <span class="text-sm text-gray-600 dark:text-gray-300">{{ members.join(', ') }}</span>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { useScheduler } from '../composables/useScheduler'
const {
  teams
} = useScheduler()

</script>