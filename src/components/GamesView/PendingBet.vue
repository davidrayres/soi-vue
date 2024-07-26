<script setup>
import {USER, USERS} from '@/main.js'
import {ref, computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useGamesStore} from '@/stores/GamesStore.js'

const user = computed(() => USER)
const users = computed(() => USERS)
const gamesStore = useGamesStore()
const {betSlip} = storeToRefs(gamesStore)

const emit = defineEmits(['countUnselectedCounteryparty'])
const props = defineProps(['pendingbet'])
const wager = ref(props.pendingbet.wager)
const counterparty = ref('select counterparty')

const betType = props.pendingbet.betType
const pickType = props.pendingbet.player1type
const bet = props.pendingbet.player1bet
const fav = props.pendingbet.favorite
const line = props.pendingbet.line
const uiLine = betType === 'spread' && pickType === 'fav' ? `-${line}` : betType === 'spread' && pickType !== 'fav' ? `+${line}` : line
const deleteId = `${props.pendingbet.gameId}-${props.pendingbet.betType}-${props.pendingbet.player1type}-pending`

props.pendingbet.player1name = user.value.displayName
props.pendingbet.player1email = user.value.email
props.pendingbet.player1id = user.value.uid
props.pendingbet.wager = wager

console.log(props.pendingbet)
console.log(betSlip.value)

function definePlayer2(e) {
  e.target.classList.remove('unselected')
  const player2 = users.value.filter(user => user.displayName === counterparty.value)

  props.pendingbet.player2name = player2[0].displayName
  props.pendingbet.player2email = player2[0].email
  props.pendingbet.player2id = player2[0].id

  emit('countUnselectedCounteryparty')
}

function removePendingBet(e) {
  // const pendingGameId = e.target.id.split('-')[0] //remove all but gameId from pending Bet id

  const pendingBetId = e.target.id.slice(0, -8) //remove '-pending' from pending bet id

  console.log(betSlip.value)
  const idIndex = betSlip.value.findIndex(bet => bet.betId === pendingBetId)
  betSlip.value.splice(idIndex, 1)
  console.log(betSlip.value)

  const betEl = document.getElementById(pendingBetId)
  betEl.classList.remove('bet')
}
</script>

<!-- -------------------------------------------- -->

<template>
  <div class="pending-bet-container">
    <div class="gamename-container">
      <div class="gamename">{{ props.pendingbet.matchup }}</div>
      <i :id="deleteId" @click="removePendingBet" class="material-icons bet-delete-btn">close</i>
    </div>

    <div class="betinputs-container">
      <div>{{ props.pendingbet.player1bet }} &nbsp;{{ uiLine }}</div>
      <p>&nbsp; for &nbsp;</p>
      <input name="betWager" v-model="wager" />
    </div>
    <div class="betinputs-container">
      <p>with &nbsp;</p>

      <select @change="definePlayer2" class="unselected" name="counterparty" v-model="counterparty" required>
        <option value="select counterparty" disabled selected hidden>select counterparty</option>
        <option v-for="user in users" :key="user">{{ user.displayName }}</option>
      </select>
    </div>
  </div>
</template>

<!-- -------------------------------------------- -->

<style scoped>
.pending-bet-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem;
  border: 1px solid lightgray;
  border-radius: 6px;
  padding: 1.25rem;
}

.bet-delete-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  color: gray;
  font-weight: 100;
}

.gamename-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.gamename {
  font-size: 1.1rem;
  font-weight: 100;
}

/* .pending-bet-container > * { */
/* width: 100%; */
/* white-space: nowrap; */
/* } */
.betinputs-container {
  display: flex;
  font-weight: bold;
  font-size: 1.1rem;
}
.betinputs-container p {
  font-weight: initial;
}

input,
select {
  /* background: rgba(255, 166, 0, 0.199); */
  /* border-radius: 6px; */
  height: 25px;
  border: none;
  outline: none;
  font-weight: bold;
  font-size: inherit;
  padding-top: 2px;
  border-bottom: 1px solid gray;
}

input {
  text-align: center;
  max-width: 55px;
}

select {
  /* flex: 1; */
  padding: 0 6px;
}

select.unselected {
  font-weight: initial;
  color: blue;
  /* color: white; */
  /* background: blue; */
}
</style>
