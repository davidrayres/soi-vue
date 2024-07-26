<script setup>
import {USER} from '@/main.js'
</script>

<template>
  <footer id="#footer" class="nav-main">
    <RouterLink :to="{name: 'GamesView'}" class="nav-btn"> <i class="material-icons">scoreboard</i> Home </RouterLink>

    <RouterLink :to="{name: 'BookView'}" class="nav-btn"> <i class="material-icons">import_contacts</i> My BookX </RouterLink>

    <!-- <RouterLink :to="{name: 'StatsView'}" class="nav-btn"> <i class="material-icons">analytics</i> Stats </RouterLink> -->

    <RouterLink :to="{name: 'AccountView'}" class="nav-btn"> <i class="material-icons"> account_circle</i> Account </RouterLink>
  </footer>
</template>

<!-- ------------------------------------------------- -->

<style scoped>
.nav-main {
  display: flex;
  width: 100%;
  position: fixed;
  background-color: whitesmoke;
  z-index: 900;
  justify-content: space-evenly;
  height: 80px;
  bottom: 0;
  align-items: flex-start;
  padding-top: 5px;
}

.nav-btn {
  color: gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  width: 70px;
  height: 50px;
  letter-spacing: 1px;
}

.material-icons {
  margin-bottom: 0.25rem;
}

a.router-link-active {
  color: black;
  font-weight: bold;
  /* background: rgba(0, 0, 0, 0.1); */
  /* border-radius: 10px; */
}
</style>
