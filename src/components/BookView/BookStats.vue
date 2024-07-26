<script setup>
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useBookStore} from '@/stores/BookStore.js'

const bookStore = useBookStore()
const {runningBal, runningWin, runningLoss, runningTie} = storeToRefs(bookStore)

const runningWinPct = computed(() => ((runningWin.value + runningTie.value / 2) / (runningWin.value + runningLoss.value + runningTie.value)).toFixed(3).slice(1))
</script>

<template>
  <div class="runningbalance-container">
    <span>{{ runningBal }}</span>
    |
    <span>{{ runningWin }}-{{ runningLoss }}-{{ runningTie }}</span>
    |
    <span>{{ runningWinPct }}</span>
  </div>
</template>

<style scoped>
.runningbalance-container {
  font-size: 1.25rem;
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 1rem;
}
</style>
