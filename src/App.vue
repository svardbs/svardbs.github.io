<template>
  <main class="min-h-screen p-6 sm:p-10 max-w-4xl mx-auto space-y-10 transition-colors duration-300">
    <div class="absolute top-4 right-4">
      <div class="relative w-14 h-8 rounded-full cursor-pointer bg-gray-300 dark:bg-gray-700 transition duration-300" @click="toggleDark">
        <div class="absolute top-1 left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm transition-all duration-300"
          :class="{ 'translate-x-6': isDark }">
          <span>{{ isDark ? '🌙' : '☀️' }}</span>
        </div>
      </div>
    </div>
    <header class="text-center">
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-gray-600 dark:text-gray-300">Schemaläggare</h1>
      <p class="text-sm text-gray-600 dark:text-gray-300">Skapa slumpmässiga lag och generera ett veckoschema</p>
    </header>

    <section v-if="!hideForm" class="space-y-6">
      <PeopleInput />
      <ActivityInput />
      <BlockActivity />
      <TeamSelector />
      <GenerateButton />
      <WeeklySchedule />
    </section>
    <section v-else class="flex flex-col items-center space-y-6">
      <div v-if="hasGeneratedTeams" class="w-full max-w-lg">
        <GeneratedTeams /> 
      </div>  
      <WeeklySchedule />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

import PeopleInput from './components/PeopleInput.vue'
import ActivityInput from './components/ActivityInput.vue'
import TeamSelector from './components/TeamSelector.vue'
import GenerateButton from './components/GenerateButton.vue'
import WeeklySchedule from './components/WeeklySchedule.vue'
import BlockActivity from './components/BlockActivity.vue'
import GeneratedTeams from './components/GeneratedTeams.vue'
import { useScheduler } from './composables/useScheduler'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './composables/firebase'

const { schedule, teams, hasGeneratedTeams, activities, people, blockedAssignments } = useScheduler()

const isDark = ref(false)
const hideForm = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') isDark.value = true
  else if (saved === 'light') isDark.value = false
  else isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches

  const urlParams = new URLSearchParams(location.search)
  const sharedId = urlParams.get('schedule')
  if (sharedId) {
    getDoc(doc(db, 'schedules', sharedId)).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        schedule.value = data.schedule
        teams.value = data.teams
        hasGeneratedTeams.value = true
        hideForm.value = true
      }
    })
  }

  const storedActivities = localStorage.getItem('savedActivities')
  const storedPeople = localStorage.getItem('savedPeople')
  const storedblockedAssignments = localStorage.getItem('savedblockedAssignments')

  if (storedActivities) activities.value = JSON.parse(storedActivities)
  if (storedPeople) people.value = JSON.parse(storedPeople)
  if (storedblockedAssignments) blockedAssignments.value = JSON.parse(storedblockedAssignments)
})

function toggleDark() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

watch(isDark, (newVal) => {
  document.documentElement.classList.toggle('dark', newVal)
}, { immediate: true })

watch(activities, (newVal) => {
  localStorage.setItem('savedActivities', JSON.stringify(newVal))
}, { deep: true })

watch(people, (newVal) => {
  localStorage.setItem('savedPeople', JSON.stringify(newVal))
}, { deep: true })

watch(blockedAssignments, (newVal) => {
  localStorage.setItem('savedblockedAssignments', JSON.stringify(newVal))
}, { deep: true })
</script>

<style>
html.dark {
  background-color: #1a202c;
  color: white;
}
</style>