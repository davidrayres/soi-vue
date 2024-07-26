<script setup>
import {storeToRefs} from 'pinia'
import {useGamesStore} from '@/stores/GamesStore.js'

const gamesStore = useGamesStore()
const {filter} = storeToRefs(gamesStore)

const props = defineProps(['content'])
const options = [
  {uiName: 'Top 25', dbName: 'top25'},
  {uiName: 'All FBS', dbName: 'games'},
  // {uiName: 'SEC', dbName: 'sec'},
  // {uiName: 'ACC', dbName: 'acc'},
  // {uiName: 'BIG 10', dbName: 'big10'},
  // {uiName: 'BIG 12', dbName: 'big12'},
  // {uiName: 'PAC 12', dbName: 'pac12'},
]

function handleSelection(option) {
  filter.value.uiName = option.uiName
  filter.value.dbName = option.dbName
}
</script>

<!-- -------------------------------------------- -->

<template>
  <div class="modal-body">
    <div v-for="(option, index) in options" :key="index" class="option" @click="handleSelection(option)">
      {{ option.uiName }}
    </div>
  </div>
</template>

<!-- -------------------------------------------- -->

<style scoped>
.modal-body {
  padding: 3rem;
}

.option {
  padding: 0.75rem 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
}
</style>
