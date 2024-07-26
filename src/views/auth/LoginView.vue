<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {auth} from '@/firebase.js'
import {signInWithEmailAndPassword} from 'firebase/auth'

const router = useRouter()

const loginError = ref(null)
const isPending = ref(false)
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  loginError.value = null
  isPending.value = true

  try {
    const res = await signInWithEmailAndPassword(auth, email.value, password.value)
    if (!res) {
      throw new Error('Could not login')
    }
    loginError.value = null
    isPending.value = false
  } catch (err) {
    console.log(err.message)
    loginError.value = 'Invalid log in credentials'
    isPending.value = false
  }

  console.log(!loginError.value)
  if (!loginError.value) {
    router.push({name: 'GamesView'})
  }
}

function handleVisibilty(e) {
  const input = document.getElementById('password-input')
  const icon = document.getElementById('visibility-btn')
  if (input.type === 'password') {
    input.type = 'text'
    icon.innerHTML = 'visibility'
  } else {
    input.type = 'password'
    icon.innerHTML = 'visibility_off'
  }
}
</script>

<template>
  <div class="login">
    <RouterLink :to="{name: 'GamesView'}" class="close">&times;</RouterLink>
    <img src="@/assets/soi.png" alt="" />
    <h1 class="title">Scores Of Interest</h1>
    <div class="tagline">Simple.&nbsp;&nbsp;Friendly.&nbsp;&nbsp;Wager.</div>
    <div class="tagline">Peer-to-peer... a better bet.</div>

    <form @submit.prevent="handleSubmit">
      <input type="email" required placeholder="email" v-model="email" />

      <div class="password-container">
        <input id="password-input" type="password" required placeholder="password" v-model="password" />

        <i @click="handleVisibilty" class="material-icons vis-btn"> visibility_off </i>

        <RouterLink :to="{name: 'ResetView'}" class="forgot-pwd">Forgot password?</RouterLink>
      </div>

      <div class="error">{{ loginError }}</div>
      <button :class="{enabled: email && password}">Log In</button>
    </form>

    <p class="login-agreement">By signing in, you are agreeing to our <a href="#">privacy policy</a>, <a href="#">terms of use</a> and <a href="#">code of conduct</a>.</p>

    <hr />

    <p class="auth-link">
      No account yet?&nbsp;&nbsp;
      <RouterLink :to="{name: 'CreateView'}">Create an account.</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.login {
  position: relative;
  text-align: center;
  width: 300px;
  margin: auto;
}

.close {
  position: absolute;
  /* top: 1rem; */
  right: -1.5rem;
  font-size: 2.5rem;
  font-weight: 100;
  color: gray;
}

img {
  width: auto;
  height: 80px;
  margin-top: 2rem;
}

.title {
  margin: 0.5rem 0 1rem 0;
}

.tagline {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

form {
  margin-top: 3rem;
}

input,
button {
  width: 100%;
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #ddd;
  outline: none;
  margin: 10px auto;
  font-size: 1rem;
}

button {
  color: #999;
  margin: 3rem 0 2rem 0;
}

button.enabled {
  background: black;
  color: white;
}
.password-container {
  position: relative;
}

.vis-btn {
  position: absolute;
  top: 19px;
  right: 12px;
}

.forgot-pwd {
  position: absolute;
  top: 25px;
  right: 10px;
  font-weight: 400;
  margin-top: 2rem;
  text-decoration: none;
  color: rgb(59, 73, 223);
}

.login-agreement {
  font-style: italic;
  font-size: 0.8rem;
  font-weight: 300;
}

.login-agreement a {
  text-decoration: none;
  color: rgb(59, 73, 223);
}

hr {
  border: none;
  height: 1px;
  background: rgb(200, 200, 200);
  margin: 3rem 0;
}
span {
  color: rgb(59, 73, 223);
  cursor: pointer;
}

.auth-link {
  margin-bottom: 3rem;
}
</style>
