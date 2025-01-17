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

    document.getElementById('ma').value = 10.0;
    document.getElementById('mb').value = 28.0;
    document.getElementById('mc').value = 8.0 / 3.0;
    document.getElementById('md').disabled = true;
    document.getElementById('me').disabled = true;
    document.getElementById('mf').disabled = true;
    document.getElementById('mg').disabled = true;
    document.getElementById('mh').disabled = true;

    // 式を表示する
    document.getElementById('dx').innerText = "$ \\dot{x} = ay - ax $";
    document.getElementById('dy').innerText = "$ \\dot{y} = bx - xz - y $";
    document.getElementById('dz').innerText = "$ \\dot{z} = xy - cz $";

    // 初期値を表示する
    document.getElementById('init1_x').value = 0;
    document.getElementById('init1_y').value = 1;
    document.getElementById('init1_z').value = 2;
    document.getElementById('init2_x').value = 0;
    document.getElementById('init2_y').value = 1;
    document.getElementById('init2_z').value = 2.01;

    // 描画アングルに初期値を設定する
    document.getElementById('angleAlpha').value = -20;
    document.getElementById('angleGamma').value = -30;

    // 選択ボックスの初期値を設定する
    const selectType = document.getElementById('type');
    selectType.selectedIndex = 0;

    // Stopボタンを使用不可に設定
    document.getElementById('stop').disabled = true;

    // 描画速度
    document.getElementById('spd').value = 2;

    // URLから選択すべきオプションを取得
    const urlParams = new URLSearchParams(window.location.search);
    const selectedOption = urlParams.get('selectedOption');

    // 選択すべきオプションが指定されている場合、そのオプションを選択し、changeType()関数を呼び出します
    if (selectedOption) {
        const selectElement = document.getElementById('type');
        selectElement.value = selectedOption; // 選択肢を選択
        changeType(); // 選択肢が変更された場合の処理を実行
    }
}
