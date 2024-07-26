<script setup>
// import {USER} from '@/main.js'
import {storeToRefs} from 'pinia'
import {useGamesStore} from '@/stores/GamesStore.js'
import Spinner from '@/components/Spinner.vue'
import GamesNav from '@/components/GamesView/GamesNav.vue'
// import Searchbar from '@/components/Searchbar.vue'
import GameDay from '@/components/GamesView/GameDay.vue'
import GamePod from '@/components/GamesView/GamePod.vue'
import BetSlipBtn from '@/components/GamesView/BetSlipBtn.vue'
import MainNav from '@/components/MainNav.vue'

const gamesStore = useGamesStore()
const {loading, games, weekDates, betSlip, sportSelection} = storeToRefs(gamesStore)

gamesStore.getGames()
gamesStore.setWeekDates()
</script>

<template>
  <main v-if="loading"><Spinner /></main>

  <div>
    <GamesNav />

    <main>
      <!-- <Searchbar /> -->
      <GameDay v-for="date in weekDates" :key="date" :date="date" />
      <BetSlipBtn v-if="betSlip.length" />
    </main>

    <MainNav />
  </div>
</template>
