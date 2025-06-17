<template>
  <div v-if="Object.keys(schedule).length" class="mt-10">
    <h2 class="text-2xl font-semibold text-center mb-4 text-gray-600 dark:text-gray-300">Veckoschema</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(daySchedule, day) in schedule" :key="day"
        class="bg-gray-300 dark:bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md">
        <h3 class="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">{{ day }}</h3>
        <ul class="text-sm text-gray-600 dark:text-gray-300 pl-4 list-disc">
          <li v-for="(team, activity) in daySchedule" :key="activity">
            {{ activity }}:
            <span>
              {{ team }} ({{ getTeamMembers(team).join(', ') }})
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="text-right mt-4">
      <button @click="exportToExcel"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md">
        Exportera till Excel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScheduler } from '../composables/useScheduler'
import * as XLSX from 'xlsx'
const { activities, schedule, teams } = useScheduler()

function getTeamMembers(teamLabel: string): string[] {
  return teams.value[teamLabel] || []
}

function exportToExcel() {
  const wb = XLSX.utils.book_new()
  const wsData: any[][] = []

  const allDays = Object.keys(schedule.value)
  const allActivities = activities.value

  // Add schedule header
  const scheduleHeader = ['Aktivitet', ...allDays]
  wsData[0] = scheduleHeader

  // Insert schedule rows
  allActivities.forEach((activity, i) => {
    const row: any[] = [activity]
    allDays.forEach(day => {
      const teamName = schedule.value[day][activity]
      row.push(teamName ?? '--------------------')
    })
    wsData[i + 1] = row
  })

  // Track where teams should be inserted
  const teamStartRow = wsData.length + 2

  let currentCol = 1 // start on second column
  Object.entries(teams.value).forEach(([teamName, members]) => {
    wsData[teamStartRow] = wsData[teamStartRow] || []
    wsData[teamStartRow][currentCol] = teamName
    wsData[teamStartRow + 1] = wsData[teamStartRow + 1] || []

    members.forEach((member, i) => {
      wsData[teamStartRow + 1 + i] = wsData[teamStartRow + 1 + i] || []
      wsData[teamStartRow + 1 + i][currentCol] = member
    })
    currentCol += 2 // skip one column between teams
  })

  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Set column width only for the first column
  ws['!cols'] = [{ wch: 30 }]

  XLSX.utils.book_append_sheet(wb, ws, 'Schema + Lag')
  XLSX.writeFile(wb, 'veckoschema_spanien.xlsx')
}
</script>