<script setup>
import {ref} from 'vue'
import {storeToRefs} from 'pinia'
// import {useGamesStore} from '@/stores/GamesStore.js'
import {useBookStore} from '@/stores/BookStore.js'
import {db} from '@/firebase.js'
import {setDoc, doc, deleteDoc} from 'firebase/firestore'

// const gamesStore = useGamesStore()
const bookStore = useBookStore()
const {unpaidBalances, unpaidBalance} = storeToRefs(bookStore)

const props = defineProps(['bet'])
const isPaid = ref(props.bet.isPaid)

// const homeTeam = props.bet.matchup.split(' ')[2]
// const awayTeam = props.bet.matchup.split(' ')[0]
// const homeScore = props.bet.player1bet === homeTeam ? props.bet.player1score : props.bet.player2score
// const awayScore = props.bet.player1bet === homeTeam ? props.bet.player2score : props.bet.player1score
// let betBalance = props.bet.wager * props.bet.player1result
// Number.isNaN(betBalance) && (betBalance = '')

let winLoss = ''
if (props.bet.result !== 'tbd') {
  winLoss = props.bet.result > 0 ? 'win' : (props.bet.result < 0 && 'loss') || 'push'
}

// if (!props.bet.isPaid && props.bet.result !== 'tbd') {
// unpaidBalances.value.push(+props.bet.result)
// }

function getImageUrl(url) {
  let betLogo = url
  if (props.bet.bet === 'OVER') {
    betLogo = '../../assets/over.svg'
  } else if (props.bet.bet === 'UNDER') {
    betLogo = '../../assets/under.svg'
  }
  return new URL(betLogo, import.meta.url).href
}

async function handlePaidClick() {
  isPaid.value = !isPaid.value
  const payload = {isPaid: isPaid.value}
  // updateBet('soiBook', props.bet.id, {isPaid: isPaid.value})
  const docRef = doc(db, 'soiBook', props.bet.id)
  await setDoc(docRef, payload, {merge: true})
}

async function handleDeleteClick() {
  const confirmDelete = confirm('Are you sure you want to delete this bet from your book?')
  if (confirmDelete) {
    console.log(props.bet.id)
    await deleteDoc(doc(db, 'soiBook', props.bet.id))
  }
}
</script>

<!-- ------------------------------------------------------ -->

<template>
  <div :id="bet.id" class="booked-bet-container" :class="winLoss">
    <i @click="handleDeleteClick" class="material-icons booked-bet-delete">close</i>

    <div class="booked-bet-result">
      <div class="betlogo-container">
        <img class="betlogo" :src="getImageUrl(bet.betLogo)" />
      </div>
    </div>
    <div class="booked-bet">
      <div class="bet-line-tag-container">
        <div class="booked-bet-name">{{ bet.bet }}&nbsp;&nbsp;{{ bet.line }}</div>
        <div class="booked-bet-tag">{{ bet.counterparty }} | {{ bet.wager }} &nbsp;<span v-if="bet.userName === bet.player1name" class="my-bet material-icons"> verified </span></div>
      </div>
      <div class="bet-game">{{ bet.awayTeam }} {{ bet.awayScore }} - {{ bet.homeTeam }} {{ bet.homeScore }} &#x2022; {{ bet.gameState }}</div>
    </div>
    <div class="booked-bet-balance">{{ bet.result }}</div>
    <div @click="handlePaidClick" class="booked-bet-ispaid">
      <i v-if="isPaid" class="payment-status material-icons"> check_box </i>
      <i v-else class="payment-status material-icons"> check_box_outline_blank </i>
    </div>
  </div>
</template>

<!-- ------------------------------------------------------ -->

<style scoped>
.runningbalance-container {
  font-size: 1.5rem;
  display: flex;
  gap: 25px;
  justify-content: center;
  margin-top: 1rem;
}
.booked-bet-container {
  display: flex;
  align-items: center;
  margin: 0.75rem;
  font-weight: bold;
}

.booked-bet-result,
.booked-bet-balance {
  height: 42px;
  width: 42px;
  margin-right: 0.75rem;
  text-align: right;
}
.booked-bet-result {
  border: 1px;
  border: 1px solid rgb(172, 172, 172);
}
.booked-bet-balance {
  margin-right: 1.5rem;
  line-height: 42px;
  font-size: 1.2rem;
}

.booked-bet-container.win .booked-bet-result {
  background: rgb(0, 255, 0, 0.6);
  border: 1px solid rgb(0, 255, 0);
}
.booked-bet-container.loss .booked-bet-result {
  background: rgb(255, 0, 0, 0.6);
  border: 1px solid rgb(255, 0, 0);
}
.booked-bet-container.push .booked-bet-result {
  background: rgb(172, 172, 172, 0.3);
}

.booked-bet {
  display: flex;
  flex-direction: column;
}

.booked-bet-name {
  font-size: 1.2rem;
}

.bet-line-tag-container {
  display: flex;
  align-items: center;
}
.booked-bet-tag {
  font-size: 0.9rem;
  font-weight: initial;
  margin-left: 1rem;
  color: gray;
}

.booked-bet {
  flex: 1;
  font-weight: bold;
}

.bet-game {
  /* font-size: 0.9rem; */
  color: gray;
  font-weight: initial;
}

.booked-bet-result {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
}

.betlogo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 85%;
  height: 85%;
  border-radius: 100%;
  background: white;
}
.betlogo {
  width: 1.75rem;
  height: 1.75rem;
}

.booked-bet-delete {
  margin-right: 0.5rem;
  font-size: 1rem;
  font-weight: 100;
  color: rgb(175, 175, 175);
  line-height: 42px;
}

.my-bet {
  color: blue;
  font-size: 0.8rem;
}

.booked-bet-ispaid {
  display: flex;
  align-content: center;
}
</style>
