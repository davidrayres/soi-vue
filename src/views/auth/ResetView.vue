<script setup>
import {ref} from 'vue'
import {auth} from '@/firebase.js'
import {sendPasswordResetEmail} from 'firebase/auth'
import {useRouter} from 'vue-router'

const router = useRouter()
const email = ref('')

const handleSubmit = () => {
  sendPasswordResetEmail(auth, email.value)
    .then(() => {
      alert(`Instructions to reset your password have been sent to ${email.value}.
      Check your junk mail folder if not received in a few minutes.`)
    })
    .catch(error => {
      console.log(error)
    })

  router.push({name: 'LoginView'})
}
</script>

<template>
  <div class="login">
    <RouterLink :to="{name: 'GamesView'}" class="close">&times;</RouterLink>
    <img src="@/assets/soi.png" alt="" />
    <h2 class="title">Forgot your password?</h2>

    <p>Enter the email address associated with your account, and we'll send you a link to reset your password.</p>
    <form @submit.prevent="handleSubmit">
      <form @submit.prevent="handleSubmit">
        <input type="email" placeholder="email" v-model="email" required />
        <button :class="{enabled: email}">Sent Reset Link</button>
      </form>
    </form>
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

small {
  position: absolute;
  left: 20px;
  bottom: -5px;
  color: red;
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
  margin-bottom: 1rem;
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

.login-agreemnt {
  font-style: italic;
  font-size: 0.8rem;
  font-weight: 300;
}

.login-agreemnt a {
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
</style>
