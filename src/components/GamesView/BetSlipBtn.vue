<script setup>
import {ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useGamesStore} from '@/stores/GamesStore.js'
import {Popup, Cell} from 'vant'
import BetSlipContent from '@/components/GamesView/BetSlipContent.vue'

const gamesStore = useGamesStore()
const {betSlip} = storeToRefs(gamesStore)
const show = ref(false)

const showPopup = () => {
  show.value = true
}
</script>

<template>
  <Cell is-link @click="showPopup" class="betcount-btn flex-ctr"> BetSlip: {{ betSlip.length }} </Cell>

  <Popup v-model:show="show" position="bottom" :style="{height: '90%'}" round closeable>
    <BetSlipContent />
  </Popup>
</template>

<style scoped>
.betcount-btn {
  position: fixed;
  bottom: 100px;
  right: 60px;
  background-color: rgb(0, 0, 0, 0.9);
  border-radius: 6px;
  /* width: 55px; */
  /* line-height: 55px; */
  color: white;
  padding: 10px;
  font-size: 1.2rem;
  text-align: center;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  cursor: pointer;
  white-space: nowrap;
}
</style>
