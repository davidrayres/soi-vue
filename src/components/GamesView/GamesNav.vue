<script setup>
import {USER} from '@/main.js'
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {showToast} from 'vant'
import {useGamesStore} from '@/stores/GamesStore.js'
import GamesDatePicker from '@/components/GamesView/GamesDatePicker.vue'
import SportSelectorBtn from '@/components/GamesView/SportSelectorBtn.vue'
import SportFilterBtn from '@/components/GamesView/SportFilterBtn.vue'
import BtnCreateAcct from '@/components/AuthViews/BtnCreateAcct.vue'
import BtnLogin from '@/components/AuthViews/BtnLogin.vue'

const gamesStore = useGamesStore()
const {sportSelection} = storeToRefs(gamesStore)
const showFilter = computed(() => sportSelection.value.showFilter)
const showAuthBtns = computed(() => !USER)

function handleRefresh() {
  setTimeout(() => {
    showToast('Refresh Disabled')
  }, 0)
}
</script>

<template>
  <header>
    <div class="league-selector-container flex-ctr">
      <SportSelectorBtn />

      <div v-show="showFilter">
        <SportFilterBtn />
      </div>
    </div>

    <GamesDatePicker />
    <i @click="handleRefresh" class="material-icons">refresh</i>
  </header>

  <header v-if="showAuthBtns" class="login-container flex-ctr">
    <BtnCreateAcct />
    <BtnLogin />
  </header>
</template>

<style scoped>
.league-selector-container {
  gap: 10px;
}

.login-container {
  display: flex;
  gap: 10px;
}

i {
  font-size: 2rem;
  color: darkgray;
}
</style>
