<script setup>
import {storeToRefs} from 'pinia'
import {useRouter} from 'vue-router'
import {signOut} from 'firebase/auth'
import {auth} from '@/firebase.js'
import {useBookStore} from '@/stores/BookStore.js'
import {useGamesStore} from '@/stores/GamesStore.js'

const bookStore = useBookStore()
const {betsRaw, betsStaged, unpaidBalances} = storeToRefs(bookStore)
const gamesStore = useGamesStore()
const {betSlip} = storeToRefs(gamesStore)

//Log out
const router = useRouter()
const handleLogout = async () => {
  await signOut(auth)
  betsRaw.value = []
  betsStaged.value = []
  unpaidBalances.value = []
  betSlip.value = []
  router.push({name: 'GamesView'})
}
</script>

<template>
  <button @click="handleLogout" class="btn">Logout</button>
</template>
