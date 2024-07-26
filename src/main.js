import './assets/main.css'
import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {auth} from '@/firebase.js'
import {onAuthStateChanged} from 'firebase/auth'
import router from '@/router.js'
import App from './App.vue'
import {query, orderBy, onSnapshot, or, where} from 'firebase/firestore'
import {soiUsers, soiBook} from '@/firebase.js'

//set language to english for vant library
import {Locale} from 'vant'
import enUS from 'vant/es/locale/lang/en-US'
Locale.use('en-US', enUS)

import {storeToRefs} from 'pinia'
import {useBookStore} from '@/stores/BookStore.js'

let app
let USER
let USERS = ''
let userEmail = ''

onAuthStateChanged(auth, user => {
  USER = user
  console.log('USER:', USER?.displayName, USER?.email)
  if (!app) {
    //USERS DATA (firebase)
    const usersQuery = query(soiUsers, orderBy('displayName', 'asc'))

    onSnapshot(usersQuery, snap => {
      USERS = snap.docs.map(doc => ({...doc.data(), id: doc.id}))
      console.log('USERS', USERS)
    })

    app = createApp(App).use(createPinia()).use(router).mount('#app')
  }

  //USER BOOK
  const bookStore = useBookStore()
  const {betsRaw, betsStaged} = storeToRefs(bookStore)

  userEmail = USER.email

  //BOOK DATA (firebase)
  const bookQuery = query(soiBook, or(where('player1email', '==', userEmail), where('player2email', '==', userEmail)), orderBy('startDate', 'desc'), orderBy('startTime', 'asc'))

  onSnapshot(bookQuery, snap => {
    console.log('BOOK SNAPSHOT FIRED')

    betsRaw.value = snap.docs.map(doc => ({...doc.data(), id: doc.id}))
    betsStaged.value = []

    //stage UserBets
    betsRaw.value.map(bet => {
      const userRole = USER.displayName === bet.player1name ? 'player1' : 'player2'
      const counterparty = USER.displayName === bet.player1name ? 'player2' : 'player1'
      betsStaged.value.push({
        gameId: bet.gameId,
        gameState: bet.gameState,
        userName: bet[`${userRole}name`],
        player1name: bet.player1name,
        counterparty: bet[`${counterparty}name`],
        bet: bet[`${userRole}bet`],
        result: bet[`${userRole}result`],
        score: bet[`${userRole}score`],
        result: bet[`${userRole}result`],
        betLogo: bet[`${userRole}logo`],
        homeTeam: bet.matchup.split(' ')[2],
        homeScore: bet.player1bet === bet.matchup.split(' ')[2] ? bet.player1score : bet.player2score,
        awayTeam: bet.matchup.split(' ')[0],
        awayScore: bet.player1bet === bet.matchup.split(' ')[2] ? bet.player2score : bet.player1score,
        wager: bet.wager,
        isPaid: bet.isPaid,
        startDate: bet.startDate,
        creator: bet.player1name,
        id: bet.id,
        line: bet.betType === 'total' ? bet.line : bet.favorite === bet[`${userRole}bet`] ? String(bet.line * -1) : `+${bet.line}`,
      })
    })

    console.log('USER BETS', betsStaged.value)
  })
})

export {USER, USERS}
