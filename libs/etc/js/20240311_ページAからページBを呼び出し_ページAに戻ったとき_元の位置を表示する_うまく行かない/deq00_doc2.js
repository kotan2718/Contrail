
function initialize() {
    // URLから選択すべきオプションを取得
    //const urlParams = new URLSearchParams(window.location.search);
    //const selectedOptionRaw = urlParams.get('selectedOption');
    //const selectedOption = decodeURIComponent(selectedOptionRaw); // URLデコード
    // スクロール位置が指定されている場合は、その位置にスクロール
    const params = new URLSearchParams(window.location.search);
    // scrollPositionパラメーターが存在するか確認し、その値を取得
    const scrollPosition = params.get('scrollPosition');

    if (scrollPosition !== null) {
        window.scrollTo(0, parseInt(scrollPosition));
    }

    // 解説ページから呼ばれたときは、以下を実行する
    //if (selectedOption != "null") {
    //    window.location.hash = selectedOption;
    //}
}

// ページAのリンククリック時に実行
function navigateToPageB(type) {
    // 現在のスクロール位置を取得
    const scrollPosition = window.pageYOffset;
    // 選択されたオプション
    const selectedOption = type;
    // ページBへのリンクにスクロール位置と選択オプションを含めて遷移
    window.location.href = "etc_DEQ_v2.html?scrollPosition=" + scrollPosition + "&selectedOption=" + encodeURIComponent(selectedOption);
}

