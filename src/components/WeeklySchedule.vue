<template>
  <div v-if="Object.keys(schedule).length" class="mt-10">
    <h2 class="text-2xl font-semibold text-center mb-4 text-gray-600 dark:text-gray-300">Veckoschema</h2>
    <div class="grid gap-4">
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
      row.push(`${teamName}`)
    })
    wsData[i + 1] = row
  })

  // Track where teams should be inserted
  const teamStartRow = wsData.length + 2
  const teamColorMap: Record<string, string> = {}
  const teamColors = ['FFB6C1', '87CEFA', '90EE90', 'FFFF99', 'FFDEAD', 'DDA0DD']

  let currentCol = 1 // start on second column
  Object.entries(teams.value).forEach(([teamName, members], i) => {
    const color = teamColors[i % teamColors.length]
    teamColorMap[teamName] = color
    console.log(color);
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

  // Apply bold font to headers
  const headerRows = [0, teamStartRow + 1]
  headerRows.forEach(r => {
    const header = wsData[r]
    if (!header) return
    header.forEach((_, c) => {
      const cellAddress = XLSX.utils.encode_cell({ r, c })
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: { bold: true },
        }
      }
    })
  })

  Object.entries(ws).forEach(([cell, cellData]) => {
    if (!cell.startsWith('!')) {
      const value = String(cellData.v || '')
      const match = value.match(/^(Lag \d+)/)
      if (match) {
        const team = match[1]
        const color = teamColorMap[team]
        console.log('teamcolor', color);
        if (color) {
          ws[cell].s = ws[cell].s || {}
          ws[cell].s.fill = { fgColor: { rgb: color } }
        }
      }
    }
  })

  // Set column width only for the first column
  ws['!cols'] = [{ wch: 30 }]

  XLSX.utils.book_append_sheet(wb, ws, 'Schema + Lag')
  XLSX.writeFile(wb, 'veckoschema_spanien.xlsx')
}
</script>