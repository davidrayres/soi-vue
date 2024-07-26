<script setup>
import {USER} from '@/main.js'
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {storeToRefs} from 'pinia'
import {useGamesStore} from '@/stores/GamesStore.js'
import {db, soiBook} from '@/firebase.js'
import {doc, writeBatch} from 'firebase/firestore'
import PendingBet from '@/components/GamesView/PendingBet.vue'
import BtnLogin from '@/components/AuthViews/BtnLogin.vue'
import BtnCreateAcct from '@/components/AuthViews/BtnCreateAcct.vue'

const user = computed(() => USER)
const router = useRouter()
const gamesStore = useGamesStore()
const {betSlip} = storeToRefs(gamesStore)
const unselectedCounterparties = ref('')

async function handleSubmitBets() {
  console.log('SUBMIT BETS')

  const batch = writeBatch(db)

  betSlip.value.forEach(bet => {
    console.log(bet)
    const docRef = doc(soiBook)
    batch.set(docRef, bet)
  })
  await batch.commit()

  clearAllPendingBets('', true)

  router.push({name: 'BookView'})
}

// function removeBet() {
// console.log('delete single bet')
// }

function clearAllPendingBets(e, confirmed) {
  const confirmDelete = confirmed ? confirmed : confirm('Are you sure you want to clear all bets for your bet slip?')
  if (confirmDelete) {
    betSlip.value = []
    const betEls = document.querySelectorAll('.bet')
    betEls.forEach(bet => bet.classList.remove('bet'))
  }
}

function countUnselectedCounteryparty() {
  unselectedCounterparties.value = document.querySelectorAll('.unselected').length
  console.log(unselectedCounterparties.value)
}
onMounted(() => {
  countUnselectedCounteryparty()
})
</script>

<!-- -------------------------------------------- -->

<template>
  <div class="modalcontent-header">
    <h2>Bet Slip</h2>
  </div>

  <div class="modalcontent-body">
    <div v-for="(bet, index) in betSlip" :key="index" class="betslip-container">
      <PendingBet :pendingbet="bet" @countUnselectedCounteryparty="countUnselectedCounteryparty" />
    </div>
    <div @click="clearAllPendingBets" class="betslip-cancel-btn"><i class="material-icons">delete</i>Clear all bets</div>
  </div>

  <div class="modalcontent-footer">
    <div v-if="!user" class="auth-btn-container">
      <BtnCreateAcct class="auth-btn" />
      <BtnLogin class="auth-btn" />
    </div>
    <div v-else class="betslip-btn-container">
      <div v-if="!!unselectedCounterparties" class="counterparty-note">Select counterparty to submit bets</div>
      <button @click="handleSubmitBets" class="betslip-save-btn" :class="{enabled: !unselectedCounterparties}">Submit Bets</button>
    </div>
  </div>
</template>

<!-- -------------------------------------------- -->

<style scoped>
.modalcontent-header {
  margin: 1.5rem;
}

.betslip-container {
  position: relative;
  margin-right: 0.25rem;
}

.betslip-container:last-child {
  border: none;
}

.betslip-btn-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 1rem;
  justify-content: center;
  align-items: center;
}
.betslip-save-btn {
  text-align: center;
  padding: 1rem;
  border-radius: 10px;
  color: white;
  letter-spacing: 2px;
  font-size: 1.25rem;
  width: 100%;
  color: #999;
  pointer-events: none;
  border: 1px solid #ddd;
}
.betslip-save-btn.enabled {
  background: black;
  color: white;
  pointer-events: initial;
}

.counterparty-note {
  color: blue;
  font-size: 1.1rem;
}
.betslip-cancel-btn {
  color: red;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 1rem;
}
.betslip-cancel-btn .material-icons {
  font-size: 1.25rem;
}

.auth-btn-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.auth-btn {
  font-size: 1.5rem;
}
</style>
