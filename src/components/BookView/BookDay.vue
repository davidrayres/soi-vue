<script setup>
import dayjs from 'dayjs'
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useBookStore} from '@/stores/BookStore.js'
import BetPod from '@/components/BookView/BetPod.vue'

const bookStore = useBookStore()
const {betsStaged} = storeToRefs(bookStore)

const props = defineProps(['date'])

const thisDayBets = computed(() => betsStaged.value.filter(bet => dayjs(bet.startDate.toDate()).format('MMM D, YYYY (ddd)') === props.date))

const dayBal = computed(() => thisDayBets.value.reduce((acc, val) => acc + +val.result, 0))
const dayWin = computed(() => thisDayBets.value.filter(bet => +bet.result > 0).length)
const dayLoss = computed(() => thisDayBets.value.filter(bet => +bet.result < 0).length)
const dayTie = computed(() => thisDayBets.value.filter(bet => +bet.result === 0).length)
const N = dayWin.value + dayTie.value / 2
const D = dayWin.value + dayLoss.value + dayTie.value
const dayWinPct = computed(() => (N / D).toFixed(3).replace(/^0+/, ''))
</script>

<template>
  <div class="section-container">
    <div class="section-header">
      <p>{{ date }}</p>
      <div class="day-results label">
        <span>{{ dayBal }}</span>
        |
        <span>{{ dayWin }}-{{ dayLoss }}-{{ dayTie }}</span>
        |
        <span>{{ dayWinPct }}</span>
      </div>
      <p class="paid label">paid</p>
    </div>
    <div class="betsection-container">
      <BetPod v-for="bet in thisDayBets" :key="bet.id" :bet="bet" />
    </div>
  </div>
</template>

<style scoped>
.section-header {
  position: sticky;
  top: 0px;
  z-index: 100;
  display: flex;
  gap: 35px;
  align-items: center;
  /* border-top: 1px solid black; */
  /* background: whitesmoke; */
  color: white;
  background: rgb(65, 65, 65);
  font-weight: bold;
  padding: 5px 10px;
  margin-top: 1rem;
  font-size: 1rem;
}

.label {
  font-weight: 400;
  font-size: 0.9rem;
}

.day-results.label {
  color: lightgray;
}
.paid.label {
  color: lightgray;
  position: absolute;
  right: 12px;
}

.betsection-container {
  position: relative;
}
</style>
