charset="UTF8"

/* BLINK at cursor on */
/* "IE" "Safari" "FireFox" "Chrome"  OK */
$(function(){
    $('.jQ_blink a img').hover(
        function(){
            $(this).fadeTo(0, 0.6).fadeTo('normal', 1.0);
        },
        function(){
            $(this).fadeTo('fast', 1.0);
        }
    );
});

// ポップアップメニューの制御
document.addEventListener('DOMContentLoaded', function () {
    const menuCall = document.querySelector('#menu-call a');
    const popupMenu = document.getElementById('popup-menu');

    menuCall.addEventListener('click', function (e) {
        e.preventDefault(); // リンクの動作を止める
        popupMenu.classList.toggle('hidden'); // 表示・非表示を切り替え
    });

    // メニューの外をクリックしたら閉じる（任意）
    document.addEventListener('click', function (e) {
        if (!popupMenu.contains(e.target) && !menuCall.contains(e.target)) {
            popupMenu.classList.add('hidden');
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // 画面幅を判定してクラスを切り替える
    function adjustLayout() {

        const CommonElement = document.getElementById("common-k");
        const mainElement = document.getElementById("main960");
        const mainElement800 = document.getElementById("main800");
        const menuCall = document.getElementById("menu-call");
        const pageTop = document.getElementById("page-top");

        const headerElement = document.querySelector('.header_labelPC');
        const footerElement = document.querySelector('.footer_labelPC');

        const widthElements = document.querySelectorAll('.c_main960');
        const widthElements800 = document.querySelectorAll('.c_main800');
        const picLeftElements = document.querySelectorAll('.pic-left960');
        const picLeftElements800 = document.querySelectorAll('.pic-left800');

        const cntnts2colRightElements = document.querySelectorAll('.contents-2col-right960');
        const cntnts2colRightElements800 = document.querySelectorAll('.contents-2col-right800');

        const cntnts3colLeftElements = document.querySelectorAll('.contents-3col-left960');
        const cntnts3colMiddleElements = document.querySelectorAll('.contents-3col-middle960');
        const cntnts3colRightElements = document.querySelectorAll('.contents-3col-right960');

        const cntnts_col_top_LeftElements = document.querySelectorAll('.contents-col_top_l960');
        const cntnts_col_top_MiddleElements = document.querySelectorAll('.contents-col_top_c960');
        const cntnts_col_top_RightElements = document.querySelectorAll('.contents-col_top_r960');

        const flexRightElements = document.querySelectorAll('.flx_itemR960');
        const DeqPicSizeElements = document.querySelectorAll('.deq_pic_size > img');
        const imageElements = document.querySelectorAll(".image-container > img");

        if (CommonElement) {

            function isMobile() {
              return window.innerWidth / window.devicePixelRatio < 481;
            }

            if (isMobile()) { // スマホの場合
                CommonElement.id = "common-k_480";
                if (mainElement) {
                    mainElement.id = "main480new";
                }
                if (mainElement800) {
                    mainElement800.id = "main480new";
                }
                headerElement.className = "header_label480";
                footerElement.className = "footer_label480";

                if (menuCall) {
                    menuCall.style.right = 20 + "px";
                    menuCall.style.top = 20 + "px";
                }
                if (pageTop) {
                    pageTop.style.right = 20 + "px";
                }

                if (widthElements) {
                    widthElements.forEach(el => {
                        el.className = "c_main480";
                    });
                }
                if (widthElements800) {
                    widthElements800.forEach(el => {
                        el.className = "c_main480";
                    });
                }
                if (picLeftElements) {
                    picLeftElements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picLeftElements800) {
                    picLeftElements800.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }

                if (cntnts2colRightElements) {
                    cntnts2colRightElements.forEach(el => {
                        el.className = "contents-2col-right480";
                    });
                }
                if (cntnts2colRightElements800) {
                    cntnts2colRightElements800.forEach(el => {
                        el.className = "contents-2col-right480";
                    });
                }

                if (cntnts3colLeftElements) {
                    cntnts3colLeftElements.forEach(el => {
                        el.className = "contents-3col-left480";
                    });
                }
                if (cntnts3colMiddleElements) {
                    cntnts3colMiddleElements.forEach(el => {
                        el.className = "contents-3col-middle480";
                    });
                }
                if (cntnts3colRightElements) {
                    cntnts3colRightElements.forEach(el => {
                        el.className = "contents-3col-right480";
                    });
                }

                if (cntnts_col_top_LeftElements) {
                    cntnts_col_top_LeftElements.forEach(el => {
                        el.className = "contents-col_top_l480";
                    });
                }
                if (cntnts_col_top_MiddleElements) {
                    cntnts_col_top_MiddleElements.forEach(el => {
                        el.className = "contents-col_top_c480";
                    });
                }
                if (cntnts_col_top_RightElements) {
                    cntnts_col_top_RightElements.forEach(el => {
                        el.className = "contents-col_top_r480";
                    });
                }

                if (flexRightElements) {
                    flexRightElements.forEach(el => {
                        el.className = "flx_itemR480";
                    });
                }
                if (DeqPicSizeElements) {
                    DeqPicSizeElements.forEach(image => {
                        image.style.width = "40%";
                        image.style.height = "40%";
                    });
                }
                if (imageElements) {
                    imageElements.forEach(image => {
                        image.style.width = "100%";
                    });
                }
                //console.log('スマホの画面です。IDは変更されません。');
            } else {  // PCの場合
                if (menuCall) {
                    menuCall.style.right = 20 + "px";
                    menuCall.style.top = 32 + "px";
                }
                if (pageTop) {
                    pageTop.style.right = 20 + "px";
                }

                if (DeqPicSizeElements) {
                    DeqPicSizeElements.forEach(image => {
                        image.style.width = "20%";
                        image.style.height = "20%";
                    });
                }
                /* nothing */
                //console.log('PCの画面です。IDを main960 に変更しました。');
            }
        } else {
            console.error('main 要素が見つかりません。');
        }
    }
    adjustLayout(); // 初回実行

    // ウィンドウリサイズ時に再実行
    window.addEventListener("resize", adjustLayout);
});


