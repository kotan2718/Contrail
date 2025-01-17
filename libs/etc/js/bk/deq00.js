function initialize() {
    // 描画範囲の初期化
    let width0 = parseFloat(document.getElementById('width0').value);
    let wmax = width0 / 2;
    let wmin = -wmax;
    document.getElementById('wmax').innerText = wmax;
    document.getElementById('wmin').innerText = wmin;

    // 固有値
    // ラベルを一度非表示にする
    document.getElementById('lambda').style.visibility ="hidden";
    document.getElementById('KAI1').style.visibility ="hidden";
    document.getElementById('pm').style.visibility ="hidden";
    document.getElementById('KAI2').style.visibility ="hidden";
}

