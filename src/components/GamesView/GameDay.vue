<script setup>
// import {USER} from '@/main.js'
import dayjs from 'dayjs'
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import GamePod from './GamePod.vue'
import {useGamesStore} from '@/stores/GamesStore.js'

const props = defineProps(['date'])
const gamesStore = useGamesStore()
const {sportSelection, filter} = storeToRefs(gamesStore)

sportSelection.value.url.split('/')[1] === 'nfl' && (filter.value = {uiName: 'All FBS', dbName: 'games'})

const thisDayGames = computed(() =>
  gamesStore[filter.value.dbName].filter(game => {
    return dayjs(game.date).format('YYYY-MM-DD') === props.date
  })
)

const dayDisplay = dayjs(props.date).format('dddd, M/D')
</script>

<template>
  <div class="section-container">
    <div class="section-header">
      <p>{{ dayDisplay }}</p>
      <p class="spread label">Spread</p>
      <p class="total label">Total</p>
      <p class="mline label">Money</p>
    </div>
    <div class="gamesection-container">
      <div v-if="!thisDayGames.length" class="no-games">-&nbsp; No Games &nbsp;-</div>
      <GamePod v-for="game in thisDayGames" :key="game.id" :game="game" />
    </div>
  </div>
</template>

<style scoped>
.section-header {
  position: sticky;
  top: 0px;
  z-index: 100;
  display: flex;
  align-items: center;
  /* border-top: 1px solid black; */
  /* background: whitesmoke; */
  color: white;
  background: rgb(65, 65, 65);
  font-weight: bold;
  padding: 5px 10px;
  margin-top: 1rem;
  font-size: 1rem;
  letter-spacing: 1px;
}

.label {
  position: absolute;
  font-size: 0.7rem;
  color: lightgray;
}
.spread.label {
  /* position: absolute; */
  right: 138px;
}

.total.label {
  /* position: absolute; */
  right: 88px;
}

.mline.label {
  /* position: absolute; */
  right: 25px;
}

.gamesection-container {
  position: relative;
}
.no-games {
  width: 100%;
  text-align: center;
  font-size: 1.25rem;
  color: darkgray;
  margin-top: 1rem;
  padding-bottom: 1rem;
}
</style>
