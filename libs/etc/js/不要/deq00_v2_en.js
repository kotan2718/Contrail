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
    // ラベル「固有値」を表示する
    document.getElementById('koyu').innerText = "Eigenvalues";
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

    // 解説ページから呼ばれたとき以外は、「戻る」は非表示にする
    document.getElementById('back').style.visibility = 'hidden';
    // 選択すべきオプションが指定されている場合、そのオプションを選択し、changeType()関数を呼び出します
    if (selectedOption != "null") {
        // 解説ページから呼ばれたので、「戻る」を表示する
        document.getElementById('back').style.visibility = 'visible';
        
        const selectElement = document.getElementById('type');
        selectElement.value = selectedOption; // 選択肢を選択
        changeType(); // 選択肢が変更された場合の処理を実行
    }

}
