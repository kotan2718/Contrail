charset="UTF8"

/* type writer - only IE */
str = "Welcome to Kz's Page - The Scenery - ScreenShots SnapShots Top";
blnk = " ";
str += blnk;
mcnt = 0;
msg = "";
stcnt = 0;
timeID = "";

iCount = 0;

function type()
{
	stcnt++
	if( stcnt > 2 )
	{
		stcnt = 0;
		msg +=str.substring( mcnt, mcnt + 1 );
		mcnt++;
		if( mcnt >= str.length ) { mcnt = 0; msg = ""; ++iCount;}
	}
	csr = " ";
	if( stcnt & 1 ) csr = "_";
	status = msg + csr;
	clearTimeout( timeID );
	if( iCount < 1 ) { timeID = setTimeout( "type()", 50 );}
	if( iCount == 1 ) { status = str;}
}

/* 文字をフェードイン・フェードアウトさせる */
itv = 150; /* 色を変化させる間隔(ミリ秒単位) */
cnt1 = 0;
str1 = "fedcba987";
c1 ="f";
c2 ="f";

function strFade() {
    document.all["fade"].style.color = "#"+c1+c2+c1+c2+c1+c2;
    
  if(cnt1 < str1.length) {c1 = str1.charAt(cnt1++); }
  if(cnt1 < str1.length) {setTimeout("strFade()",itv);}
  if(cnt1 == str1.length) cnt1 = 0;
}
setTimeout("strFade()", 3000);
