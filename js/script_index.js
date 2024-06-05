//LocalStorage
if(localStorage.hasOwnProperty("name")){
    location.href = "chat.html";
    console.log("nameデータあり");
}

//clickedIcon初期化
let clickedIcon = "";

//アイコンクリックした時の動作
$(".sel-icon").on("click", function () {

    //画像のidを取得
    clickedIcon = $(this).attr('id');
    console.log(clickedIcon, "アイコンクリック時iconのId取得確認");

    //選択したもの以外は半透明にする
    $('.sel-icon').css('opacity', '0.5');
    $(this).css('opacity', '1.0');
});


//ログインきっかけ
$("#login").on("click", function () {    

    console.log(clickedIcon, "ログイン時iconのId取得確認");

    //入力した名前を取得
    let username = $("#username").val();

    if(username === ""){
        alert("名前を入力してください");
    }else if(clickedIcon === ""){
        alert("アイコンを選択してください");
    }else{

        //オブジェクト作成
        const userInfo = {
            'username' : username,
            'icon' : clickedIcon
        }

        //localstorageにセット
        localStorage.setItem("name", JSON.stringify(userInfo));

        // 画面遷移
        location.href = "chat.html";
    }

});