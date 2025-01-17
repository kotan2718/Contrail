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

