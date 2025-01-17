
let scrollPosition;

function initialize() {
    // 描画範囲の初期化
    let width0 = parseFloat(document.getElementById('width0').value);
    let wmax = width0 / 2;
    let wmin = -wmax;
    document.getElementById('wmax').innerText = wmax;
    document.getElementById('wmin').innerText = wmin;

    // 係数
    let ma = parseFloat(document.getElementById('ma').value);
    let mb = parseFloat(document.getElementById('mb').value);
    let mc = parseFloat(document.getElementById('mc').value);
    let md = parseFloat(document.getElementById('md').value);
    let me = parseFloat(document.getElementById('me').value);
    let mf = parseFloat(document.getElementById('mf').value);
    let mg = parseFloat(document.getElementById('mg').value);
    let mh = parseFloat(document.getElementById('mh').value);

    document.getElementById('ma').value = 1;
    document.getElementById('mb').value = 0;
    document.getElementById('mc').value = 0;
    document.getElementById('md').value = 2;
    document.getElementById('me').disabled = true;
    document.getElementById('mf').disabled = true;
    document.getElementById('mg').disabled = true;
    document.getElementById('mh').disabled = true;

    // 現在表示されているurlを取得して、日本語ページか英語ページかの振り分けを行う
    const urlHere = window.location.href;

    if (urlHere.indexOf('en') != -1) {
        // ラベル「固有値」を表示する
        document.getElementById('koyu').innerText = "Eigenvalues";
    }
    else {
        // ラベル「固有値」を表示する
        document.getElementById('koyu').innerText = "固有値";
    }

    // 式を表示する
    document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = ax + by \\]";
    document.getElementById('dy').innerText = "\\[ \\frac{dx}{dt} = cx + dy \\]";

    // 固有値
    // ラベルを一度非表示にする
    document.getElementById('lambda').style.visibility ="hidden";
    document.getElementById('KAI1').style.visibility ="hidden";
    document.getElementById('pm').style.visibility ="hidden";
    document.getElementById('KAI2').style.visibility ="hidden";

    const selectType = document.getElementById('type');
    selectType.selectedIndex = 4;

    const selectMode = document.getElementById('mode');
    selectMode.selectedIndex = 2;

    // URLから選択すべきオプションを取得
    const urlParams = new URLSearchParams(window.location.search);
    const selectedOptionRaw = urlParams.get('selectedOption');
    const selectedOption = decodeURIComponent(selectedOptionRaw); // URLデコード
    // scrollPositionパラメーターが存在するか確認し、その値を取得
    scrollPosition = urlParams.get('scrollPosition');

    // 解説ページから呼ばれたときは、以下を実行する
    // 選択すべきオプションが指定されている場合、そのオプションを選択し、changeType()関数を呼び出します
    if (selectedOption != "null") {
        // goBack関数を呼び出す
        goBack();
        
        const selectElement = document.getElementById('type');
        selectElement.value = selectedOption; // 選択肢を選択
        changeType(); // 選択肢が変更された場合の処理を実行
    }

}

// 解説のページに戻る関数
function goBack() {
    // window.history.back(); // ブラウザの「戻る」ボタンと同じ動作 <- 戻る位置(行)が10行程度ずれることがある
    // <a>要素を作成
    var link = document.createElement('a');

    // 現在表示されているurlを取得して、日本語ページか英語ページかの振り分けを行う
    const urlHere = window.location.href;

    if (urlHere.indexOf('en') != -1) {
        // href属性を設定
        link.href = "etc_DEQ_doc2_en.html?scrollPosition=" + encodeURIComponent(scrollPosition);
        // テキストコンテンツを設定
        link.textContent = "return to Explanation page";
    }
    else {
        // href属性を設定
        link.href = "etc_DEQ_doc2.html?scrollPosition=" + encodeURIComponent(scrollPosition);
        // テキストコンテンツを設定
        link.textContent = "解説ページに戻る";
    }

    // <p>要素を取得し、リンクを追加
    var paragraphElement = document.querySelector('.cLink');
    paragraphElement.appendChild(link);
}


