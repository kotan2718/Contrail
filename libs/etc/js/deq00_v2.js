
let selectedOption;
let selectedValue;      // 選択項目

document.addEventListener('DOMContentLoaded', (event) => {

    // ローカルストレージから選択状態を取得
    selectedValue = localStorage.getItem('kzDeq_SelectedType');
    console.log("selectedValue2=", selectedValue, typeof selectedValue);

    const checkboxState = localStorage.getItem('kzDeq_StorageFlg') === 'true';
    document.getElementById('cb_storage').checked = checkboxState;
    kzDeq_StorageFlg = checkboxState;

    if (selectedValue && selectedValue !== "null") {
        const select = document.getElementById('selected');

        const selectedText = document.getElementById('selected-text');
        const options = document.getElementById('options');

        const target = options.querySelector(`li[data-value="${selectedValue}"]`);
        if (target) {
            selectedText.textContent = target.textContent;

            // selectedも同期
            options.querySelectorAll("li").forEach(li => {
                li.classList.remove("selected");
            });
            target.classList.add("selected");
        }
        applySelected(selectedValue)

        changeType(selectedValue);
    }

    console.log("selectedValue3=", selectedValue, typeof selectedValue);

    if (checkboxState) {
        document.getElementById('cb_storage').checked = true;
    }
});


function initialize() {
    // 描画範囲の初期化
    let width0 = parseFloat(document.getElementById('width0').value);
    let wmax = width0 / 2;
    let wmin = -wmax;
    document.getElementById('wmax').innerText = wmax;
    document.getElementById('wmin').innerText = wmin;

    // 現在表示されているurlを取得して、日本語ページか英語ページかの振り分けを行う
    const urlHere = window.location.href;

    // value復元
    //select.value = selectedValue;

    // URLから選択すべきオプションを取得
    const urlParams = new URLSearchParams(window.location.search);
    const selectedOptionRaw = urlParams.get('selectedOption');
    selectedOption = decodeURIComponent(selectedOptionRaw); // URLデコード

    // 対応するテキストを取得して表示
    if (selectedOption != "null") {
        changeType(selectedOption);

        const selected = document.getElementById('selected');
        selectedValue = selectedOption;
        console.log("selectedValue4=", selectedValue, typeof selectedValue);

        const selectedText = document.getElementById('selected-text');
        const options = document.getElementById('options');

        const target = options.querySelector(`li[data-value="${selectedOption}"]`);
        if (target) {
            selectedText.textContent = target.textContent;

            // selectedも同期
            options.querySelectorAll("li").forEach(li => {
                li.classList.remove("selected");
            });
            target.classList.add("selected");
        }
    }

    const selectMode = document.getElementById('mode');
    selectMode.selectedIndex = 2;

    // 解説ページから呼ばれたときは、以下を実行する
    // 選択すべきオプションが指定されている場合、そのオプションを選択し、changeType()関数を呼び出します
    if (selectedOption != "null") {
        // goBack関数を呼び出す
        goBack();
        
        const selectElement = document.getElementById('selected');
        selectElement.value = selectedOption; // 選択肢を選択
        changeType(selectedOption); // 選択肢が変更された場合の処理を実行
        if (selectedOption.substr(0, 5) != "09&09") {
            setTimeout(function() {
                startAnimation(); // 描画の実行
            }, 2000);
//            document.getElementById('selected').disabled = true;
        }
        else {
            document.getElementById('dxdt').focus();
        }

        applySelected(selectedOption)
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
        link.href = "etc_DEQ_doc2_en.html?selectedOption=" + encodeURIComponent(selectedOption);
        // テキストコンテンツを設定
        link.textContent = "return to Document";
    }
    else {
        // href属性を設定
        link.href = "etc_DEQ_doc2.html?selectedOption=" + encodeURIComponent(selectedOption);
        // テキストコンテンツを設定
        link.textContent = "ドキュメントに戻る";
    }

    // <p>要素を取得し、リンクを追加
    var paragraphElement = document.querySelector('.cLink');
    paragraphElement.appendChild(link);
}

// 選択された方程式をcustom-selectボックスに表示する
function applySelected(selectedOption) {
    const target = options.querySelector(`li[data-value="${selectedOption}"]`);
    if (!target) return;

    const selectedText = document.getElementById('selected-text');
    selectedText.textContent = target.textContent;

    options.querySelectorAll("li").forEach(li => {
        li.classList.remove("selected");
    });
    target.classList.add("selected");
}
