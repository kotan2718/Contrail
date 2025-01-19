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

/* 
   上記の操作にhoverで画像の枠線を変化させようと思ったが，
   デフォルトで画像に枠線をつけておく必要がある。
   
		$(function(){
			$('.jQ_blink a img').hover(
				function(){
					$(this).fadeTo(0, 0.6).fadeTo('normal', 1.0).css("border", "2px solid #f0f0f0");
				},
				function(){
					$(this).fadeTo('fast', 1.0).css("border", "2px solid #c8c8c8");
				}
			);
		});

単純に，上記を実行すると，最初に画像にマウスが乗ったとき，画像が少し動く。
外枠なしの画像に外枠が追加されたためで，一度，マウスがはずれた後は，
意図通りの効果を得ることができる。
問題は，最初なので，最初で失敗すると，みっともない。
デフォルトで画像に枠線をつけて置けば良いが...
ならば，ブリンクと外枠の処理は切り離した方が，良いのではないかと思う。
*/

/* image CHANGE at cursor on - off */
/* "IE" "Safari" "FireFox" "Chrome"  OK */
$(function(){
	$('.jQ_change a img').hover(function(){
		$(this).attr('src', $(this).attr('src').replace('_off', '_on'));
			}, function(){
			   if (!$(this).hasClass('current')) {
			   $(this).attr('src', $(this).attr('src').replace('_on', '_off'));
		}
	});
});
