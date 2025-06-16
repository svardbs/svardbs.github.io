<template>
  <div v-if="Object.keys(schedule).length" class="mt-10">
    <h2 class="text-2xl font-semibold text-center mb-4">Weekly Schedule</h2>
    <div class="grid gap-4">
      <div v-for="(daySchedule, day) in schedule" :key="day"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md">
        <h3 class="text-lg font-bold text-blue-300 mb-2">{{ day }}</h3>
        <ul class="text-sm text-gray-300 pl-4 list-disc">
          <li v-for="(team, activity) in daySchedule" :key="activity">
            {{ activity }}:
            <span>
              {{ team }} ({{ getTeamMembers(team).join(', ') }})
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScheduler } from '../composables/useScheduler'
const { schedule, teams } = useScheduler()

function getTeamMembers(teamLabel: string): string[] {
  return teams.value[teamLabel] || []
}
</script>