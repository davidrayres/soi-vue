<script setup>
import {ref} from 'vue'
import {Popup, Cell} from 'vant'
import {storeToRefs} from 'pinia'
import {useGamesStore} from '@/stores/GamesStore.js'
import SportSelectorOptions from '@/components/GamesView/SportSelectorOptions.vue'

const gamesStore = useGamesStore()
const {sportSelection} = storeToRefs(gamesStore)

const show = ref(false)
const showPopup = () => {
  show.value = true
}

const getImageUrl = () => {
  return new URL(`../../assets/logos/${sportSelection.value.name.toLowerCase()}.svg`, import.meta.url).href
}
</script>

<template>
  <Cell is-link @click="showPopup" class="flex-ctr">
    <div class="league-selector flex-ctr">
      <img :src="getImageUrl(sportSelection.name)" />
      {{ sportSelection.name }}
    </div>
  </Cell>

  <Popup @click="show = false" v-model:show="show" position="bottom" :style="{height: '90%'}" round closeable>
    <SportSelectorOptions />
  </Popup>
</template>

<style scoped>
.league-selector {
  font-size: 1.5rem;
  font-weight: bold;
}
.filter-text {
  font-size: 1.1rem;
}
.material-icons {
  margin-right: 0.25rem;
}

img {
  margin-right: 0.25rem;
  height: 25px;
  width: 25px;
}
</style>
