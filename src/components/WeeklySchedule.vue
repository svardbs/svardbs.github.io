<template>
  <div v-if="Object.keys(schedule).length" class="w-full mt-10">
    <h2 class="text-2xl font-semibold text-center mb-4 text-gray-600 dark:text-gray-300">Veckoschema</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(dayKeys, week) in groupedSchedule" :key="week" class="bg-gray-300 dark:bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md">
        <h3 class="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2">
          Vecka {{ week }}
        </h3>

        <div v-for="dayKey in dayKeys" :key="dayKey" class="mb-4">
          <h4 class="font-semibold text-gray-800 dark:text-gray-200">
            {{ getDisplayDay(dayKey) }}
          </h4>
          <ul class="text-sm text-gray-600 dark:text-gray-300 pl-4 list-disc">
            <li v-for="(team, activity) in schedule[dayKey]" :key="activity">
              {{ activity }}:
              <span>
                {{ team }} ({{ getTeamMembers(team).join(', ') }})
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mt-4 flex flex-wrap justify-between items-center">
      <div v-if="shareUrl" class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
        <a :href="shareUrl" target="_blank" title="Delningslänk" class="text-sm truncate max-w-[200px] text-gray-800 dark:text-white hover:underline">{{ shareUrl }}</a>
        <button @click="copyToClipboard" class="ml-2 text-blue-600 hover:text-blue-800">
          📋
        </button>
        <span v-if="copySuccess" class="text-green-600 text-sm">Länk kopierad!</span>
      </div>
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
import { ref } from 'vue'
const { activities, schedule, teams, shareUrl, getDisplayDay, groupedSchedule } = useScheduler()

function getTeamMembers(teamLabel: string): string[] {
  return teams.value[teamLabel] || []
}

const copySuccess = ref(false)
function copyToClipboard() {
  if (!shareUrl.value) return
  navigator.clipboard.writeText(shareUrl.value).then(() => {
    copySuccess.value = true
    setTimeout(() => (copySuccess.value = false), 2000)
  })
}

function exportToExcel() {
  const wb = XLSX.utils.book_new()
  const wsData: any[][] = []
  const allGroups = groupedSchedule.value

  // Add schedule by week blocks
  Object.entries(allGroups).forEach(([week, dayKeys]) => {
    wsData.push([`Vecka ${week}`])
    const displayDays = dayKeys.map(d => getDisplayDay(d))
    wsData.push(['Aktivitet', ...displayDays])
    activities.value.forEach(act => {
      const row = [act]
      dayKeys.forEach(d => {
        row.push(schedule.value[d]?.[act] ?? '--------------------')
      })
      wsData.push(row)
    })
    wsData.push([]) // Blank row between weeks
  })

  // Add teams at the end
  const start = wsData.length + 2
  let col = 1
  Object.entries(teams.value).forEach(([name, mems]) => {
    wsData[start] = wsData[start] || []
    wsData[start][col] = name
    mems.forEach((m, i) => {
      wsData[start + 1 + i] = wsData[start + 1 + i] || []
      wsData[start + 1 + i][col] = m
    })
    col += 2
  })

  const ws = XLSX.utils.aoa_to_sheet(wsData)
  ws['!cols'] = [{ wch: 30 }]
  XLSX.utils.book_append_sheet(wb, ws, 'Schema')
  XLSX.writeFile(wb, 'schema.xlsx')
}
</script>