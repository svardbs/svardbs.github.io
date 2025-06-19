<template>
    <h2 class="text-xl font-semibold text-center mb-4 text-gray-600 dark:text-gray-300">Lag</h2>  
    <ul class="space-y-2">
        <li v-for="(members, team) in teams" :key="team" class="bg-gray-300 dark:bg-gray-800 p-3 rounded-lg border border-gray-700 relative">
            <strong class="block text-blue-800 dark:text-blue-300">{{ team }}</strong>
            <button @click="renameTeam(team)" class="absolute top-2 right-2 text-blue-600 hover:text-blue-400 text-sm underline">Byt namn</button>
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ members.join(', ') }}</span>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { useScheduler } from '../composables/useScheduler'
import { db } from '../composables/firebase'
import { doc, updateDoc } from 'firebase/firestore'

const { teams, schedule } = useScheduler()


async function renameTeam(oldName: string) {
  const newName = prompt('Ange nytt namn för ' + oldName, oldName)
  if (!newName || newName === oldName) return

  const newTeams: Record<string, string[]> = {}
  for (const [name, members] of Object.entries(teams.value)) {
    newTeams[name === oldName ? newName : name] = members
  }
  teams.value = newTeams

  for (const day in schedule.value) {
    for (const activity in schedule.value[day]) {
      if (schedule.value[day][activity] === oldName) {
        schedule.value[day][activity] = newName
      }
    }
  }

  const urlParams = new URLSearchParams(location.search)
  const sharedId = urlParams.get('schedule')
  if (sharedId) {
    const ref = doc(db, 'schedules', sharedId)

    // Store schedule as ordered array (matches the saving code)
    const ordered = Object.entries(schedule.value).map(([day, tasks]) => ({
      day,
      tasks,
    }))

    await updateDoc(ref, {
      teams: teams.value,
      schedule: ordered,
    })
  }
  
}

</script>