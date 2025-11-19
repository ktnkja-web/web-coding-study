"use strict";


// ▼ Firebaseの設定をここに貼り付ける（Firebaseコンソールでコピーしたやつ）
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get, push, query, limitToLast, runTransaction, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUel9GDRaodbMnZNXhwU0EPouhUPZaITE",
  authDomain: "trpg-test.firebaseapp.com",
  databaseURL: "https://trpg-test-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trpg-test",
  storageBucket: "trpg-test.appspot.com",
  messagingSenderId: "308329211776",
  appId: "1:308329211776:web:434044642d448aa7b0c365"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

signInAnonymously(auth)
  .then((result) => console.log(result.user.uid))
  .catch(console.error);

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("uid").textContent = user.uid;

    document.getElementById("sendBtn").addEventListener("click", () => {
      set(ref(db, `uids/${user.uid}`), {
        requestedAt: new Date().toISOString()
      })
        .then(() => alert("申請を送信しました！管理者の承認をお待ちください。"))
        .catch(console.error);
    });
  }
});