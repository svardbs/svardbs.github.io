import { ref } from 'vue'
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

const people = ref<string[]>([])
const activities = ref<string[]>([])
const numberOfTeams = ref<number | null>(null)
const teams = ref<Record<string, string[]>>({})
const schedule = ref<Record<string, Record<string, string>>>({})
const hasGeneratedTeams = ref(false)
const blockedAssignments = ref<{ day: string, activity: string }[]>([])
const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Nästa Söndag']
const teamError = ref('')
const shareUrl = ref('')

function addPerson(name: string) {
  if (name.trim()) people.value.push(name.trim())
}

function addActivity(activity: string) {
  if (activity.trim()) activities.value.push(activity.trim())
}

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

  const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag']
  const teamNames = Object.keys(teams.value)
  const result: typeof schedule.value = {}

  const validAssignments: { day: string; activity: string }[] = []
  for (const day of days) {
    for (const activity of activities.value) {
      const isBlocked = blockedAssignments.value.some(b => b.day === day && b.activity === activity)
      if (!isBlocked) {
        validAssignments.push({ day, activity })
      }
    }
  }

  const assignmentsPerTeam: Record<string, { day: string, activity: string }[]> = {}
  teamNames.forEach(name => assignmentsPerTeam[name] = [])
  validAssignments.forEach((assignment, index) => {
    const team = teamNames[index % teamNames.length]
    assignmentsPerTeam[team].push(assignment)
  })

  for (const day of days) {
    result[day] = {}
    for (const team of teamNames) {
      for (const entry of assignmentsPerTeam[team]) {
        if (entry.day === day) {
          result[day][entry.activity] = team
        }
      }
    }
  }

  schedule.value = result

  // Store schedule in Firebase with unique ID
  const docRef = await addDoc(collection(db, 'schedules'), {
    schedule: result,
    teams: teams.value
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
    days,
    teamError,
    shareUrl,
    addPerson,
    addActivity,
    generateTeams,
    generateSchedule,
  }
}