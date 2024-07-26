<script setup></script>

<template>
  <div class="search-container flex-ctr">
    <i class="material-icons">search</i>
    <input type="text" placeholder="search games" />
  </div>
</template>

<style scoped>
.search-container {
  justify-content: left;
  background: whitesmoke;
  color: gray;
  padding: 0 1rem;
  margin: 0.5rem 3rem;
  border-radius: 20px;
}

.search-container > input {
  border: 0;
  background: transparent;
  margin-left: 0.5rem;
  width: 100%;
  height: 2rem;
  outline: none;
  font-size: 1rem;
}
</style>
