function initialize() {

    // 数式の選択状態を取得
//    let selectedType = localStorage.getItem('selectedType');
//    if (selectedType) {
//        document.getElementById('type').value = selectedType;
//    }

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

    const type = parseInt(document.getElementById('type').value);
    switch (type) {
        case 1:
            dat = 1;
            document.getElementById('ma').value = 1;
            document.getElementById('mb').value = -2;
            document.getElementById('mc').value = 2;
            document.getElementById('md').value = 1;
            document.getElementById('me').disabled = true;
            document.getElementById('mf').disabled = true;
            document.getElementById('mg').disabled = true;
            document.getElementById('mh').disabled = true;
            // 式を表示する
            document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = ax + by \\]";
            document.getElementById('dy').innerText = "\\[ \\frac{dx}{dt} = cx + dy \\]";
//            document.getElementById('dx').innerText = "dx/dt = ax + by";
//            document.getElementById('dy').innerText = "dy/dt = cx + dy";
            break;
        case 2:
            dat = 2;
            document.getElementById('ma').value = -1;
            document.getElementById('mb').value = 0;
            document.getElementById('mc').value = 1;
            document.getElementById('md').value = 0;
            document.getElementById('me').value = -2;
            document.getElementById('mf').value = 0;
            document.getElementById('me').disabled = false;
            document.getElementById('mf').disabled = false;
            document.getElementById('mg').disabled = true;
            document.getElementById('mh').disabled = true;
            // 式を表示する
            document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = ax^2 + bxy + cx^2 \\]";
            document.getElementById('dy').innerText = "\\[ \\frac{dx}{dt} = dx^2 + exy + fy^2 \\]";
//            document.getElementById('dx').innerText = "dx/dt = ax^2 + bxy + cy^2";
//            document.getElementById('dy').innerText = "dy/dt = dx^2 + exy + fy^2";
            break;
        defaut:
            break;
    }

    // 固有値
    // ラベルを一度非表示にする
    document.getElementById('lambda').style.visibility ="hidden";
    document.getElementById('KAI1').style.visibility ="hidden";
    document.getElementById('pm').style.visibility ="hidden";
    document.getElementById('KAI2').style.visibility ="hidden";

    // 他の処理が終わった後にMathJaxを再度実行する
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

}

// 数式が選択されたときに呼ばれる関数
function handleTypeChange() {
    let selectedType = document.getElementById('type').value;
    // 選択された数式をローカルストレージに保存
    localStorage.setItem('selectedType', selectedType);
    // MathJaxを再実行してTeXを再描画
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
