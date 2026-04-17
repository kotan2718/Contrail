
let selectedOption;
let selectedValue;      // 選択項目
let isInitializing = true;
let toDefaultFlg = false;


// ローカルストレージチェックボックスON/OFF管理
let CheckFlg = {};
let currentIndex = "";


document.addEventListener('DOMContentLoaded', (event) => {

    // チェック状態取得
    CheckFlg = loadCheckFlags();

    // 最後に選択された式を取得（←ここが変更点）
    selectedValue = localStorage.getItem('kkoDeq3D_LastSelected');
    console.log("selectedValue2=", selectedValue, typeof selectedValue);

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

        // UI反映
        applySelected(selectedValue);

        // 方程式のセット
        //changeType(selectedValue);
        if (selectedValue && isValidFormulaNo(selectedValue)) {
            changeType(selectedValue);
        }
    }
    else {
        // 初期画面表示時対応
        usability(false);
        // STOP ボタン
        document.querySelectorAll(".stopBtn").forEach(btn => {
            btn.disabled = true;
        });
        // スライダー
        $(function() {
            $("#horizontal-slider").slider({
                disabled: true // 最初は無効に設定
            });
        });
        $(function() {
            $("#vertical-slider").slider({
                disabled: true // 最初は無効に設定
            });
        });
    }

    console.log("selectedValue3=", selectedValue, typeof selectedValue);

    isInitializing = false;

    const inputs = document.querySelectorAll(
        '#ma, #mb, #mc, #md, #me, #mf, #mg, #mh, ' +
        '#width0, #spd, #dh, #cnt_dp, #angleAlpha, #angleGamma, #axX, #axY, #axZ, ' +
        '#width0, #spd, #dh, #cnt_dp, ' +
        '#init1_x, #init2_x, #init1_y, #init2_y, #init1_z, #init2_z'
    );

    inputs.forEach(el => {
        el.addEventListener("input", () => {

            if (!selectedValue || !CheckFlg[selectedValue]) return;
            console.log("auto save:", selectedValue);
            saveParams(selectedValue);

        });
    });
});



function initialize() {
    // 描画範囲の初期化
    width0 = parseFloat(document.getElementById('width0').value);
    wmax = width0 / 2;
    wmin = -wmax;
    document.getElementById('wmax').innerText = wmax;
    document.getElementById('wmin').innerText = wmin;

    // 現在表示されているurlを取得して、日本語ページか英語ページかの振り分けを行う
    const urlHere = window.location.href;

    // URLから選択すべきオプションを取得
    const urlParams = new URLSearchParams(window.location.search);
    const selectedOptionRaw = urlParams.get('selectedOption');
    selectedOption = urlParams.get('selectedOption');

    // 対応するテキストを取得して表示
    if (selectedOption != null) {
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

    // 解説ページから呼ばれたときは、以下を実行する
    // 選択すべきオプションが指定されている場合、そのオプションを選択し、changeType()関数を呼び出します
    if (selectedOption) {
        // goBack関数を呼び出す
        goBack();
        
        changeType(selectedOption); // 選択肢が変更された場合の処理を実行
        selectedValue = selectedOption;
        setTimeout(function() {
            startAnimation(); // 描画の実行
        }, 2000);
        document.querySelectorAll(".startBtn").forEach(btn => {
            btn.disabled = true;
        });
        document.querySelectorAll(".stoptBtn").forEach(btn => {
            btn.disabled = false;
        });

        applySelected(selectedOption);
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
        link.href = "etc_DEQ_doc3_en.html?selectedOption=" + encodeURIComponent(selectedOption);
        // テキストコンテンツを設定
        link.textContent = "return to Document";
    }
    else {
        // href属性を設定
        link.href = "etc_DEQ_doc3.html?selectedOption=" + encodeURIComponent(selectedOption);
        // テキストコンテンツを設定
        link.textContent = "ドキュメントに戻る";
    }

    // <p>要素を取得し、リンクを追加
    var paragraphElements = document.querySelectorAll('.cLink');

    paragraphElements.forEach(function(el) {
        var linkCopy = link.cloneNode(true); // 同じリンクを複製
        el.appendChild(linkCopy);
    });

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




// ストレージデータ取得
function getStorageData() {
    const data = localStorage.getItem('kkoDeq3D_Data');
    return data ? JSON.parse(data) : {};
}

// ストレージデータ保存
function saveStorageData(data) {
    localStorage.setItem('kkoDeq3D_Data', JSON.stringify(data));
}

// パラメータ保存
function saveParams(formulaNo) {

    // 正しい式Noであるかをチェック("01", "123" :OK, "A1", null, [Object HTMLDivElement] :NG)
    if (!isValidFormulaNo(formulaNo)) {
        console.warn("saveParams invalid:", formulaNo);
        return;
    }

    if (typeof formulaNo !== "string") {
        console.warn("saveParams invalid key:", formulaNo);
        return;
    }

    if (isInitializing) return;
    if (!formulaNo || formulaNo === "null") return;

    const data = getStorageData();

    if (!data[formulaNo]) data[formulaNo] = {};

    data[formulaNo].params = {
        a: document.getElementById('ma').value,
        b: document.getElementById('mb').value,
        c: document.getElementById('mc').value,
        d: document.getElementById('md').value,
        e: document.getElementById('me').value,
        f: document.getElementById('mf').value,
        g: document.getElementById('mg').value,
        h: document.getElementById('mh').value,
        width0: document.getElementById('width0').value,
        spd: document.getElementById('spd').value,
        dh: document.getElementById('dh').value,
        cnt_dp: document.getElementById('cnt_dp').value,
        alpha: document.getElementById('angleAlpha').value,
        gamma: document.getElementById('angleGamma').value,
        axX: document.getElementById('axX').checked,
        axY: document.getElementById('axY').checked,
        axZ: document.getElementById('axZ').checked,
        init1_x: document.getElementById('init1_x').value,
        init2_x: document.getElementById('init2_x').value,
        init1_y: document.getElementById('init1_y').value,
        init2_y: document.getElementById('init2_y').value,
        init1_z: document.getElementById('init1_z').value,
        init2_z: document.getElementById('init2_z').value
    };

    saveStorageData(data);
}

// パラメータ復元
function loadParams(formulaNo) {

    // 正しい式Noであるかをチェック("01", "123" :OK, "A1", null, [Object HTMLDivElement] :NG)
    if (!isValidFormulaNo(formulaNo)) {
        console.warn("loadParams invalid:", formulaNo);
        return;
    }


    const data = getStorageData();

    if (!data[formulaNo] || !data[formulaNo].params) return;

    const p = data[formulaNo].params;

    document.getElementById('ma').value = p.a ?? "";
    document.getElementById('mb').value = p.b ?? "";
    document.getElementById('mc').value = p.c ?? "";
    document.getElementById('md').value = p.d ?? "";
    document.getElementById('me').value = p.e ?? "";
    document.getElementById('mf').value = p.f ?? "";
    document.getElementById('mg').value = p.g ?? "";
    document.getElementById('mh').value = p.h ?? "";

    document.getElementById('width0').value = p.width0 ?? 100;
    document.getElementById('spd').value = p.spd ?? 1;
    document.getElementById('dh').value = p.dh ?? 0.1;
    document.getElementById('cnt_dp').value = p.cnt_dp ?? 3200;
    document.getElementById('angleAlpha').value = p.alpha ?? -20;
    document.getElementById('angleGamma').value = p.gamma ?? -30;
    document.getElementById('axX').checked = p.axX ?? "false";
    document.getElementById('axY').checked = p.axY ?? "false";
    document.getElementById('axZ').checked = p.axZ ?? "true";

    document.getElementById('init1_x').value = p.init1_x ?? 0;
    document.getElementById('init2_x').value = p.init2_x ?? 0;

    document.getElementById('init1_y').value = p.init1_y ?? 1;
    document.getElementById('init2_y').value = p.init2_y ?? 1;

    document.getElementById('init1_z').value = p.init1_z ?? 2;
    document.getElementById('init2_z').value = p.init2_z ?? 2.01;
}

// チェック状態保存
function saveChecked(formulaNo, checked) {

    // 正しい式Noであるかをチェック("01", "123" :OK, "A1", null, [Object HTMLDivElement] :NG)
    if (!isValidFormulaNo(formulaNo)) {
        console.warn("saveChecked invalid:", formulaNo);
        return;
    }
    // 型のチェック
    if (typeof formulaNo !== "string") {
        console.warn("saveChecked invalid key:", formulaNo);
        return;
    }

    const data = getStorageData();

    if (!data[formulaNo]) data[formulaNo] = {};

    data[formulaNo].checked = checked;

    saveStorageData(data);
}

// selectedは必ず文字列にする処理
function normalizeSelected(selected) {

    if (typeof selected === "string") return selected;

    if (selected instanceof HTMLElement) {
        return selected.dataset.value || null;
    }

    return null;
}

// 正しい式Noであるかをチェック("01", "123" :OK, "A1", null, [Object HTMLDivElement] :NG)
function isValidFormulaNo(v) {
    return typeof v === "string" && /^\d+$/.test(v);
}

function saveCheckFlags() {
    try {
        localStorage.setItem("kkoDeq3D_CheckFlg", JSON.stringify(CheckFlg));
    } catch (e) {
        console.error("save error:", e);
    }
}

function loadCheckFlags() {
    try {
        const json = localStorage.getItem("kkoDeq3D_CheckFlg");

        if (!json) return {};

        const data = JSON.parse(json);

        // 念のためチェック
        if (typeof data !== "object" || Array.isArray(data)) {
            return {};
        }

        return data;

    } catch (e) {
        console.error("load error:", e);
        return {};
    }
}

// チェックボックスの状態を反映
function updateCheckbox() {
    const cb = document.getElementById("cb_storage3D");
    currentIndex = selectedValue;
    cb.checked = !!CheckFlg[currentIndex];
}

// チェック変更時
function handleCheckboxStorage(checked) {
    currentIndex = selectedValue;
    CheckFlg[currentIndex] = checked;
    saveCheckFlags();
}

