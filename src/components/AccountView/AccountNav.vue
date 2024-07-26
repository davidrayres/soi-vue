<script setup>
import {USER} from '@/main.js'
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import {signOut} from 'firebase/auth'
import {auth} from '@/firebase.js'
import BtnCreateAcct from '@/components/AuthViews/BtnCreateAcct.vue'
import BtnLogin from '@/components/AuthViews/BtnLogin.vue'
import BtnLogout from '@/components/AuthViews/BtnLogout.vue'

const user = computed(() => USER)

//Log out
// const router = useRouter()
// const handleLogout = async () => {
// await signOut(auth)
// router.push({name: 'GamesView'})
// }
</script>

<template>
  <header id="header">
    <div class="header-content">
      <div id="user-select-btn" class="user-select-btn flex-ctr">
        <span class="material-icons">account_circle</span>
        <span>&nbsp;{{ user?.displayName }}&nbsp;</span>
      </div>
      <!-- <button v-if="user" @click="handleLogout" class="btn">Logout</button> -->
      <BtnLogout v-if="user" />
      <div v-else class="button-container flex-ctr">
        <BtnCreateAcct />
        <BtnLogin />
      </div>
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

.button-container {
  gap: 10px;
}
</style>
