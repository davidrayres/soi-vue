import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore, collection} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAINP3DIhPITAlYdy5J5FB6gXlcAKHKsZs',
  authDomain: 'scoresofinterest.firebaseapp.com',
  projectId: 'scoresofinterest',
  storageBucket: 'scoresofinterest.appspot.com',
  messagingSenderId: '1049737377069',
  appId: '1:1049737377069:web:e6daa416d0159a4f884fa4',
}

initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()
const soiBook = collection(db, 'soiBook')
const soiUsers = collection(db, 'soiUsers')

export {db, auth, soiBook, soiUsers}
