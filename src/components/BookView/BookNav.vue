<script setup>
import {USER} from '@/main.js'
import {ref, computed} from 'vue'
import {storeToRefs} from 'pinia'
import dayjs from 'dayjs'
import {useBookStore} from '@/stores/BookStore.js'
import {showToast} from 'vant'
import {doc, writeBatch} from 'firebase/firestore'
import {db} from '@/firebase.js'
import Spinner from '@/components/Spinner.vue'

const user = computed(() => USER)
const bookStore = useBookStore()
const {betsRaw, betsStaged} = storeToRefs(bookStore)
const loading = ref(false)

const unpaidBets = computed(() => betsStaged.value.filter(bet => !bet.isPaid && bet.result !== 'tbd'))
const unpaidBalArray = computed(() => Object.values(unpaidBets.value.map(bet => +bet.result)))
const unpaidBalance = computed(() => unpaidBalArray.value.reduce((acc, val) => acc + val, 0))

function handleRefresh() {
  loading.value = true
  updateScores()
  setTimeout(() => {
    showToast('Scores Updated!')
    loading.value = false
  }, 500)
}

let allGames = []
async function updateScores() {
  //1. Determine which bets do not have a recorded outcome and get the time span for those bets
  const betsNoResult = betsRaw.value.filter(bet => bet.player1result === 'tbd')
  const urlParams = [...new Set(betsNoResult.map(bet => `${bet.sport}/${bet.league}`))]
  const noResultDates = betsNoResult.map(bet => bet.startTime).sort((a, b) => a - b)
  const start = dayjs(+noResultDates[0]).format('YYYYMMDD')
  const end = dayjs(+noResultDates.pop()).format('YYYYMMDD')

  //2. Get all games from the ESPN endpoints for the time span and then filter for games in the betsNoResult array
  allGames = []
  await Promise.all(
    urlParams.map(async param => {
      await _fetchGames(param, start, end)
    })
  )
  allGames = allGames.flat()
  const betGames = allGames.filter(game => betsNoResult.find(bet => bet.gameId === game.id))

  //3. Filter Games and Bets arrays to games in progress OR finished ('game.status.type.description' is either 'Scheduled','In Progress', 'Halftime' or 'Final')
  const gamesNoResultKicked = betGames.filter(game => game.status.type.description !== 'Scheduled')
  const betsNoResultKicked = betsNoResult.filter(bet => gamesNoResultKicked.find(game => game.id === bet.gameId))

  //3. Filter Games and Bets arrays to ONLY finished games (subset of gamesNoResultKicked array)
  const gamesNoResultFinal = gamesNoResultKicked.filter(game => game.status.type.description === 'Final')
  const betsNoResultFinal = betsNoResult.filter(bet => gamesNoResultFinal.find(game => game.id === bet.gameId))

  //4. Push the SCORE and STATE to client-side 'betsNoResultKicked' array
  betsNoResultKicked.map(bet => {
    const homeScore = gamesNoResultKicked.find(game => game.id === bet.gameId)?.competitions[0].competitors[0].score
    const awayScore = gamesNoResultKicked.find(game => game.id === bet.gameId)?.competitions[0].competitors[1].score
    const homeTeam = bet.matchup.split(' ')[2]
    bet.player1score = bet.player1bet === homeTeam ? homeScore : awayScore
    bet.player2score = bet.player1bet === homeTeam ? awayScore : homeScore
    bet.gameState = gamesNoResultKicked.find(game => game.id === bet.gameId)?.status.type.shortDetail
  })

  //5. For finalized games only, push the RESULT of player1 to the client-side 'betsNoResultKicked' array
  betsNoResultKicked.forEach(bet => {
    console.log(bet.gameState, bet.player1result, bet.gameState.includes('Final'))
    if (bet.gameState.includes('Final')) {
      console.log(bet)
      _updateResult(bet)
    }
  })

  //5. Update result in the client-sde array the result in the
  _recordScores(betsNoResultKicked)

  console.log('betsNoResult', betsNoResult)
  console.log('betsNoResultKicked', betsNoResultKicked)
  console.log('betsNoResultFinal', betsNoResultFinal)
}

async function _fetchGames(sport, start, end) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/scoreboard?limit=1000&dates=${start}-${end}`
  const res = await fetch(url)
  const gameData = await res.json()
  allGames.push(gameData.events)
}

function _updateResult(bet) {
  const player1line = bet.favorite === bet.player1bet ? +bet.line * -1 : +bet.line
  const netScore = +bet.player1score - +bet.player2score + player1line
  const totScore = +bet.player1score + +bet.player2score

  //Win
  if (bet.betType === 'spread' && netScore > 0) return (bet.player1result = bet.wager) //spread win
  if (bet.player1type === 'over' && totScore > bet.line) return (bet.player1result = bet.wager) //over win
  if (bet.player1type === 'under' && totScore < bet.line) return (bet.player1result = bet.wager) //under win
  //Loss
  if (bet.betType === 'spread' && netScore < 0) return (bet.player1result = String(-bet.wager)) //spread loss
  if (bet.player1type === 'over' && totScore < bet.line) return (bet.player1result = String(-bet.wager)) //over loss
  if (bet.player1type === 'under' && totScore > bet.line) return (bet.player1result = String(-bet.wager)) //under loss

  return (bet.player1result = '0')
}

async function _recordScores(betsNoResultKicked) {
  const batch = writeBatch(db)

  betsNoResultKicked.forEach(bet => {
    const payload = {
      gameState: bet.gameState,
      player1score: bet.player1score,
      player2score: bet.player2score,
    }
    if (payload.player1result !== 'tbd') {
      payload.player1result = bet.player1result
      payload.player2result = String(-bet.player1result)
    }

    console.log(bet.id, payload)

    const docRef = doc(db, 'soiBook', bet.id)
    batch.update(docRef, payload)
  })
  await batch.commit()
}
</script>

<template>
  <main v-if="loading"><Spinner /></main>
  <header id="header">
    <div class="header-content">
      <div id="user-select-btn" class="user-select-btn flex-ctr">
        <i class="material-icons">account_circle</i>
        <span>&nbsp;{{ user?.displayName }}&nbsp;</span>
      </div>
      <div>
        Unpaid: <span class="unpaid-balance">{{ unpaidBalance }}</span>
      </div>
      <i @click="handleRefresh" class="material-icons">refresh</i>
    </div>
  </header>
</template>

<style scoped>
.header-content {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}
.user-select-btn {
  font-weight: bold;
}

.user-select-btn > * {
  font-size: 1.75rem;
}

i {
  font-size: 2rem;
}
</style>
