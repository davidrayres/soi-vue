<script setup>
import {ref} from 'vue'
import {auth, db} from '@/firebase.js'
import {doc, setDoc, addDoc} from 'firebase/firestore'
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {useRouter} from 'vue-router'

const router = useRouter()

const signupError = ref(null)
const isPending = ref(false)

const firstName = ref('')
const lastName = ref('')
const displayName = ref('')
const email = ref('')
const mobile = ref('')
const password = ref('')
const passwordConfirm = ref('')

const handleSubmit = async () => {
  await _signup(firstName.value, lastName.value, displayName.value, email.value, mobile.value, password.value)
  router.push({name: 'GamesView'})
}

const _signup = async (firstName, lastName, displayName, email, mobile, password) => {
  signupError.value = null
  isPending.value = true

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    if (!res) {
      throw new Error('Could not complete Sign Up.')
    }
    await updateProfile(auth.currentUser, {displayName: displayName, phoneNumber: mobile})

    //add user to soiUser collection --------------------------------
    console.log(res)
    const docRef = doc(db, 'soiUsers', res.user.uid)
    const payload = {
      firstName: firstName,
      lastName: lastName,
      displayName: displayName,
      email: email,
      mobile: mobile,
    }
    console.log(payload)
    await setDoc(docRef, payload)
    //---------------------------------------------------------------

    signupError.value = null
    isPending.value = false
  } catch (err) {
    console.log('ERROR MESSAGE:', err.message)
    signupError.value = 'Unable to sign up'
    isPending.value = false
  }
}

function handleVisibilty() {
  const input = document.getElementById('password-input')
  const confirm = document.getElementById('password-confirm')
  const icon = document.getElementById('visibility-btn')
  if (input.type === 'password') {
    input.type = 'text'
    confirm.type = 'text'
    icon.innerHTML = 'visibility'
  } else {
    input.type = 'password'
    confirm.type = 'password'
    icon.innerHTML = 'visibility_off'
  }
}
</script>

<template>
  <div class="login">
    <RouterLink :to="{name: 'GamesView'}" class="close">&times;</RouterLink>
    <img src="@/assets/soi.png" alt="" />
    <h1 class="title">Scores Of Interest</h1>
    <div class="tagline">Simple.&nbsp;&nbsp;Friendly.&nbsp;&nbsp;Wagers.</div>
    <div class="tagline">Peer-to-peer... a better bet.</div>

    <form @submit.prevent="handleSubmit">
      <input type="text" placeholder="first name" v-model="firstName" required />
      <input type="text" placeholder="last name" v-model="lastName" required />
      <input type="text" class="has-msg" placeholder="display name" v-model="displayName" maxlength="10" required />
      <div class="msg">10 character maximum</div>
      <input type="email" placeholder="email" v-model="email" required />
      <!-- <input type="tel" class="has-msg" placeholder="mobile number" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" v-model="mobile" required /> -->
      <!-- <div class="msg">format must be 123-123-1234</div> -->

      <div class="password-container">
        <input id="password-input" type="password" placeholder="password" v-model="password" required />
        <i @click="handleVisibilty" class="material-icons vis-btn"> visibility_off </i>
        <input id="password-confirm" class="has-msg" type="password" placeholder="re-type password" v-model="passwordConfirm" required />
        <div v-if="password !== passwordConfirm" class="pwd-error-msg msg">password inputs do not match</div>
      </div>

      <div class="error">{{ signupError }}</div>
      <button :class="{enabled: !!displayName && !!email && !!password && password === passwordConfirm}">Create Account</button>
    </form>

    <p class="login-agreemnt">By signing up, you are agreeing to our <a href="#">privacy policy</a>, <a href="#">terms of use</a> and <a href="#">code of conduct</a>.</p>

    <hr />

    <p class="auth-link">
      Already have an account?&nbsp;&nbsp;
      <RouterLink :to="{name: 'LoginView'}">Log in.</RouterLink>
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
  margin-top: 2rem;
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

.has-msg {
  margin-bottom: 0;
}

.msg {
  color: gray;
  text-align: initial;
  margin-left: 1rem;
  margin-bottom: 0.5rem;
}

.pwd-error-msg {
  color: red;
}

button {
  color: #999;
  margin-top: 2rem;
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
  margin: 2rem 0;
}

span {
  color: rgb(59, 73, 223);
  cursor: pointer;
}

.auth-link {
  margin-bottom: 3rem;
}
</style>
