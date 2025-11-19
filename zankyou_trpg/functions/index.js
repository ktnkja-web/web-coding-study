/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// functions/index.js (JavaScriptの場合)

// Firebase Functions SDKとFirebase Admin SDKをインポートします。
// JavaScriptなので、require() を使います。
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Firebase Admin SDKを初期化します。
// これにより、Cloud FunctionsからRealtime DatabaseやAuthenticationなど、
// Firebaseの他のサービスに安全にアクセスできるようになります。
// TypeScriptのadmin.initializeApp()と同じ機能です。
admin.initializeApp();

// --- HTTPトリガーの関数例 ---
// ウェブからアクセスできるシンプルな関数です。
// https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/helloWorld のようなURLで呼び出せます。
// TypeScriptのonRequestと同じ機能です。
exports.helloWorld = functions.https.onRequest((request, response) => {
  // functions.logger.infoは、Cloud Functionsのログに出力するためのものです。
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// --- Callable Function (クライアントから呼び出す関数) の例 ---
// あなたのWebアプリから直接呼び出すことができる関数です。
// 認証情報なども自動的に渡されるため、より安全で便利です。
// TypeScriptのonCallと同じ機能です。
exports.addNumbers = functions.https.onCall((data, context) => {
  // data: クライアントから渡されたデータ
  // context: 呼び出し元の認証情報などを含むコンテキスト情報

  // ログインしているユーザーか確認
  if (!context.auth) {
    // ログインしていない場合はエラーを返す
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const num1 = data.firstNumber;
  const num2 = data.secondNumber;

  // 数値であることを確認
  if (typeof num1 !== "number" || typeof num2 !== "number") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with two numbers."
    );
  }

  const sum = num1 + num2;

  functions.logger.info(`Adding ${num1} and ${num2}, result is ${sum}`);

  return { result: sum };
});

// --- Realtime Database トリガーの関数例 ---
// Realtime Databaseにデータが追加されると自動的に実行される関数です。
// データベースのパスを監視します。
// TypeScriptのonCreateと同じ機能です。
exports.makeUppercase = functions.database.ref("/messages/{pushId}/original")
    .onCreate(async (snapshot, context) => {
      // {pushId} はワイルドカードで、新しいメッセージのキーに対応します
      // original: スナップショットには追加されたデータの値が含まれます

      const original = snapshot.val();
      functions.logger.info("Uppercasing", original);
      const uppercase = original.toUpperCase();

      // 同じパスの親のパスに大文字に変換した値を書き戻す
      // TypeScriptのsnapshot.ref.parent?.child("uppercase").set(uppercase)と同じですが、
      // JavaScriptでは ?. オペレーターは必要に応じて使います。
      await snapshot.ref.parent.child("uppercase").set(uppercase);
      return null; // 関数が正常に終了したことを示す
    });
