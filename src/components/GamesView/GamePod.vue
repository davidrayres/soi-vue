<script setup>
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useGamesStore} from '@/stores/GamesStore.js'
import {serverTimestamp} from 'firebase/firestore'

const gamesStore = useGamesStore()
const {sportSelection, betSlip} = storeToRefs(gamesStore)
const props = defineProps(['game'])

const sport = sportSelection.value.url.split('/')[0]
const league = sportSelection.value.url.split('/')[1]
const gameId = props.game.id
const date = props.game.date
const timeTv = props.game.status.type.shortDetail
const matchup = props.game.shortName
const favorite = props.game.competitions[0].odds?.[0].details?.split(' -')[0]
const spread = props.game.competitions[0].odds?.[0].details?.split(' -')[1]
const total = props.game.competitions[0].odds?.[0].overUnder
const money1 = props.game.competitions[0].odds?.[0].current?.over?.alternateDisplayValue
const money2 = props.game.competitions[0].odds?.[0].current?.under?.alternateDisplayValue
const state = props.game.status.type.description

const visitorConf = props.game.competitions[0].competitors[1].team.conferenceId
const visitorLogo = props.game.competitions[0].competitors[1].team.logo
const visitorRank = props.game.competitions[0].competitors[1].curatedRank?.current
const visitorName = props.game.competitions[0].competitors[1].team.abbreviation
const visitorRecord = props.game.competitions[0].competitors[1].records?.[0].summary
const visitorScore = props.game.competitions[0].competitors[1].score
const visitorWin = props.game.competitions[0].competitors[1].winner
const visitorLocation = props.game.competitions[0].competitors[1].homeAway

const homeConf = props.game.competitions[0].competitors[0].team.conferenceId
const homeLogo = props.game.competitions[0].competitors[0].team.logo
const homeRank = props.game.competitions[0].competitors[0].curatedRank?.current
const homeName = props.game.competitions[0].competitors[0].team.abbreviation
const homeRecord = props.game.competitions[0].competitors[0].records?.[0].summary
const homeScore = props.game.competitions[0].competitors[0].score
const homeWin = props.game.competitions[0].competitors[0].winner
const homeLocation = props.game.competitions[0].competitors[0].homeAway

const oddsOff = computed(() => !spread)
const visitorBet = computed(() => (favorite === visitorName ? 'fav' : 'dog'))
const visitorSpread = computed(() => (spread ? (favorite === visitorName ? `-${spread}` : `+${spread}`) : '--'))
const homeBet = computed(() => (favorite === homeName ? 'fav' : 'dog'))
const homeSpread = computed(() => (spread ? (favorite === homeName ? `-${spread}` : `+${spread}`) : '--'))

function handleBetClick(e) {
  console.log(e.target.id)
  const betId = e.target.id

  //remove bet if clicked on an existing bet
  if (e.target.classList.contains('bet')) {
    const idIndex = betSlip.value.findIndex(bet => bet.betId === betId)
    betSlip.value.splice(idIndex, 1)
    e.target.classList.remove('bet')
    console.log(betSlip.value)
    return
  }

  e.target.classList.add('bet')

  const betType = e.target.getAttribute('betType')
  const line = betType === 'spread' ? e.target.getAttribute('line').slice(1) : e.target.getAttribute('line')

  const player1bet = e.target.getAttribute('bet')
  const player1type = e.target.getAttribute('pickType')
  const player1loc = e.target.getAttribute('location')
  const player1logo = e.target.getAttribute('bet') === homeName ? homeLogo : visitorLogo

  // const player2bet = e.target.getAttribute('bet') === homeName ? visitorName : homeName
  // const player2type = player1type === 'fav' ? 'dog' : player1type === 'dog' ? 'fav' : player1type === 'over' ? 'under' : 'over'
  // const player2loc = player1loc === 'nue' || player1loc === 'na' ? player1loc : player1loc === 'home' ? 'away ' : 'home'
  // const player2logo = e.target.getAttribute('bet') === homeName ? visitorLogo : homeLogo

  let player2logo
  let player2bet
  let player2type
  let player2loc
  if (betType === 'total') {
    player2bet = e.target.getAttribute('bet') === 'OVER' ? 'UNDER' : 'OVER'
    player2type = player1type === 'over' ? 'under' : 'over'
    player2loc = 'na'
    player2logo = e.target.getAttribute('bet') === 'OVER' ? 'U' : 'O'
  } else {
    player2bet = e.target.getAttribute('bet') === homeName ? visitorName : homeName
    player2type = player1type === 'fav' ? 'dog' : 'fav'
    player2loc = player1loc === 'nue' ? player1loc : player1loc === 'home' ? 'away ' : 'home'
    player2logo = e.target.getAttribute('bet') === homeName ? visitorLogo : homeLogo
  }

  const newBet = {
    sport: sport,
    league: league,
    gameId: gameId,
    gameState: timeTv,
    betId: betId,
    startDate: new Date(date),
    startTime: new Date(date).getTime().toString(),
    matchup: matchup,
    favorite: favorite || 'na',
    betType: betType,
    line: line,
    wager: '100',
    isPaid: false,
    proposeDate: serverTimestamp(),
    acceptDate: serverTimestamp(),

    player1bet: player1bet,
    player1score: 'tbd',
    player1result: 'tbd',
    player1loc: player1loc || 'na',
    player1type: player1type,
    player1conf: 'na',
    player1logo: player1logo,

    player2bet: player2bet,
    player2score: 'tbd',
    player2result: 'tbd',
    player2loc: player2loc,
    player2type: player2type,
    player2conf: 'na',
    player2logo: player2logo,
  }

  betSlip.value.push(newBet)
  console.log(betSlip.value)
}
</script>

<!-- ------------------------------------------------- -->

<template>
  <section :id="gameId" class="game-pod" :data-state="state">
    <div class="info">
      <div class="time">{{ timeTv }}</div>
    </div>

    <table>
      <tr class="away" :class="{win: visitorWin}">
        <td class="team">
          <img class="logo" :src="visitorLogo" />
          <p v-if="visitorRank < 26" class="rank-record">{{ visitorRank }}</p>
          <p class="name">{{ visitorName }}</p>
          <p class="rank-record">({{ visitorRecord }})</p>
        </td>

        <td class="score">
          {{ visitorScore }}
          <p v-if="visitorWin">&#9666;</p>
        </td>

        <!-- Away Spread -->
        <td @click="handleBetClick" :id="gameId + '-spread-' + visitorBet" class="odds spread" :class="{oddsOff: oddsOff}" betType="spread" :picktype="visitorBet" :bet="visitorName" :line="visitorSpread" :location="visitorLocation">{{ visitorSpread }}</td>

        <!-- Away Total -->
        <td @click="handleBetClick" :id="gameId + '-total-over'" class="odds total" :class="{oddsOff: oddsOff}" betType="total" picktype="over" bet="OVER" :line="total">o{{ total }}</td>

        <!-- Away Moneyline -->
        <td @click="handleBetClick" :id="gameId + '-money-moneyAway'" class="odds money oddsOff" betType="money" picktype="moneyAway" bet="moneyAway" :line="money1">{{ money1 }}</td>
      </tr>

      <tr class="home" :class="{win: homeWin}">
        <td class="team">
          <img class="logo" :src="homeLogo" />
          <p v-if="homeRank < 26" class="rank-record">{{ homeRank }}</p>
          <p class="name">{{ homeName }}</p>
          <p class="rank-record">({{ homeRecord }})</p>
        </td>

        <td class="score">
          {{ homeScore }}
          <p v-if="homeWin">&#9666;</p>
        </td>

        <!-- Home Spread -->
        <td @click="handleBetClick" :id="gameId + '-spread-' + homeBet" class="odds spread" :class="{oddsOff: oddsOff}" betType="spread" :picktype="homeBet" :bet="homeName" :line="homeSpread" :location="homeLocation">{{ homeSpread }}</td>

        <!-- Home Total -->
        <td @click="handleBetClick" :id="gameId + '-total-under'" class="odds total" :class="{oddsOff: oddsOff}" betType="total" picktype="under" bet="UNDER" :line="total">u{{ total }}</td>

        <!-- Home Moneyline -->
        <td @click="handleBetClick" :id="gameId + '-money-moneyHome'" class="odds money oddsOff" betType="money" picktype="moneyHome" bet="moneyHome" :line="money2">{{ money2 }}</td>
      </tr>
    </table>
  </section>
</template>

<!-- ------------------------------------------------- -->

<style scoped>
.game-pod:last-child {
  border-bottom: none;
}

.game-pod {
  position: relative;
  border-bottom: 1px solid lightgray;
  background: white;
  padding: 1rem;
}

.info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

table {
  width: 100%;
}

tr {
  display: flex;
}

tr.win {
  font-weight: bold;
}

th {
  font-weight: initial;
}

.team {
  width: 100%;
  /* font-size: 1.15rem; */
}

.score {
  min-width: 3rem;
  max-width: 3rem;
}

.odds {
  min-width: 3.25rem;
  max-width: 3.25rem;
  margin: 0 0.15rem;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid gainsboro;
  border-radius: 4px;
  padding: 6px 0;
  margin: 0.15rem;
  cursor: pointer;
  background: gainsboro;
}

.oddsOff {
  background: white;
  color: lightgray;
  cursor: not-allowed;
  /* pointer-events: none; */
}

td.team,
td.score {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
}

.logo {
  width: 1.5rem;
  height: 1.5rem;
}

.rank-record,
.name {
  padding-left: 0.5rem;
}

.rank-record {
  font-size: 0.85rem;
  color: gray;
}

.score {
  min-width: 3rem;
  max-width: 3rem;
  /* font-size: 1.15rem; */
}

/* & td.spread.win,
  & td.total.win {
    box-shadow: rgb(0 195 90 / 0.3) 0px 1px 4px;
    color: rgb(0 195 90);
    font-weight: bold;
  }

  & td.spread.loss,
  & td.total.loss {
    box-shadow: none;
    color: transparent;
  }

  & tr[data-winner='true'] {
    font-weight: bold;
  } */

td.bet {
  background: black;
  color: white;
}
/*  */
/* .bet.win { */
/* border: 1px solid rgb(0, 255, 0); */
/* background: rgb(0, 255, 0, 0.1); */
/* } */
/* .bet.loss { */
/* border: 1px solid rgb(255, 0, 0); */
/* background: rgb(255, 0, 0, 0.1); */
/* } */
/*  */
/* .nfl { */
/* background-color: red; */
/* } */
/*  */
/* .week-selection { */
/* padding: 0.75rem; */
/* border-radius: 0.75rem; */
/* } */
/*  */
/* .week-selection.active { */
/* color: white; */
/* background: black; */
/* } */
</style>
