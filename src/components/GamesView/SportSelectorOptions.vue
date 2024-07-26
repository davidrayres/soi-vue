<script setup>
import {storeToRefs} from 'pinia'
import {useGamesStore} from '@/stores/GamesStore.js'

const gamesStore = useGamesStore()
const {sportSelection} = storeToRefs(gamesStore)

const sports = [
  {name: 'NCAAF', url: 'football/college-football', showFilter: true, class: ''},
  {name: 'NFL', url: 'football/nfl', showFilter: false, class: ''},
  {name: 'NCAAB', url: 'basketball/mens-college-basketball', showFilter: true, class: ''},
  {name: 'NBA', url: 'basketball/nba', showFilter: false, class: ''},
  {name: 'Golf', url: '', showFilter: false, class: 'disabled'},
  {name: 'MLB', url: '', showFilter: false, class: 'disabled'},
  {name: 'NHL', url: '', showFilter: false, class: 'disabled'},
  {name: 'NASCAR', url: '', showFilter: false, class: 'disabled'},
  {name: 'Formula1', url: '', showFilter: false, class: 'disabled'},
  {name: 'Tennis', url: '', showFilter: false, class: 'disabled'},
  {name: 'MMA', url: '', showFilter: false, class: 'disabled'},
]

function handleSelection(sport) {
  console.log(sport)

  sportSelection.value = sport
  gamesStore.getGames()
  gamesStore.setWeekDates()
}
function getImageUrl(name) {
  return new URL(`../../assets/logos/${name.toLowerCase()}.svg`, import.meta.url).href
}
</script>

<!-- -------------------------------------------- -->

<template>
  <div class="modal-body">
    <div v-for="(sport, index) in sports" :key="index" class="option" :class="{disabled: sport.class === 'disabled'}" @click="handleSelection(sport)">
      <img :src="getImageUrl(sport.name)" />
      <i class="material-icons">{{ sport.icon }}</i>
      <p>{{ sport.name }}</p>
    </div>
  </div>
</template>

<!-- -------------------------------------------- -->

<style scoped>
.modal-body {
  padding: 3rem;
}

img {
  width: 30px;
  height: 30px;
  margin-right: 1rem;
}

p {
  line-height: 30px;
}

.option {
  display: flex;
  padding: 0.75rem 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.option.disabled {
  font-weight: initial;
  color: lightgray;
  pointer-events: none;
}
</style>
