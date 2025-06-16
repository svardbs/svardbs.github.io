<template>
  <main class="min-h-screen p-6 sm:p-10 max-w-4xl mx-auto space-y-10 text-white">
    <header class="text-center">
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Schemaläggare</h1>
      <p class="text-sm text-gray-400">Skapa slumpmässiga lag och generera ett veckoschema</p>
    </header>

    <section class="space-y-6">
      <PeopleInput />
      <ActivityInput />
      <TeamSelector />
      <GenerateButton />
      <WeeklySchedule />
    </section>
  </main>
</template>

<script setup lang="ts">
import PeopleInput from './components/PeopleInput.vue'
import ActivityInput from './components/ActivityInput.vue'
import TeamSelector from './components/TeamSelector.vue'
import GenerateButton from './components/GenerateButton.vue'
import WeeklySchedule from './components/WeeklySchedule.vue'
</script>
