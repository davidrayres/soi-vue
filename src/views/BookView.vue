<script setup>
import {USER} from '@/main.js'
import {ref, computed, onMounted} from 'vue'
import {storeToRefs} from 'pinia'
// import {PullRefresh, showToast} from 'vant'
// import {doc, writeBatch} from 'firebase/firestore'
// import {db} from '@/firebase.js'
import {useBookStore} from '@/stores/BookStore.js'
import Spinner from '@/components/Spinner.vue'
import SignupSignin from '@/components/SignupSignin.vue'
import BookNav from '@/components/BookView/BookNav.vue'
import BookStats from '@/components/BookView/BookStats.vue'
import BookDay from '@/components/BookView/BookDay.vue'
import MainNav from '@/components/MainNav.vue'

// const user = computed(() => USER)
const showAuthBtns = computed(() => !USER)
const bookStore = useBookStore()
const {betDates, betsRaw} = storeToRefs(bookStore)
const loading = ref(true)
// const spinner = ref(false)

//Pull to refresh
// const onRefresh = () => {
//   setTimeout(() => {
//     showToast('Scores Updated!')
//     loading.value = false
//   }, 1000)
//   updateScores()
// }

// let allGames = []

// async function updateScores() {
//   allGames = []

//   const betsNoResult = betsRaw.value.filter(bet => bet.player1result === 'tbd')
//   const urlParams = [...new Set(betsNoResult.map(bet => `${bet.sport}/${bet.league}`))]
//   const noResultDates = betsNoResult.map(bet => bet.startTime).sort((a, b) => a - b)
//   const start = new Date(+noResultDates[0]).toISOString().substring(0, 10).replaceAll('-', '')
//   const end = new Date(+noResultDates.pop()).toISOString().substring(0, 10).replaceAll('-', '')

//   await Promise.all(
//     urlParams.map(async param => {
//       await _fetchGames(param, start, end)
//     })
//   )
//   allGames = allGames.flat()

//   //'game.status.type.description' is either 'Scheduled','In Progress', 'Halftime' or 'Final'
//   const kickedGames = allGames.filter(game => game.status.type.description !== 'Scheduled') //'In Progress & 'Final'
//   const betsNoResultKicked = betsNoResult.filter(bet => kickedGames.find(game => game.id === bet.gameId))
//   const finalGames = kickedGames.filter(game => game.status.type.description === 'Final')
//   const betsNoResultFinal = betsNoResult.filter(bet => finalGames.find(game => game.id === bet.gameId))

//   betsNoResultKicked.map(bet => {
//     const homeScore = kickedGames.find(game => game.id === bet.gameId)?.competitions[0].competitors[0].score
//     const awayScore = kickedGames.find(game => game.id === bet.gameId)?.competitions[0].competitors[1].score
//     const homeTeam = bet.matchup.split(' ')[2]
//     bet.player1score = bet.player1bet === homeTeam ? homeScore : awayScore
//     bet.player2score = bet.player1bet === homeTeam ? awayScore : homeScore
//     bet.gameState = kickedGames.find(game => game.id === bet.gameId)?.status.type.shortDetail
//   })

//   console.log('ALL GAMES', allGames)
//   console.log('KICKED GAMES', kickedGames)

//   _updateResult(betsNoResultFinal)
//   _recordScores(betsNoResultKicked)
// }

// async function _fetchGames(sport, start, end) {
//   const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/scoreboard?limit=1000&dates=${start}-${end}`
//   const res = await fetch(url)
//   const gameData = await res.json()
//   allGames.push(gameData.events)
// }

// function _updateResult(bets) {
//   betsRaw.map(bet => {
//     const player1line = bet.favorite === bet.player1bet ? +bet.line * -1 : +bet.line
//     const netScore = +bet.player1score - +bet.player2score + player1line
//     const totScore = +bet.player1score + +bet.player2score

//     //Win
//     if (bet.betType === 'spread' && netScore > 0) return (bet.player1result = bet.wager) //spread win
//     if (bet.player1type === 'over' && totScore > bet.line) return (bet.player1result = bet.wager) //over win
//     if (bet.player1type === 'under' && totScore < bet.line) return (bet.player1result = bet.wager) //under win
//     //Loss
//     if (bet.betType === 'spread' && netScore < 0) return (bet.player1result = String(-bet.wager)) //spread loss
//     if (bet.player1type === 'over' && totScore < bet.line) return (bet.player1result = String(-bet.wager)) //over loss
//     if (bet.player1type === 'under' && totScore > bet.line) return (bet.player1result = String(-bet.wager)) //under loss

//     return (bet.player1result = '0')
//   })
// }

// async function _recordScores(bets) {
//   const batch = writeBatch(db)

//   betsRaw.forEach(bet => {
//     const payload = {
//       gameState: bet.gameState,
//       player1score: bet.player1score,
//       player1result: bet.player1result,
//       player2score: bet.player2score,
//       player2result: String(-bet.player1result),
//     }
//     console.log(bet.id, payload)

//     const docRef = doc(db, 'soiBook', bet.id)
//     batch.update(docRef, payload)
//   })
//   await batch.commit()
// }

onMounted(() => (loading.value = false))
</script>

<template>
  <main v-if="loading"><Spinner /></main>

  <div v-else>
    <BookNav />

    <main>
      <SignupSignin v-if="showAuthBtns" class="signup-signin" />

      <div v-else>
        <BookStats />
        <BookDay v-for="(date, index) in betDates" :key="index" :date="date" />
      </div>
    </main>

    <MainNav />
  </div>
</template>
