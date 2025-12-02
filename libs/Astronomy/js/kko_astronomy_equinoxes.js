// -------------------------------------------------------
// 任意の時差（時間）を加えてフォーマットする関数
// offsetHours : 時差（例：日本なら 9）
// -------------------------------------------------------
document.getElementById("jisa").addEventListener("input", (e) => {
    const min = -12;
    const max = 14;
    let v = Number(e.target.value);

    if (v < min) e.target.value = min;
    if (v > max) e.target.value = max;
});

document.getElementById("year").addEventListener("input", (e) => {
    const min = 1800;
    const max = 2100;
    let v = e.target.value;

    // 4桁になって初めてチェック
    if (v.length < 4) return;

    v = Number(v);
    if (v < min) e.target.value = min;
    if (v > max) e.target.value = max;
});

function formatWithOffset(date, offsetHours) {

    // 元の絶対時刻 (UTC) のミリ秒
    const utcMillis = date.getTime();

    // 任意のオフセットを足したミリ秒
    const shiftedMillis = utcMillis + offsetHours * 3600 * 1000;

    // 新しい Date オブジェクト（ローカルタイムではなく絶対時刻）
    const d = new Date(shiftedMillis);

    // 秒未満をカットするために丸め直す
    const yyyy = d.getUTCFullYear();
    const mm   = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd   = String(d.getUTCDate()).padStart(2, '0');
    const hh   = String(d.getUTCHours()).padStart(2, '0');
    const mi   = String(d.getUTCMinutes()).padStart(2, '0');
    const ss   = String(d.getUTCSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function calc() {
    const jisa = Number(document.getElementById("jisa").value);
    const year = Number(document.getElementById("year").value);
    const seasons = Astronomy.Seasons(year);

    var sign;
    if (jisa > 0) {
        sign = "+";
    }
    else if (jisa < 0) {
        sign = "";
    }
    else {
        sign = " ";
    }

    // result
    document.getElementById("spring").value = formatWithOffset(seasons.mar_equinox.date, jisa);
    document.getElementById("summer").value = formatWithOffset(seasons.jun_solstice.date, jisa);
    document.getElementById("autumn").value = formatWithOffset(seasons.sep_equinox.date, jisa);
    document.getElementById("winter").value = formatWithOffset(seasons.dec_solstice.date, jisa);

}
