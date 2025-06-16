import { ref } from 'vue'

const people = ref<string[]>([])
const activities = ref<string[]>([])
const numberOfTeams = ref<number | null>(null)
const teams = ref<Record<string, string[]>>({})
const schedule = ref<Record<string, Record<string, string>>>({})
const hasGeneratedTeams = ref(false)

function addPerson(name: string) {
  if (name.trim()) people.value.push(name.trim())
}

function addActivity(activity: string) {
  if (activity.trim()) activities.value.push(activity.trim())
}

function generateTeams() {
  if (!numberOfTeams.value || people.value.length === 0) return
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
}

function generateSchedule() {
  if (!numberOfTeams.value || activities.value.length === 0) return

  const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Nästa Söndag']
  const result: typeof schedule.value = {}

  days.forEach((day, dayIndex) => {
    result[day] = {}
    activities.value.forEach((activity, activityIndex) => {
      const teamIndex = (dayIndex + activityIndex) % numberOfTeams.value!
      result[day][activity] = `Lag ${teamIndex + 1}`
    })
  })

  schedule.value = result
}

export function useScheduler() {
  return {
    people,
    activities,
    numberOfTeams,
    teams,
    schedule,
    hasGeneratedTeams,
    addPerson,
    addActivity,
    generateTeams,
    generateSchedule,
  }
}