charset="UTF8"

/* Loader */
$('head').append(
	'<style type="text/css">#preload { display: none; } #fade, #loader { display: block; }</style>'
);

jQuery.event.add(window,"load",function() { // 全ての読み込み完了後に呼ばれる関数
	var pageH = $("#preload").height();

	$("#fade").css("height", pageH).delay(0).fadeOut(0);
	$("#loader").delay(0).fadeOut(0);
	$("#preload").css("display", "block");
});

