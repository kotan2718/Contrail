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
   ��L�̑����hover�ŉ摜�̘g����ω������悤�Ǝv�������C
   �f�t�H���g�ŉ摜�ɘg�������Ă����K�v������B
   
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

�P���ɁC��L�����s����ƁC�ŏ��ɉ摜�Ƀ}�E�X��������Ƃ��C�摜�����������B
�O�g�Ȃ��̉摜�ɊO�g���ǉ����ꂽ���߂ŁC��x�C�}�E�X���͂��ꂽ��́C
�Ӑ}�ʂ�̌��ʂ𓾂邱�Ƃ��ł���B
���́C�ŏ��Ȃ̂ŁC�ŏ��Ŏ��s����ƁC�݂��Ƃ��Ȃ��B
�f�t�H���g�ŉ摜�ɘg�������Ēu���Ηǂ���...
�Ȃ�΁C�u�����N�ƊO�g�̏����͐؂藣���������C�ǂ��̂ł͂Ȃ����Ǝv���B
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
