<script setup>
import {ref} from 'vue'
import {Popup, Cell} from 'vant'
import {storeToRefs} from 'pinia'
import {useGamesStore} from '@/stores/GamesStore.js'
import SportFilterOptions from '@/components/GamesView/SportFilterOptions.vue'

const gamesStore = useGamesStore()
const {filter} = storeToRefs(gamesStore)

const show = ref(false)
const showPopup = () => {
  show.value = true
}
</script>

<template>
  <Cell is-link @click="showPopup" class="flex-ctr">
    <div class="league-selector flex-ctr">
      {{ filter.uiName }}
    </div>
  </Cell>

  <Popup @click="show = false" v-model:show="show" position="bottom" :style="{height: '90%'}" round closeable>
    <SportFilterOptions />
  </Popup>
</template>

<style scoped></style>
