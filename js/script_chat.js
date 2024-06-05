/* ----- LocalStorageに名前がない場合 -----*/
if(localStorage.hasOwnProperty("name")){
    console.log("nameデータあり");
}else{
    location.href = "index.html";
}

/* ----- Firebase部分 -----*/
//切り出したAPIKeyをimport
import firebaseConfig from "./firebaseApiKey.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getDatabase, ref, push, set, onChildAdded, update, remove, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Your web app's Firebase configuration
// ->firebaseApiKeyに移動済

// Initialize Firebase
const app = initializeApp(firebaseConfig); //初期化
const db = getDatabase(app); //RealtimeDBに接続
const dbRef = ref(db, "chat"); //RealtimeDBのchatフォルダに入れる

/* ----- Chat部分 -----*/

//localstorage戻し
const lsData = JSON.parse(localStorage.getItem("name"));
console.log(lsData,"parse確認");

//送信ボタン押下時
$("#chat-send").on("click", function () {

    //ユーザデータ取得
    const name = lsData.username;
    const icon = lsData.icon;
    console.log(name,"名前チェック")
    console.log(icon,"iconチェック")

    //入力データ
    let text = $("#chat-text").val();

    //日付
    let date = new Date;
    let dateText = date.toLocaleString();

    //オブジェクト設定
    const msg = {
        name: name,
        text: text,
        date: dateText,
        icon: icon,
    }

    console.log(msg,"オブジェクトチェック");

    //dbに書き込み
    const newPostRef = push(dbRef); //RealtimeDBにpush=送る準備
    set(newPostRef, msg); //RealtimeDBにmsgをセット

    //入力欄を空欄に
    $("#chat-text").val("");
});

//表示エリアのリアルタイム更新（onChildAdded = データ追加時と読み込み時に動作）
onChildAdded(dbRef, function(data) {
    const msg = data.val(); //通信成功したデータを取る

    //Localstorage格納のユーザデータ取得（比較用）
    const lsname = lsData.username;
    console.log(lsname,"lsnameチェック")

    //RealtimeDB格納のユーザデータ取得（比較用）
    const dbname = msg.name;
    console.log(dbname, "dbnameチェック")

    let html = "";
    //比較
    if(lsname === dbname){
        //データ設定（自分）
        html = `
        <div class="my-msg-wrap">
            <div class="msg-wrap">
                <p class="name">${msg.name}</p>
                <div class="my-msg">
                    <p class="text">${msg.text}</p>
                    <p class="time">${msg.date}</p>
                </div>
            </div>
            <img class="icon" src="img/${msg.icon}.png" alt="">
        </div>
        `
    }else{
        //データ設定（他人）
        html = `
        <div class="others-msg-wrap">
            <img class="icon" src="img/${msg.icon}.png" alt="">
            <div class="msg-wrap">
                <p class="name">${msg.name}</p>
                <div class="others-msg">
                    <p class="text">${msg.text}</p>
                    <p class="time">${msg.date}</p>
                </div>
            </div>
        </div>
        `
    }

    //データ設定（append）
    $("#chat-display").append(html);

    //スクロールを一番下になる
    console.log($('#chat-display')[0].scrollHeight, "高さ")
    $('#chat-display').scrollTop($('#chat-display')[0].scrollHeight);
})