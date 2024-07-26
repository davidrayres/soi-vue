<script setup>
import dayjs from 'dayjs'
import {ref} from 'vue'
import {storeToRefs} from 'pinia'
import {Calendar, Cell} from 'vant'
import 'vant/es/calendar/style'
import {useGamesStore} from '@/stores/GamesStore.js'

const gamesStore = useGamesStore()
const {gamesStartDate} = storeToRefs(gamesStore)

const date = ref(dayjs(gamesStartDate.value).format('M/D'))
const show = ref(false)
const today = new Date()
const minDate = new Date(today.setDate(today.getDate() - 180))

const onConfirm = value => {
  gamesStartDate.value = dayjs(value).format('YYYYMMDD')
  gamesStore.setWeekDates(value)
  gamesStore.getGames()

  date.value = dayjs(value).format('M/D')
  show.value = false
}
</script>

<template>
  <Cell @click="show = true" class="flex-ctr">
    <div class="date-selector flex-ctr">
      <i class="material-icons">calendar_month</i>
      {{ date }}
    </div>
  </Cell>
  <Calendar v-model:show="show" @confirm="onConfirm" :show-confirm="false" color="black" first-day-of-week="1" row-height="40" :min-date="minDate" :show-title="false" :style="{height: '90%'}" />
</template>

<style scoped>
.van-cell__value {
  display: flex;
  align-items: center;
}
i {
  padding-right: 6px;
}
</style>
