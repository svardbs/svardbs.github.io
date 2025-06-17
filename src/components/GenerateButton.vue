<template>
  <div class="flex flex-col items-center gap-6">
    <button
      @click="generateTeams"
      class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-200"
    >
      Generera lag
    </button>

    <div v-if="hasGeneratedTeams" class="w-full max-w-lg">
      <h2 class="text-xl font-semibold text-center mb-4 text-gray-600 dark:text-gray-300">Lag</h2>  
      <ul class="space-y-2">
        <li v-for="(members, team) in teams" :key="team" class="bg-gray-300 dark:bg-gray-800 p-3 rounded-lg border border-gray-700 relative">
          <strong class="block text-blue-800 dark:text-blue-300">{{ team }}</strong>
          <button @click="renameTeam(team)" class="absolute top-2 right-2 text-blue-600 hover:text-blue-400 text-sm underline">Byt namn</button>
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ members.join(', ') }}</span>
        </li>
      </ul>

      <button
        @click="generateSchedule"
        class="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-200"
      >
        Generera schema
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScheduler } from '../composables/useScheduler'
const {
  hasGeneratedTeams,
  generateTeams,
  generateSchedule,
  teams
} = useScheduler()

function renameTeam(oldName: string) {
  const newName = prompt('Ange nytt namn för ' + oldName, oldName)
  if (!newName || newName === oldName) return

  const updated: Record<string, string[]> = {}
  for (const [name, members] of Object.entries(teams.value)) {
    updated[name === oldName ? newName : name] = members
  }
  teams.value = updated
}
</script>