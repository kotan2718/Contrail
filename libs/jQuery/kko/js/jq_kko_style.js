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

// �z�o�[���̃|�b�v�A�b�v(�ȒP�Ȑ����ƃ����N���\��)
// css�t�@�C��: E:\Data\GitHub\Contrail\libs\etc\css\kko_etc_style.css
document.addEventListener("DOMContentLoaded", function () {
    let currentElement = null;

    function showPopup(element) {
        let popup = document.getElementById("popup");
        let rect = element.getBoundingClientRect();

        currentElement = element;

        // �|�b�v�A�b�v�̓��e���X�V (���s�� <br> �ɕϊ�)
        document.getElementById("popup-text").innerHTML = element.getAttribute("comment-popup").replace(/\n/g, "<br>");

        // <a>�^�O�Ȃ�u�ڍׂ�����v��\���A<span>�^�O�Ȃ��\��
        if (element.tagName.toLowerCase() === "a") {
            document.getElementById("popup-link").style.display = "block";
            document.getElementById("popup-link").setAttribute("href", element.getAttribute("href"));
        } else {
            document.getElementById("popup-link").style.display = "none";
        }

        // �|�b�v�A�b�v�������N�܂��̓X�p���̉��ɕ\��
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

    // ��ʕ��𔻒肵�ăN���X��؂�ւ���
    function adjustLayout() {
        const mainElement = document.getElementById("main920");
        const widthElement = document.querySelector(".c_main920");
    const picLeftElement = document.querySelector('.pic-left920');
        const footerElement = document.querySelector(".footer_label920");
        const imageElements = document.querySelectorAll(".image-container > img");  // �ʏ�\���p�̉摜������I��

        if (mainElement) {
            if (window.innerWidth > 768) { // �X�}�z�\��
                mainElement.id = "main920";
                widthElement.className = "c_main920";
                picLeftElement.className = "pic-left920";
                footerElement.className = "footer_label920";
                if (imageElements) {
                    imageElements.forEach(image => {
                        image.style.width = "700px";
                    });
                }
                console.log('PC�̉�ʂł��BID�� main920 �ɕύX���܂����B');
            } else {  // �X�}�z�̏ꍇ
                mainElement.id = "main480";
                widthElement.className = "c_main480";
                picLeftElement.className = "pic-left480";
                footerElement.className = "footer_label480";
                if (imageElements) {
                    imageElements.forEach(image => {
                        image.style.width = "480px";
                    });
                }
                console.log('�X�}�z�̉�ʂł��BID�͕ύX����܂���B');
            }
        } else {
            console.error('main �v�f��������܂���B');
        }
    }
    adjustLayout(); // ������s
});


// �}�E�X�̃z�o�[�ŁA���̃T�C�Y�̉摜���|�b�v�A�b�v����
$(document).ready(function () {
    $(".image-container").hover(
        function () {
            const popupImage = $(this).find(".popup-image");
            popupImage.css({ width: "auto", height: "auto" });  // ���̃T�C�Y��ۂ�
            popupImage.fadeIn(200);
        },
        function () {
            $(this).find(".popup-image").fadeOut(200);
        }
    );
});

