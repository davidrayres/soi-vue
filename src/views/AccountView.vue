<script setup>
// import {USER} from '@/main.js'
import {ref} from 'vue'
import {PullRefresh, showToast} from 'vant'
import AccountNav from '@/components/AccountView/AccountNav.vue'
import MainNav from '@/components/MainNav.vue'

//Pull to refresh
const loading = ref(false)
const onRefresh = () => {
  setTimeout(() => {
    showToast('Refresh Success')
    loading.value = false
    console.log('refresh')
  }, 1000)
  location.reload()
}
</script>

<template>
  <AccountNav />

  <PullRefresh v-model="loading" @refresh="onRefresh">
    <main>
      <div class="temp-msg">ACCOUNT SETTINGS COMING SOON</div>
    </main>
  </PullRefresh>

  <MainNav />
</template>

<style scoped>
.temp-msg {
  margin-top: 10rem;
  text-align: center;
}
</style>
