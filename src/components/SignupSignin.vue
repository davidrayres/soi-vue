<script setup>
import BtnLogin from '@/components/AuthViews/BtnLogin.vue'
import BtnCreateAcct from '@/components/AuthViews/BtnCreateAcct.vue'
</script>

<template>
  <div class="signup-signin">
    <div>
      <div class="text">Please log in to see your book?</div>
      <BtnLogin />
    </div>
    <div>
      <div class="text">Don't have an account yet?</div>
      <BtnCreateAcct />
    </div>
  </div>
</template>

<style scoped>
.signup-signin {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: auto;
}

.signup-signin div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.text {
  margin: 2rem 0;
  font-size: 1.3rem;
  letter-spacing: 1px;
}
</style>
