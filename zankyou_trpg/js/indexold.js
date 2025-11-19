"use strict";

const playerNames = {
  "player1": "『矢野 亨』",
  "player2": "『一葉 朔』",
  "player3": "『芦原 アカリ』",
};

//URLからplayerを取得
const params = new URLSearchParams(window.location.search);
const currentPlayerId = params.get("player");
document.getElementById("player-info").textContent = `あなたは ${playerNames[currentPlayerId] || currentPlayerId} です`;

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

const ADMIN_UID = "30hzRVL9h5bDIdawaIthXQZM55W2";

onAuthStateChanged(auth, async (user) => {
  const debug = document.getElementById("debug");
  const consoleWrapper = document.getElementById("console");
  if (!user) return;

  const uid = user.uid;
  debug.textContent = `Your UID: ${uid}`;

  if (uid === ADMIN_UID) {
    consoleWrapper.classList.remove("console-active");
    debug.textContent = `管理者としてログインしました: ${uid}`;
    return;
  }

  consoleWrapper.classList.add("console-active");
});

signInAnonymously(auth).catch(console.error);

// 取得資料の表示
const docmetaRef = ref(db, "documentsMeta");
const docRef = ref(db, `situation/${currentPlayerId}/documents`);
// 資料のメタ情報を最初に取得してキャッシュ
let allMeta = {};
let currentDocs = [];

function tryRender() {
  if (Object.keys(allMeta).length > 0 && currentDocs.length > 0) {
    renderAccordion(currentDocs);
  }
}

get(docmetaRef).then((snapshot) => {
  allMeta = snapshot.val() || {};
  tryRender();
});

// プレイヤーの取得資料の監視
onValue(docRef, (snapshot) => {
  const data = snapshot.val() || {};
  currentDocs = Object.keys(data).filter(id => data[id]);
  tryRender();
});

// アコーディオン開閉
const accordion = document.getElementById("accordion");
const accordionButton = document.getElementById("accordion-button");
const buttonText = document.getElementById("button-text");
const accordionIcon = document.getElementById("accordion-icon");
accordionButton.addEventListener("click", () => {
  accordion.classList.toggle("active");
  accordionButton.classList.toggle("active");

  if (accordion.classList.contains("active")) {
    accordionIcon.classList.replace("fa-square-caret-down", "fa-square-caret-up");
  } else {
    accordionIcon.classList.replace("fa-square-caret-up", "fa-square-caret-down");
  }
});

document.addEventListener("click", (event) => {
  if (
    accordion.classList.contains("active") &&
    !accordion.contains(event.target) &&
    !accordionButton.contains(event.target)
  ) {
    accordion.classList.remove("active");
    accordionButton.classList.remove("active");

    accordionIcon.classList.replace("fa-square-caret-up", "fa-square-caret-down");
  }
});

// 上で書いてるrenderAccordion（アコーディオン）の中身
function renderAccordion(docIds) {
  accordion.innerHTML = "";
  docIds.forEach(id => {
    const meta = allMeta[id];
    if (!meta) return;

    const titles = document.createElement("p");
    titles.textContent = meta.title;
    titles.className = "accordion-item";

    titles.addEventListener("click", () => {
      displayDocument(meta);
      buttonText.textContent = meta.title;

      // 選んだ資料のIDを localStorage に保存
      localStorage.setItem("selectedDocId", id);
    });

    accordion.appendChild(titles);
  });
  // 保存されたIDがあれば再表示
  const savedId = localStorage.getItem("selectedDocId");
  if (savedId && docIds.includes(savedId)) {
    const savedMeta = allMeta[savedId];
    if (savedMeta) {
      displayDocument(savedMeta);
      buttonText.textContent = savedMeta.title;
    }
  }
}

accordion.classList.remove('active');

function displayDocument(meta) {
  document.getElementById("contents").textContent = meta.description;
}

// 資料の追加と削除
const docConsole = document.getElementById("doc-console");
const playersRef = ref(db, "situation");

let cachedMeta = {};
let cachedPlayers = {};

// ログを push する共通関数
function pushLog(player, docTitle, action) {
  const ts = Date.now();
  const playerName = playerNames[player] || player;
  const msg = `${playerName}が「${docTitle}」を${action}しました。(${new Date(ts).toLocaleString()})`;
  push(ref(db, "public/logs"), {
    type: "document",
    player,
    message: msg,
    timestamp: ts
  }).catch(console.error);
}

// 小さなボタン生成ヘルパー
function createButton(text, { disabled = false, onClick = null } = {}) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.disabled = disabled;
  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}

// 取得・放棄処理（DB 操作をこの層にまとめる）
function acquireDocument(pid, docId, docTitle) {
  // 単純にフラグを立てる場合
  set(ref(db, `situation/${pid}/documents/${docId}`), true)
    .then(() => pushLog(pid, docTitle, "取得"))
    .catch(console.error);
}

function dropDocument(pid, docId, docTitle) {
  remove(ref(db, `situation/${pid}/documents/${docId}`))
    .then(() => pushLog(pid, docTitle, "喪失"))
    .catch(console.error);
}

// レンダリング関数（cachedMeta / cachedPlayers を使う）
function render() {
  docConsole.innerHTML = "";
  const frag = document.createDocumentFragment();

  Object.entries(cachedMeta).forEach(([docId, doc]) => {
    const docTitleEl = document.createElement("p");
    docTitleEl.textContent = `${doc.title} (${docId})`;
    frag.appendChild(docTitleEl);

    Object.keys(cachedPlayers).forEach(pid => {
      const raw = cachedPlayers[pid]?.documents?.[docId];
      // 過去に文字列で保存されていたケースに対応するため tolerant に判定
      const owned = raw === true || raw === "true";
      const playerName = playerNames[pid] || player;

      const getBtn = createButton(`${playerName}が取得`, {
        disabled: owned,
        onClick: () => acquireDocument(pid, docId, doc.title)
      });
      const dropBtn = createButton(`${playerName}が放棄`, {
        disabled: !owned,
        onClick: () => dropDocument(pid, docId, doc.title)
      });

      frag.appendChild(getBtn);
      frag.appendChild(dropBtn);
    });

    frag.appendChild(document.createElement("hr"));
  });

  docConsole.appendChild(frag);
}

// --- リスナーはネストせずにキャッシュ更新だけ行い render() を呼ぶ ---
onValue(docmetaRef, (snap) => {
  cachedMeta = snap.val() || {};
  render();
});

onValue(playersRef, (snap) => {
  cachedPlayers = snap.val() || {};
  render();
});

// 現在地取得
const locationRef = ref(db, `situation/${currentPlayerId}/location`);
onValue(locationRef, (snapshot) => {
  const locationName = snapshot.val();

  if (locationName) {
    const locmetaRef = ref(db, `locationMeta/${locationName}`);
    onValue(locmetaRef, (metaSnap) => {
      const locationData = metaSnap.val();

      // HTML要素取得
      const nameEl = document.getElementById("location-name");
      const imgEl = document.getElementById("location-img");
      const exploreEl = document.getElementById("explore-list");

      // オーバーレイ生成（初回のみ）
      if (!document.getElementById("image-overlay")) {
        const overlay = document.createElement("div");
        overlay.id = "image-overlay";
        imgEl.parentElement.style.position = "relative";
        imgEl.parentElement.appendChild(overlay);
      }
      const overlay = document.getElementById("image-overlay");

      // フェード＋発光エフェクト開始
      overlay.style.transition = "opacity 0.5s ease";
      overlay.style.opacity = 1; // 徐々に暗くなる
      imgEl.style.transition = "opacity 1.5s ease";
      imgEl.style.opacity = 0; // 画像をゆっくり消す
      // 少し待ってから画像を差し替え
      setTimeout(() => {
        // データ反映
        nameEl.textContent = locationName;
        imgEl.src = `/image/${locationData.filename}`;
        exploreEl.innerHTML = (locationData.explorepoint || [])
          .map(p => `<li>👁️‍🗨️${p}</li>`).join("");

        // 光の演出
        overlay.classList.add("brighten");
        imgEl.style.opacity = 1;

        // 終了後リセット
        setTimeout(() => {
          overlay.style.transition = "opacity 1.5s ease";
          overlay.style.opacity = 0; // 周囲がゆっくり明るく
          imgEl.style.opacity = 1;   // 画像もゆっくり浮かぶ
        }, 600); // 暗転が完了してから発光を始める
      }, 1500); // 暗転完了タイミング
    });
  }
});

// プレイヤーを移動させる関数
function movePlayer(pid, locationName) {
  const locRef = ref(db, `situation/${pid}/location`);
  return set(locRef, locationName)
    .then(() => {
      if (locationName !== "間取り図") {
        const locTimestamp = Date.now();
        const date = new Date(locTimestamp);
        const playerName = playerNames[pid] || player;
        const logMessage = `${playerName}が ${locationName} に移動しました。(${date.toLocaleString()})`;
        push(ref(db, "public/logs"), {
          type: "location",
          player: pid,
          message: logMessage,
          timestamp: locTimestamp
        });
      }
    })
    .catch((err) => {
      console.error("エラー:", err);
    });
}

async function renderConsole() {
  try {
    const metaRef = ref(db, "locationMeta");
    const snapshot = await get(metaRef);
    const locations = snapshot.val();

    const playersSnap = await get(playersRef);
    const plaeyrsData = playersSnap.val() || {};
    const playerIds = Object.keys(plaeyrsData);

    // プレイヤーごとにボタンを追加
    playerIds.forEach(pid => {
      const container = document.querySelector(`#console-${pid} .buttons`);
      container.innerHTML = ""; // 初期化

      Object.keys(locations || {}).forEach(locationName => {
        const btn = document.createElement("button");
        btn.textContent = locationName;
        btn.addEventListener("click", () => movePlayer(pid, locationName));
        container.appendChild(btn);
      });
    });
  } catch (err) {
    alert("エラー発生" + err.message);
  }
}
renderConsole();

// ダイス
document.getElementById("rollBtn").addEventListener("click", () => {
  const diceType = parseInt(document.getElementById("diceType").value);
  const diceCount = parseInt(document.getElementById("diceCount").value);

  const results = [];
  for (let i = 0; i < diceCount; i++) {
    results.push(Math.floor(Math.random() * diceType) + 1);
  };

  const rollData = {
    diceType,
    diceCount: diceCount + "D",
    results,
    total: results.reduce((a, b) => a + b, 0),
    timestamp: Date.now()
  };

  set(ref(db, "public/diceRolls/lastRoll"), rollData);

  // ログ → 蓄積
  const date = new Date(rollData.timestamp);
  const playerName = playerNames[currentPlayerId] || player;
  const logMessage = `${playerName}のダイスロール。${rollData.diceCount}${rollData.diceType}→[${rollData.results.join(", ")}]  結果は…「${rollData.total}」です。(${date.toLocaleString()})`;
  push(ref(db, "public/logs"), {
    type: "dice",
    player: currentPlayerId,
    message: logMessage,
    timestamp: rollData.timestamp
  });
});

// ---- 直前の1回を表示 ----
onValue(ref(db, "public/diceRolls/lastRoll"), (snapshot) => {
  const roll = snapshot.val();
  if (roll) {
    document.getElementById("diceResult").textContent = `${roll.diceCount}${roll.diceType} → [ ${roll.results.join(", ")} ]\n合計：${roll.total}`;
  }
});

// ログを表示 
const logsRef = query(ref(db, "public/logs"), limitToLast(30));
onValue(logsRef, (snapshot) => {
  const data = snapshot.val() || {};
  if (!data) return;
  const logDiv = document.getElementById("logArea");
  logDiv.innerHTML = "";

  Object.values(data).sort((a, b) => a.timestamp - b.timestamp).forEach(log => {
    const p = document.createElement("p");
    p.textContent = `${log.message}`;
    logDiv.appendChild(p);
    logDiv.scrollTop = logDiv.scrollHeight;
  });
});

// キャラクターステータス
const charactersRef = ref(db, "public/players");
async function loadCharacterButtons() {
  const snapshot = await get(charactersRef);
  const characters = snapshot.val();

  const containor = document.getElementById("character-list");
  containor.innerHTML = "";

  for (let id in characters) {
    const btn = document.createElement("button");
    btn.textContent = characters[id].profile.name;
    btn.addEventListener("click", () => showCharacter(id));
    containor.appendChild(btn);
  }
}

// パラメータ表示
async function showCharacter(id) {
  const charRef = ref(db, `public/players/${id}`);
  onValue(charRef, async (snapshot) => {
    const char = snapshot.val();
    if (!char) return;
    const charImage = document.getElementById("char-image");
    charImage.src = char.image ? `/image/${char.image}` : "/image/noimage.jpeg";

    // プロフィール
    for (let key in char.profile) {
      document.getElementById(`char-${key}`).textContent = char.profile[key];
    }

    // 所持品
    const itemRef = ref(db, `item/${id}`);
    onValue(itemRef, (snapshot) => {
      const items = snapshot.val() || {};
      const itemsContainer = document.getElementById("items");
      itemsContainer.innerHTML = "";

      for (let key in items) {
        if (items[key] === true) {
          const li = document.createElement("li");
          li.textContent = key;
          itemsContainer.appendChild(li);
        }
      }
    });

    for (let key in items) {
      if (items[key] === true) {
        const li = document.createElement("li");
        li.textContent = key;
        itemsContainer.appendChild(li);
      };
    }

    // 能力値
    for (let key in char.stats) {
      document.getElementById(`char-${key}`).textContent = char.stats[key];
    }

    // 派生値
    for (let key in char.derived) {
      document.getElementById(`char-${key}`).textContent = char.derived[key];
    }

    // 技能
    for (let key in char.skills) {
      document.getElementById(`skill-${key}`).textContent = char.skills[key];
    }
  })

  // HP,MP,SANの増減
  document.querySelectorAll("#char-derived button").forEach(btn => {
    btn.onclick = async () => {
      const field = btn.dataset.key;
      const fieldRef = ref(db, `public/players/${id}/derived/${field}`)

      await runTransaction(fieldRef, (current) => {
        if (current === null) return 0;
        return btn.classList.contains("inc") ? current + 1 : Math.max(0, current - 1);
      });
    };
  });
}

showCharacter("player3");
loadCharacterButtons();

// 所持品の追加と削除
onValue(charactersRef, async (snap) => {
  const chars = snap.val() || {};
  const itemsConsole = document.getElementById("items-console");
  itemsConsole.innerHTML = "";

  for (const charId in chars) {
    const title = document.createElement("h3");
    title.textContent = `キャラクター ${charId} の操作`;
    itemsConsole.appendChild(title);

    const div = document.createElement("div");
    itemsConsole.appendChild(div);
    itemsConsole.appendChild(document.createElement("hr"));

    const itemRef = ref(db, `item/${charId}`);
    onValue(itemRef, (itemSnap) => {
      const items = itemSnap.val() || {};
      div.innerHTML = "";

      for (const itemName in items) {
        const has = !!items[itemName];

        // 「取得／放棄」ボタンを1つにまとめる
        const btn = document.createElement("button");
        btn.textContent = has ? `喪失：${itemName}` : `取得：${itemName}`;
        btn.style.color = has ? "red" : "#a8c0a8";

        // 取得可能なときだけ取得操作、放棄可能なときだけ放棄操作
        // btn.style.opacity = has ? "1" : "1";
        btn.addEventListener("click", () => {
          const newState = !has;
          set(ref(db, `item/${charId}/${itemName}`), newState);

          const ts = Date.now();
          const action = newState ? "取得" : "喪失";
          const playerName = playerNames[charId] || player;

          const logMsg = `${playerName}が「${itemName}」を${action}しました。(${new Date(ts).toLocaleString()})`;
          push(ref(db, "public/logs"), {
            type: "item",
            character: charId,
            item: itemName,
            action: action,
            timestamp: ts,
            message: logMsg
          });
        });

        div.appendChild(btn);
      }

      // itemsConsole.appendChild(div);
      // itemsConsole.appendChild(document.createElement("hr"));    
    });
  }
});

// タイトル演出用
window.addEventListener("load", () => {
  const headTitle = document.getElementById("headtitle");
  headTitle.classList.add("loaded");
  const gameSection = document.getElementById("player-info");

  function goToGame() {
    gameSection.scrollIntoView({ behavior: "smooth" });
  }

  let startY = null;
  headTitle.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches[0]) startY = e.touches[0].clientY;
  }, { passive: true });

  headTitle.addEventListener("touchmove", (e) => {
    if (!startY || !e.touches || !e.touches[0]) return;
    const endY = e.touches[0].clientY;
    if (startY - endY > 50) { // 50px以上下にスワイプしたら遷移
      goToGame();
    }
  }, { passive: true });

  // スクロール（下方向）を検知
  headTitle.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) goToGame();
  });
  headTitle.addEventListener("click", () => goToGame());
});