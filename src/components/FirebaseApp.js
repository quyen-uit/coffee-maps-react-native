import * as firebase from 'firebase';
const firebaseConfig = {
  apiKey: 'AIzaSyDW07W7ISfxRw3tEVrcP7YCYt4LNYe7CUk',
  authDomain: 'coffeemaps-1571054120730.firebaseapp.com',
  databaseURL: 'https://coffeemaps-1571054120730.firebaseio.com',
  projectId: 'coffeemaps-1571054120730',
  storageBucket: 'coffeemaps-1571054120730.appspot.com',
  messagingSenderId: '106483777889',
  appId: '1:106483777889:web:a16673b365e3d9e3724520',
  measurementId: 'G-96MXTH79B2',
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);
