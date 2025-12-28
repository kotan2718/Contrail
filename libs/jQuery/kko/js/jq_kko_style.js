charset="UTF8"

/* 画面初期表示・リロード時の処理 */
window.addEventListener("DOMContentLoaded", function () {

    /* フェードイン機能なし */
    //document.documentElement.style.visibility = "visible";

    /* フェードイン機能あり */
    document.documentElement.style.opacity = "1";

});


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
    const topCall = document.querySelector('#top-call a');
    const popupMenu2 = document.getElementById('popup-menu2');

    menuCall.addEventListener('click', function (e) {
        e.preventDefault(); // リンクの動作を止める
        popupMenu.classList.toggle('hidden'); // 表示・非表示を切り替え
    });
    if (topCall) {
        topCall.addEventListener('click', function (e) {
            e.preventDefault(); // リンクの動作を止める
            popupMenu2.classList.toggle('hidden'); // 表示・非表示を切り替え
        });
    }

    // メニューの外をクリックしたら閉じる（任意）
    document.addEventListener('click', function (e) {
        if (!popupMenu.contains(e.target) && !menuCall.contains(e.target)) {
            popupMenu.classList.add('hidden');
        }
        if (!popupMenu2.contains(e.target) && !topCall.contains(e.target)) {
            popupMenu2.classList.add('hidden');
        }
    });
});

// ホバー時のポップアップ(簡単な説明とリンク先を表示)
// cssファイル: E:\Data\GitHub\Contrail\libs\etc\css\kko_etc_style.css

document.addEventListener("DOMContentLoaded", function () {
    let currentElement = null;

    function showPopup(element) {
        let popup = document.getElementById("popup");
        let rect = element.getBoundingClientRect();

        currentElement = element;

        // ポップアップの内容を更新 (改行を <br> に変換)
        document.getElementById("popup-text").innerHTML = element.getAttribute("comment-popup").replace(/\n/g, "<br>");

        // <a>タグなら「詳細を見る」を表示、<span>タグなら非表示
        if (element.tagName.toLowerCase() === "a") {
            document.getElementById("popup-link").style.display = "block";
            document.getElementById("popup-link").setAttribute("href", element.getAttribute("href"));
        } else {
            document.getElementById("popup-link").style.display = "none";
        }

        // ポップアップをリンクまたはスパンの下に表示
        popup.style.top = window.scrollY + rect.bottom + 5 + "px";
        popup.style.left = window.scrollX + rect.left + "px";
        popup.style.display = "block";
    }

    function hidePopup() {
        document.getElementById("popup").style.display = "none";
        if (currentElement) {
            currentElement.classList.remove("active");
        }
    }

    document.querySelectorAll(".hover-link, .hover-comment").forEach(element => {
        element.addEventListener("mouseenter", function () {
            showPopup(element);
        });

        element.addEventListener("mouseleave", function () {
            setTimeout(() => {
                if (!document.getElementById("popup").matches(":hover")) {
                    hidePopup();
                }
            }, 200);
        });
    });

    document.getElementById("popup").addEventListener("mouseleave", hidePopup);
});

document.addEventListener("DOMContentLoaded", function () {
    // 画面幅を判定してクラスを切り替える
    function adjustLayout() {
        const CommonElement = document.getElementById("common-k");
        const CommonElement_Roman = document.getElementById("common-k_Roman");
        const CommonElement2 = document.getElementById("common-k2");
        const CommonElement2_Roman = document.getElementById("common-k2_Roman");
        const main920Element = document.getElementById("main920");
        const main9248Element = document.getElementById("main920-480");
        const main9248enElement = document.getElementById("main920-480new_en");
        const main960Element = document.getElementById("main960");
        const main960newElement = document.getElementById("main960-480new");
        const main9648enElement = document.getElementById("main960-480new_en");
        const main1024Element = document.getElementById("main1024");
        const main1024Element48 = document.getElementById("main1024-480");
        const main880Element = document.getElementById("main880");
        const main8848enElement = document.getElementById("main880-480new_en");
        const main800Element = document.getElementById("main800");
        const main8048Element = document.getElementById("main800-480");
        const main8048enElement = document.getElementById("main800-480new_en");
        const main7248Element = document.getElementById("main720-480");
        const main7248enElement = document.getElementById("main720-480_en");
        const menuCall = document.getElementById("menu-call");
        const pageTop = document.getElementById("page-top");
        const topCall = document.getElementById("top-call");

        const headerElement = document.querySelector(".header_labelPC");
        const footerElement = document.querySelector(".footer_labelPC");

        const width920Elements = document.querySelectorAll(".c_main920");
        const width960Elements = document.querySelectorAll('.c_main960');

        const picLeft1024Elements = document.querySelectorAll('.pic-left1024');
        const picCenter1024Elements = document.querySelectorAll('.pic-center1024');
        const picRight1024Elements = document.querySelectorAll('.pic-right1024');
        const picLeft960Elements = document.querySelectorAll('.pic-left960');
        const picCenter960Elements = document.querySelectorAll('.pic-center960');
        const picRight960Elements = document.querySelectorAll('.pic-right960');
        const picLeft920Elements = document.querySelectorAll('.pic-left920');
        const picLeft9248Elements = document.querySelectorAll('.pic-left920_480');
        const picCenter920Elements = document.querySelectorAll('.pic-center920');
        const picCenter920newElements = document.querySelectorAll('.pic-center920new');
        const picRight920Elements = document.querySelectorAll('.pic-right920');
        const picLeft880Elements = document.querySelectorAll('.pic-left880');
        const picCenter880Elements = document.querySelectorAll('.pic-center880');
        const picRight880Elements = document.querySelectorAll('.pic-right880');
        const picCenter880newElements = document.querySelectorAll('.pic-center880new');
        const picRight880newElements = document.querySelectorAll('.pic-right880new');
        const picLeft800Elements = document.querySelectorAll('.pic-left800');
        const picCenter800Elements = document.querySelectorAll('.pic-center800');
        const picRight800Elements = document.querySelectorAll('.pic-right800');
        const picCenter800newElements = document.querySelectorAll('.pic-center800new');
        const picRight800newElements = document.querySelectorAll('.pic-right800new');
        const picLeft720Elements = document.querySelectorAll('.pic-left720');
        const picCenter720Elements = document.querySelectorAll('.pic-center720');
        const picRight720Elements = document.querySelectorAll('.pic-right720');
        const picCenter720newElements = document.querySelectorAll('.pic-center720new');
        const picRight720newElements = document.querySelectorAll('.pic-right720new');
        const picLeft640Elements = document.querySelectorAll('.pic-left640');
        const picCenter640Elements = document.querySelectorAll('.pic-center640');
        const picRight640Elements = document.querySelectorAll('.pic-right640');
        const picCenter640newElements = document.querySelectorAll('.pic-center640new');
        const picRight640newElements = document.querySelectorAll('.pic-right640new');
        const picLeft480Elements = document.querySelectorAll('.pic-left480');
        const picRight480Elements = document.querySelectorAll('.pic-right480');

        const cntnts2colLeft920Elements = document.querySelectorAll('.contents-2col-left920');
        const cntnts2colRight920Elements = document.querySelectorAll('.contents-2col-right920');

        const cntnts2colRight960Elements = document.querySelectorAll('.contents-2col-right960');
        const cntnts2colRight800Elements = document.querySelectorAll('.contents-2col-right800');
        const cntnts2colRight720Elements = document.querySelectorAll('.contents-2col-right720');
        const cntnts2colLeft518Elements = document.querySelectorAll('.contents-2col-left_518');
        const cntnts2colRightTBS_Elements = document.querySelectorAll('.contents-2col-right_TBS');

        const cntnts3colLeft960Elements = document.querySelectorAll('.contents-3col-left960');
        const cntnts3colMiddle960Elements = document.querySelectorAll('.contents-3col-middle960');
        const cntnts3colRight960Elements = document.querySelectorAll('.contents-3col-right960');

        const cntnts_col_top_Left960Elements = document.querySelectorAll('.contents-col_top_l960');
        const cntnts_col_top_Middle960Elements = document.querySelectorAll('.contents-col_top_c960');
        const cntnts_col_top_Right960Elements = document.querySelectorAll('.contents-col_top_r960');

        const flexRight960Elements = document.querySelectorAll('.flx_itemR960');

        const DeqPicSizeElements = document.querySelectorAll('.deq_pic_size > img');
        const imageElements = document.querySelectorAll(".image-container > img");
        const imagePopupElements = document.querySelectorAll(".popup-image");
        const tableElements = document.querySelectorAll(".table-container > table");
        const popupElement = document.querySelector(".popup > width");
        const bigCircleElements = document.querySelectorAll('.big-circle920');

        if (CommonElement || CommonElement_Roman ||CommonElement2 || CommonElement2_Roman) {

            function isMobile() {
              return window.innerWidth / window.devicePixelRatio < 481;
            }

            if (isMobile()) { // スマホの場合
                if (CommonElement) {
                    CommonElement.id = "common-k_400";                  // CommonElement
                }
                if (CommonElement_Roman) {
                    CommonElement_Roman.id = "common-k_400_Roman";      // CommonElement
                }
                if (CommonElement2) {
                    CommonElement2.id = "common-k_400";                  // CommonElement
                }
                if (CommonElement2_Roman) {
                    CommonElement2_Roman.id = "common-k_400_Roman";      // CommonElement
                }
                if (main920Element) {                               // mainElement
                    main920Element.id = "main400";
                }
                if (main9248Element) {                              // mainElement
                    main9248Element.id = "main480new";
                }
                if (main9248enElement) {                              // mainElement
                    main9248enElement.id = "main480new_en";
                }
                if (main960Element) {                               // mainElement
                    main960Element.id = "main400";
                }
                if (main960newElement) {                               // mainElement
                    main960newElement.id = "main480new";
                }
                if (main9648enElement) {                              // mainElement
                    main9648enElement.id = "main480new_en";
                }
                if (main1024Element) {                              // mainElement
                    main1024Element.id = "main400";
                }
                if (main1024Element48) {                            // mainElement
                    main1024Element48.id = "main480new";
                }
                if (main880Element) {
                    main880Element.id = "main480new";
                }
                if (main8848enElement) {                              // mainElement
                    main8848enElement.id = "main480new_en";
                }
                if (main800Element) {
                    main800Element.id = "main480new";
                }
                if (main8048Element) {                              // mainElement
                    main8048Element.id = "main480new";
                }
                if (main8048enElement) {                              // mainElement
                    main8048enElement.id = "main480new_en";
                }
                if (main7248Element) {                              // mainElement
                    main7248Element.id = "main480new";
                }
                if (main7248enElement) {                              // mainElement
                    main7248enElement.id = "main480new_en";
                }
                if (headerElement) {                              // headerElement
                    headerElement.id = "header_label400";
                }
                if (footerElement) {                              // footerElement
                    footerElement.id = "footer_label400";
                }

                if (menuCall) {
                    menuCall.style.right = 20 + "px";
                    menuCall.style.top = 20 + "px";
                }
                if (pageTop) {
                    pageTop.style.right = 20 + "px";
                }
                if (topCall) {
                    topCall.style.right = 20 + "px";
                }

                if (width920Elements) {                                // widthElements
                    width920Elements.forEach(el => {
                        el.className = "c_main400";
                    });
                }
                if (width960Elements) {                                // widthElements
                    width960Elements.forEach(el => {
                        el.className = "c_main400";
                    });
                }

                if (picLeft1024Elements) {
                    picLeft1024Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picCenter1024Elements) {
                    picCenter1024Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picRight1024Elements) {
                    picRight1024Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picLeft960Elements) {                              // picLeftElements
                    picLeft960Elements.forEach(el => {
                        el.className = "pic-left400";
                    });
                }
                if (picCenter960Elements) {                              // picLeftElements
                    picCenter960Elements.forEach(el => {
                        el.className = "pic-left400";
                    });
                }
                if (picRight960Elements) {                              // picLeftElements
                    picRight960Elements.forEach(el => {
                        el.className = "pic-left400";
                    });
                }
                if (picLeft920Elements) {                              // picLeftElements
                    picLeft920Elements.forEach(el => {
                        el.className = "pic-left400";
                    });
                }
                if (picLeft9248Elements) {
                    picLeft9248Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picCenter920Elements) {                              // picLeftElements
                    picCenter920Elements.forEach(el => {
                        el.className = "pic-left400";
                    });
                }
                if (picCenter920newElements) {                           // picLeftElements
                    picCenter920newElements.forEach(el => {
                        el.className = "pic-center480new";
                    });
                }
                if (picRight920Elements) {                              // picLeftElements
                    picRight920Elements.forEach(el => {
                        el.className = "pic-left400";
                    });
                }
                if (picLeft880Elements) {
                    picLeft880Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picCenter880Elements) {
                    picCenter880Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picRight880Elements) {
                    picRight880Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picCenter880newElements) {
                    picCenter880newElements.forEach(el => {
                        el.className = "pic-center480new";
                    });
                }
                if (picRight880newElements) {
                    picRight880newElements.forEach(el => {
                        el.className = "pic-right480new";
                    });
                }
                if (picLeft800Elements) {
                    picLeft800Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picCenter800Elements) {
                    picCenter800Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picRight800Elements) {
                    picRight800Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picCenter800newElements) {
                    picCenter800newElements.forEach(el => {
                        el.className = "pic-center480new";
                    });
                }
                if (picRight800newElements) {
                    picRight800newElements.forEach(el => {
                        el.className = "pic-right480new";
                    });
                }
                if (picLeft720Elements) {
                    picLeft720Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picCenter720Elements) {
                    picCenter720Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picRight720Elements) {
                    picRight720Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picCenter720newElements) {
                    picCenter720newElements.forEach(el => {
                        el.className = "pic-center480new";
                    });
                }
                if (picRight720newElements) {
                    picRight720newElements.forEach(el => {
                        el.className = "pic-right480new";
                    });
                }
                if (picLeft640Elements) {
                    picLeft640Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picCenter640Elements) {
                    picCenter640Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picCenter640newElements) {
                    picCenter640newElements.forEach(el => {
                        el.className = "pic-center480new";
                    });
                }
                if (picRight640Elements) {
                    picRight640Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picRight640newElements) {
                    picRight640newElements.forEach(el => {
                        el.className = "pic-right480new";
                    });
                }
                if (picLeft480Elements) {
                    picLeft480Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }
                if (picRight480Elements) {
                    picRight480Elements.forEach(el => {
                        el.className = "pic-left480new";
                    });
                }

                if (cntnts2colLeft920Elements) {                       // cntnts2colLeft920Elements
                    cntnts2colLeft920Elements.forEach(el => {
                        el.className = "contents-2col-left400";
                    });
                }
                if (cntnts2colRight920Elements) {
                    cntnts2colRight920Elements.forEach(el => {         // cntnts2colRight920Elements
                        el.className = "contents-2col-right400";
                    });
                }
                if (cntnts2colRight960Elements) {
                    cntnts2colRight960Elements.forEach(el => {
                        el.className = "contents-2col-right480";
                    });
                }
                if (cntnts2colRight800Elements) {
                    cntnts2colRight800Elements.forEach(el => {
                        el.className = "contents-2col-right480";
                    });
                }
                if (cntnts2colRight720Elements) {
                    cntnts2colRight720Elements.forEach(el => {
                        el.className = "contents-2col-right480";
                    });
                }
                if (cntnts2colLeft518Elements) {
                    cntnts2colLeft518Elements.forEach(el => {
                        el.className = "contents-2col-left480";
                    });
                }
                if (cntnts2colRightTBS_Elements) {
                    cntnts2colRightTBS_Elements.forEach(el => {
                        el.className = "contents-2col-right480";
                    });
                }

                if (cntnts3colLeft960Elements) {
                    cntnts3colLeft960Elements.forEach(el => {
                        el.className = "contents-3col-left480";
                    });
                }
                if (cntnts3colMiddle960Elements) {
                    cntnts3colMiddle960Elements.forEach(el => {
                        el.className = "contents-3col-middle480";
                    });
                }
                if (cntnts3colRight960Elements) {
                    cntnts3colRight960Elements.forEach(el => {
                        el.className = "contents-3col-right480";
                    });
                }

                if (cntnts_col_top_Left960Elements) {
                    cntnts_col_top_Left960Elements.forEach(el => {
                        el.className = "contents-col_top_l480";
                    });
                }
                if (cntnts_col_top_Middle960Elements) {
                    cntnts_col_top_Middle960Elements.forEach(el => {
                        el.className = "contents-col_top_c480";
                    });
                }
                if (cntnts_col_top_Right960Elements) {
                    cntnts_col_top_Right960Elements.forEach(el => {
                        el.className = "contents-col_top_r480";
                    });
                }

                if (flexRight960Elements) {
                    flexRight960Elements.forEach(el => {
                        el.className = "flx_itemR480";
                    });
                }
                if (DeqPicSizeElements) {
                    DeqPicSizeElements.forEach(image => {
                        image.style.width = "40%";
                        image.style.height = "40%";
                    });
                }

                if (imageElements) {                                // imageElements
                    imageElements.forEach(image => {
                        image.style.width = "100%";
                    });
                }
                if (tableElements) {
                    tableElements.forEach(table => {
                        table.style.width = "100%";
                    });
                }
                if (imagePopupElements) {                           // imagePopupElements
                    imagePopupElements.forEach(el => {
                        el.className = "popup-image400";
                    });
                }
                if (popupElement) {                                 // popupElement
                    popupElement.forEach(style => {
                        width = "300px";
                    });
                }
                if (bigCircleElements) {                            // bigCircleElements
                    bigCircleElements.forEach(el => {
                        el.className = "big-circle400";
                    });
                }
                //console.log('スマホの画面です。IDは変更されません。');
            } else {  // PCの場合
                if (menuCall) {
                    menuCall.style.right = 20 + "px";
                    //menuCall.style.top = 32 + "px";   // 下のベースラインに配置
                    menuCall.style.top = 20 + "px";   // 帯の中央の高さに配置
                    //menuCall.style.top = 20 + "px";   // 上下幅を狭めたときのtop位置
                }
                if (pageTop) {
                    pageTop.style.right = 20 + "px";
                }
                if (topCall) {
                    topCall.style.right = 20 + "px";
                }

                if (DeqPicSizeElements) {
                    DeqPicSizeElements.forEach(image => {
                        image.style.width = "20%";
                        image.style.height = "20%";
                    });
                }
                /* nothing */
                //console.log('PCの画面です。IDを main920 に変更しました。');
            }
        } else {
            console.error('main 要素が見つかりません。');
        }
    }
    adjustLayout(); // 初回実行
});

// マウスのホバーで、元のサイズの画像をポップアップする

$(document).ready(function () {
    $(".image-container").hover(
        function () {
            const popupImage = $(this).find(".popup-image");
            popupImage.css({ width: "auto", height: "auto" });  // 元のサイズを保つ
            popupImage.fadeIn(200);
        },
        function () {
            $(this).find(".popup-image").fadeOut(200);
        }
    );
});

