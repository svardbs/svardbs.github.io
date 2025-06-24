import { ref, computed } from 'vue'
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

const people = ref<string[]>([])
const activities = ref<string[]>([])
const numberOfTeams = ref(1)
const teams = ref<Record<string, string[]>>({})
const schedule = ref<Record<string, Record<string, string>>>({})
const hasGeneratedTeams = ref(false)
const blockedAssignments = ref<{ day: string, activity: string }[]>([])
const teamError = ref('')
const shareUrl = ref('')

const allDays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag']
const scheduleStartDay = ref('Måndag')
const scheduleDayCount = ref(7)
const scheduleDays = ref<string[]>([])

function addPerson(name: string) {
  if (name.trim()) people.value.push(name.trim())
}

function addActivity(activity: string) {
  if (activity.trim()) activities.value.push(activity.trim())
}

function getScheduleDays(startDay: string, count: number): string[] {
  const startIndex = allDays.indexOf(startDay)
  if (startIndex === -1 || count < 1) return []
  const days: string[] = []
  for (let i = 0; i < count; i++) {
    const baseDay = allDays[(startIndex + i) % allDays.length]
    const week = Math.floor((startIndex + i) / allDays.length) + 1
    days.push(`V${week}-${baseDay}`)
  }
  return days
}

function getDisplayDay(dbKey: string): string {
  return dbKey.includes('-') ? dbKey.split('-')[1] : dbKey
}

function getAllDisplayDays(): string[] {
  scheduleDays.value = getScheduleDays(scheduleStartDay.value, scheduleDayCount.value)
  return [...new Set(allDays.map(getDisplayDay))]
}

function getWeek(dbKey: string) {
  const m = dbKey.match(/^V(\d+)-/)
  return m ? Number(m[1]) : 1
}

// Computed for UI grouping
const groupedSchedule = computed(() => {
  const groups: Record<number, string[]> = {}
  Object.keys(schedule.value).forEach(key => {
    const w = getWeek(key)
    groups[w] = groups[w] || []
    groups[w].push(key)
  })
  return groups
})

function generateTeams() {
  if (!numberOfTeams.value || people.value.length === 0)
  {
    if (!numberOfTeams.value) {
      teamError.value = 'Du måste välja antal lag'
    }
    return
  }
  teamError.value = '';
  const shuffled = [...people.value].sort(() => Math.random() - 0.5)
  const newTeams: Record<string, string[]> = {}

  for (let i = 0; i < numberOfTeams.value; i++) {
    newTeams[`Lag ${i + 1}`] = []
  }

  shuffled.forEach((person, i) => {
    const teamIndex = i % numberOfTeams.value!
    newTeams[`Lag ${teamIndex + 1}`].push(person)
  })

  teams.value = newTeams
  hasGeneratedTeams.value = true
  schedule.value = {}
}

async function generateSchedule() {
  if (!numberOfTeams.value || activities.value.length === 0) return

  const teamNames = Object.keys(teams.value)
  const teamCount = teamNames.length
  const scheduleDays = getScheduleDays(scheduleStartDay.value, scheduleDayCount.value)

  const result: Record<string, Record<string, string>> = {}

  scheduleDays.forEach((dayKey, dIdx) => {
    result[dayKey] = {}

    const isWholeDayBlocked =
      blockedAssignments.value.some(b => b.day === dayKey && !b.activity)
    if (isWholeDayBlocked) return // skip the entire day

    activities.value.forEach((activity, aIdx) => {
      const isPairBlocked = blockedAssignments.value.some(
        b => b.day === dayKey && b.activity === activity
      )
      if (isPairBlocked) return

      // distribute: shift by day index so each day starts with a new leading team
      const team = teamNames[(dIdx + aIdx) % teamCount]
      result[dayKey][activity] = team
    })
  })

  schedule.value = result

  const ordered = Object.entries(result).map(([day, tasks]) => ({ day, tasks }))
  const docRef = await addDoc(collection(db, 'schedules'), {
    schedule: ordered,
    teams: teams.value,
  })

  shareUrl.value = `${location.origin}${location.pathname}?schedule=${docRef.id}`
}

export function useScheduler() {
  return {
    people,
    activities,
    numberOfTeams,
    teams,
    schedule,
    hasGeneratedTeams,
    blockedAssignments,
    teamError,
    shareUrl,
    allDays,
    scheduleDayCount,
    scheduleStartDay,
    scheduleDays,
    addPerson,
    addActivity,
    generateTeams,
    generateSchedule,
    getAllDisplayDays,
    getDisplayDay,
    groupedSchedule,
  }
}