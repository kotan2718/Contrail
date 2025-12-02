
function php_mktime() {
    //PHPのmktimeを再現。
    //1970年1月1日午前0時からの通算秒数を返す。
    //引数は時,分,秒,月,日,年。省略のときは現在日時。
    var now, vals, mydate, i;
    now = new Date();
    vals = [];
    vals[0] = now.getHours();
    vals[1] = now.getMinutes();
    vals[2] = now.getSeconds();
    vals[3] = now.getMonth() + 1;
    vals[4] = now.getDate();
    vals[5] = now.getFullYear();
    for (i = 0; i < 6; i++) {
        if (typeof arguments[i] != 'undefined') {
            vals[i] = arguments[i];
        }
    }
    mydate = new Date(vals[5], vals[3] - 1, vals[4], vals[0], vals[1], vals[2]);
    return mydate.getTime() / 1000;
}

function php_date() {
    //PHPのdateを再現。
    //ただしY,y,m,n,F,M,d,j,w,l,D,G,H,g,h,i,s,a,Aに対応。
    //引数は形式,タイムスタンプ。タイムスタンプは省略できる。省略のときは現在日時。
    var format, timestamp, months, weekdays, mydate, temp;
    format = arguments[0];
    timestamp = arguments[1];
    if (typeof timestamp == "undefined") {
        timestamp = php_mktime();
    }
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    mydate = new Date(timestamp * 1000);
    //二重変換防止のためformatの文字を@で挟む。
    format = format.replace(/([YymnFMdjwlDGHghisaA])/g, "@$1@")
    //年
    format = format.replace(/@Y@/g, mydate.getFullYear());
    format = format.replace(/@y@/g, mydate.getFullYear() % 100);
    //月
    format = format.replace(/@m@/g, ("0" + (mydate.getMonth() + 1)).slice(-2));
    format = format.replace(/@n@/g, mydate.getMonth() + 1);
    format = format.replace(/@F@/g, months[mydate.getMonth()]);
    format = format.replace(/@M@/g, months[mydate.getMonth()].substr(0, 3));
    //日
    format = format.replace(/@d@/g, ("0" + mydate.getDate()).slice(-2));
    format = format.replace(/@j@/g, mydate.getDate());
    //曜日
    format = format.replace(/@w@/g, mydate.getDay()); //0:日曜
    format = format.replace(/@l@/g, weekdays[mydate.getDay()]);
    format = format.replace(/@D@/g, weekdays[mydate.getDay()].substr(0, 3));
    //時(24時)
    format = format.replace(/@G@/g, mydate.getHours());
    format = format.replace(/@H@/g, ("0" + mydate.getHours()).slice(-2));
    //時(12時)
    temp = mydate.getHours() % 12 == 0 ? 12 : mydate.getHours() % 12;
    format = format.replace(/@g@/g, temp);
    format = format.replace(/@h@/g, ("0" + temp).slice(-2));
    //分
    format = format.replace(/@i@/g, ("0" + mydate.getMinutes()).slice(-2));
    format = format.replace(/@s@/g, ("0" + mydate.getSeconds()).slice(-2));
    //AM,PM
    temp = mydate.getHours() < 12 ? "am" : "pm";
    format = format.replace(/@a@/g, temp);
    format = format.replace(/@A@/g, temp.toUpperCase());
    return format;
}
//###################################################################################
//###################################################################################
// Happy Mondayの日付のタイムスタンプを求める関数
// 引数
// strY     : 指定年
// strM     : 該当するハッピーマンデーが含まれる月
// iSequence: 第何月曜か
function happyMon(iY, iM, iSequence) {
    // 指定月の1日の曜日番号を求める
    var iTimeStamp = php_mktime(0, 0, 0, iM, '1', iY);
    var iDays = parseInt(php_date('w', iTimeStamp),10);
    // 第1週に月曜が含まれる（1日が日曜か月曜）場合は，iDaysに7を加えることで
    // 曜日番号と第2月曜の日付をリニアーに対応させることができる
    if(iDays <= 1) { iDays += 7; }
    /*
        変更前               変更後
        1日の曜日  第2月曜   1日の曜日  第2月曜
           0         9          2        14
           1         8          3        13
           2        14          4        12
           3        13          5        11
           4        12          6        10
           5        11          7 (0)     9
           6        10          8 (1)     8
    */
    var iHappyMonday = String(7 * iSequence - iDays + 2);
    var iTStamp = php_mktime( 0, 0, 0, iM, iHappyMonday, iY );

    return iTStamp;
}
//###################################################################################
function inputDataCheck( ym, data ) {
    var iMinMonth = 1, iMaxMonth = 12;
    var iMinYear = 1902, iMaxYear = 2050;
//        var inpData = {0: year, 1: month};
    // 数字以外が入力されたら当月の年月を表示させる(エラーメッセージは出さない)
    if( ym == "year" ) {
        if( isNaN(data) ) {
            data = parseInt(php_date("Y"), 10);
            document.getElementById('id_year').value = String(data);
        }
        else {
            if( data > iMaxYear ) {
                data = iMaxYear;
            }
            else if( data < iMinYear ) {
                data = iMinYear;
            }
        }
    }
    else if( ym == "month" ) {
        if( isNaN(data) ) {
            data = parseInt(php_date("Y"), 10);
            document.getElementById('id_month').value = String(data);
        }
        else {
            if( data > iMaxMonth ) {
                data = iMaxMonth;
            }
            else if( data < iMinMonth ) {
                data = iMinMonth;
            }
        }
    }
    return data;
}


(function(){
var day_en = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    // 指定年月 上下限
    var iMinYear = 1901;
    var iMaxYear = 2087;
    var iMinMonth = 1;
    var iMaxMonth = 12;
    // 指定月の処理
    //-------------
    // 一日(ついたち)を変数に格納
    var iFirst = 1;
    // 祝日の数( 国民の休日を含めると最大で17、)
    //var iHolidayNum = 17;
    var iHolidayNum = 100;
    // 当月処理に必要な日数: 当月はmax31日とすると，配列は最大で37個必要になる
    // 140801 実際にカレンダーを表示させるときのために42日分求めておく
    var iSumTargetDay = 42;
    // 一日(ついたち)と末日のタイムスタンプを格納
    var iFirstDayTimeStamp, iLastDayTimeStamp;
    // 一日(ついたち)と末日の曜日番号
    var iFirstDays, iLastDays;

// 配列変数の初期化

// 指定年の祝日タイムスタンプ格納配列
var iArrHolidayTimeStamp = [];
// 指定年の祝日名格納配列
var strArrHolidayID = [];

// 指定月のタイムスタンプ格納配列
var iArrTargetDay_TimeStamp = [];

// 指定月の祝日情報格納配列        0: 平日  1: 祝日  2: 振休
var iArrTargetMonthHoliday = [];
// 祝日情報の祝日名格納配列
var strArrTargetMonthHolidayID = [];

// 外から見えるメソッドを定義
function PCalen(parent){
    if (typeof parent === 'string') {
        parent = document.getElementById(parent);
    }
    this.parent = parent;
}
window.PCalen = PCalen;

PCalen.prototype = {
    create: create,
    update: update,
    remove: remove,
    set_caption: set_caption,
    set_thead: set_thead,
    set_body: set_body,
    set_date: set_date,
    onclick_date: onclick_date,
    onclick_month: onclick_month,
    onclick_year: onclick_year,
    onchange_month: onchange_month,
    onchange_year: onchange_year,
    set_year_month:set_year_month,
    happyHoliday: happyHoliday,
    targetMonth: targetMonth,
    subHoliday: subHoliday
};
// 上記のメソッドの中身
function onclick_date(id, year, month, date){
    return false; // これがないと、urlにリンク先( #month-2014-7など )が表示されてしまう
}
function onclick_month(id, year, month){
    this.update(+year, +month);
    return false; // これがないと、urlにリンク先( #month-2014-7など )が表示されてしまう
}
function onclick_year(id, year, month){
    this.update(+year, +month);
    return false; // これがないと、urlにリンク先( #month-2014-7など )が表示されてしまう
}
function onchange_month(year, month){
    this.update(+year, +month);
}
function onchange_year(year, month){
    this.update(+year, +month);
}
function set_year_month(year, month){
    this.update(+year, +month);
}

function remove(){
    this.parent.removeChild(this.table);
}
function update(year, month){
    this.remove();
    this.create(year, month);
}
function set_date(year, month){
    this.month =parseInt(month, 10)|| parseInt(php_date("m"), 10);
    this.year = parseInt(year, 10) || parseInt(php_date("Y"), 10);
}

//###################################################################################
// 指定年の祝日定義 Happy Holiday
//-------------------------------
function happyHoliday(strYear, strMonth) {
    var iYear = parseInt(strYear, 10);
    var iMonth = parseInt(strMonth, 10);

    // 曜日番号
    var iWeekDays;
    // 春分、秋分の日
    var iHaru;
    var iAki;

    // [0] ** 元旦 **
    iArrHolidayTimeStamp[0] = php_mktime( 0, 0, 0, 1, 1, iYear );
    strArrHolidayID[0] = '元旦';
    // for debug
    // strHoliday = php_date( 'Y/m/d', iArrHolidayTimeStamp[0] );
    // alert( strHoliday );

    // [1] ** 成人の日 **
    if( iYear >= 2000 ) {
        // happy manday 第2月曜
        iArrHolidayTimeStamp[1] = happyMon( iYear, 1, 2 );
    }
    else {
        iArrHolidayTimeStamp[1] = php_mktime( 0, 0, 0, 1, 15, iYear );
    }
    strArrHolidayID[1] = '成人の日';

    // [2] ** 建国記念日 ** 1949～1966 は廃止されていた
    if( iYear >= 1967 ) {
        iArrHolidayTimeStamp[2] = php_mktime( 0, 0, 0, 2, 11, iYear );
        strArrHolidayID[2] = '建国記念の日';
    }
    else if( iYear < 1949 ) {
        iArrHolidayTimeStamp[2] = php_mktime( 0, 0, 0, 2, 11, iYear );
        strArrHolidayID[2] = '紀元節';
    }

    // [3] ** 春分の日 **
    /*
        United States Naval Observatory (USNO) "Earth's Seasons – Equinoxes, Solstices, Apsides" (1700-2100)
        https://aa.usno.navy.mil/data/Earth_Seasons?utm_source=chatgpt.com
        Time and Date AS の "Solstices & Equinoxes for UTC (1900–1949)"
        https://www.timeanddate.com/calendar/seasons.html?n=1440&year=1900&utm_source=chatgpt.com
        AstroPixels の "Solstices and Equinoxes: 2001 to 2100"
        https://www.astropixels.com/ephemeris/soleq2001.html?utm_source=chatgpt.com
        "Equinox & Solstice Finder" (1800-2200)
        https://wutools.com/time/equinox-solstice-finder?utm_source=chatgpt.com
        http://ja.wikipedia.org/wiki/%E6%98%A5%E5%88%86
        http://koyomi.vis.ne.jp/mainindex.htm                               //* broken link
        http://oshiete.goo.ne.jp/qa/1454974.html                            //* broken link
        http://www.newscotland1398.net/equinox/vern1788.html                //* broken link
        http://www.holoscenes.com/special/seasons.html                      //* broken link
        http://www.ffortune.net/calen/higan/day.htm                         //* broken link
        http://ja.wikipedia.org/wiki/%E5%A4%A9%E3%81%AE%E8%B5%A4%E9%81%93
    */
    // 1900年より1987年まで
    // int( 21.443843 + 0.242194 * (Year - 1900) - int( (Year - 1900) / 4 ) )
    // 1988年以降
    // int( 20.7768171 + 0.242194 * (Year - 1988) - int( (Year - 1988) / 4 ) )
    if( iYear < 1988 ) {
        /*
            1988年より前は、1900年の春分点を基準にしてみる
            1900年の春分点は、21日01:39:08(UT)なので、日本では21日10:39:08になる( http://www.holoscenes.com/special/seasons.html)
            時以下の部分を日に換算すると 10:39:08 -> (10 * 60 *60 + 39 * 60 + 8) / (24 * 60 * 60) より 38348 / 86400 = 0.443843
              時以下の部分: xx:xx:xxについて24:00:00を1にするには
                    xx:xx:xxを秒に換算し、1日の秒数86400で割ればよい
                    $decimal = 4 * 3600 + 28 * 60 + 52;
                    $decimal = $decimal / 86400;
                    var_dump($decimal);
                    echo "<br>", PHP_EOL;
            従って、春分点は 21.443843になる
            0.242194は、1年の日数 365.242194日の小数点以下
            毎年この端数のぶん、日数が遅れる
            1900年の何年後に何日遅れるかは、単純に
            日数の遅れ = 経過年数×端数 = (Y-1900)×0.24219
            一方、暦は4年に1回ずつ1日を加えることで、この遅れを相殺している
            ( 実際には10分程度のずれが生じている -> 公転周期と1年365日のずれは、5時間50分なので4年で23時間50分、一方、暦を4年で1日伸ばすと、24時間
                                                    100年、200年というスパンではこのずれが影響してくるので、計算が合わなくなる
                                                    簡易計算が数十年の精度なのはこのため probably)

            19xx年の春分の日を求めるには、

            ① 1900年の太陽の春分点通過日     21.443843

            ② 1年ごとの春分点通過日の移動量  (Y-1900)×0.24219

            ③ 閏年によるリセット量           int((Y-1980)/4)

            以上から
            INT( ① ＋ ② - ③ )
        */
        iHaru = parseInt(21.443843 + 0.242194 * (iYear - 1900) - parseInt((iYear - 1900) / 4, 10), 10);
    }
    else {
        // 1988年以降は、1988年の春分点を基準にしてみる
        // 1988年の春分点 :  20日09:38:37(UT) -> 日本時間 20日18:38:37 -> 20.7768171
        iHaru = parseInt(20.7768171 + 0.242194 * (iYear - 1988) - parseInt((iYear - 1988) / 4, 10), 10);
    }
    iArrHolidayTimeStamp[3] = php_mktime( 0, 0, 0, 3, iHaru, iYear );
    strArrHolidayID[3] = '春分の日';
    // for debug
    // alert( iYear + " " + strHaru );

    // [4] ** 昭和の日 **
    iArrHolidayTimeStamp[4] = php_mktime( 0, 0, 0, 4, 29, iYear );
    strArrHolidayID[4] = '昭和の日';

    // [5] ** 憲法記念日 **
    iArrHolidayTimeStamp[5] = php_mktime( 0, 0, 0, 5, 3, iYear );
    strArrHolidayID[5] = '憲法記念日';

    // [6] ** みどりの日 **

    // 場合分け必要
    iArrHolidayTimeStamp[6] = php_mktime( 0, 0, 0, 5, 4, iYear );
    strArrHolidayID[6] = 'みどりの日';
    // 国民の休日 5月4日バージョン 1986年から2006年まで
    // 5月4日の国民の休日とは祝日にはさまれた日曜日、月曜日ではない日を休日にすることで，1986年に施行された
    // 5月4日が月曜の場合、振替休日制度( 1973年施行 )により、元々休日なので、国民の休日にはならない
    if( iYear >= 1986 && iYear <= 2006 ) {
        iWeekDays = parseInt(php_date( 'w', iArrHolidayTimeStamp[6]), 10);
        // この年の5月4日は日曜か月曜か？
        if( iWeekDays == 0 || iWeekDays == 1  ) {
            strArrHolidayID[6] = '平日';
        }
        // それ以外は休日になる
        else {
            strArrHolidayID[6] = '国民の休日';
        }
    }
    // for debug
    // alert( strArrHolidayID[6] );

    // [7] ** こどもの日 **
    iArrHolidayTimeStamp[7] = php_mktime( 0, 0, 0, 5, 5, iYear );
    strArrHolidayID[7] = 'こどもの日';

    // [8] ** 海の日 **
    if( iYear >= 2003 ) {
        // happy manday 第3月曜
        iArrHolidayTimeStamp[8] = happyMon( iYear, 7, 3 );
    }
    else {
        iArrHolidayTimeStamp[8] = php_mktime( 0, 0, 0, 7, 20, iYear );
    }
    strArrHolidayID[8] = '海の日';

    // [9] ** 山の日 **
    iArrHolidayTimeStamp[9] = php_mktime( 0, 0, 0, 8, 11, iYear );
    strArrHolidayID[9] = '山の日';

    // [10} ** 敬老の日 **
    if( iYear >= 2003 ) {
        // happy manday 第3月曜
        iArrHolidayTimeStamp[10] = happyMon( iYear, 9, 3 );
    }
    else {
        iArrHolidayTimeStamp[10] = php_mktime( 0, 0, 0, 9, 15, iYear );
    }
    strArrHolidayID[10] = '敬老の日';

    // [12] ** 秋分の日 **
        /*
            国民の休日は，敬老の日と秋分の日の間に発生する場合があるが，
            秋分の日の日付が分からないと調べられないので，先に，秋分の日の日付を求めておく

            春分が1988年を基準年にしてOKだった(1988年から2049年まで)ので、秋分も1988で統一出来ないか？ -> 出来た！
            この簡易計算は基準年を閏年に選ばないと期待通りの結果が得られないことに注意
            理由は、閏年のタイミングで、基準年から4年後に1日を追加しないと公転周期と暦でずれが生じるため
        */

    // 1900年より1987年まで
    // int( 23.8890972 + 0.242194 * (Year - 1900) - int( (Year - 1900) / 4 ) )
    // 1988年以降
    // int( 23.18671297 + 0.242194 * (Year - 2000) - int( (Year - 2000) / 4 ) )
    if( iYear < 1988 ) {
        // 1988年より前は、1900年の秋分点を基準にしてみる( http://www.holoscenes.com/special/seasons.html)
        // 1900年の秋分点 :  23日12:20:18(UT) -> 日本時間 23日21:20:18 -> 23.8890972
        iAki = parseInt(23.8890972 + 0.242194 * (iYear - 1900) - parseInt((iYear - 1900) / 4, 10), 10);
    }
    else {
        // 1988年以降は、1988年の秋分点を基準にしてみる
        // 1988年の秋分点 :  22日19:28:52(UT) -> 日本時間 23日04:28:52 -> 23.18671297
        iAki = parseInt(23.18671297 + 0.242194 * (iYear - 1988) - parseInt((iYear - 1988) / 4, 10), 10);
    }
    iArrHolidayTimeStamp[12] = php_mktime( 0, 0, 0, 9, iAki, iYear );
    strArrHolidayID[12] = '秋分の日';
    // for debug
    // alert( iYear + " " + strAki );

    // [11] ** 国民の休日 （9月バージョン）**
        /*
            そもそも「みどりの日」施行以前の5月4日を、休日扱いにするために実施された「国民の休日」であるが、
            その定義が9月に波及したものである。
            定義とは、日曜以外の曜日で、祝日が飛び石で続く場合は、その間の日が平日であれば、
            その日を「国民の休日」とするものである。
            9月には祝日が2回あり、最初は第3月曜を祝日とする「敬老の日」で、次は「秋分の日」である。
            HappyMonday施行以後で，敬老の日が20日か21日の場合があり，秋分の日が22日か23日の場合がある。
            パターンとしては  ①敬老の日:20日，秋分の日が22日ならば，21日が国民の休日になる
                              ②敬老の日:21日，秋分の日が23日ならば，22日が国民の休日になる
            以上から秋分の日が22日で水曜ならばパターン①が確定 <- 第3月曜が秋分の日を含む週の前の週である可能性がないため
                    秋分の日が23日で水曜ならばパターン②が確定 <- 同上
            ただし、このパターンに合致する年は少ないので、
            9月の「国民の休日」は存在しない年の方が多い。
            そこで、「国民の休日」が存在する年だけ
            配列変数iArrHolidayTimeStampとstrArrHolidayIDに、データを格納することにする。
            配列は添字でも連想配列のキー扱いになるので(？)、順番から行くと9月の「国民の休日」の添字は「11」であるが、
            このキーのデータが作られていなくても、支障を来すことはない。
        */

    if( php_date( 'w', iArrHolidayTimeStamp[12] ) == 3 ) {
        if( php_date( 'd', iArrHolidayTimeStamp[12] ) == 22 ) {
                iArrHolidayTimeStamp[11] = php_mktime( 0, 0, 0, 9, 21, iYear );
                strArrHolidayID[11] = '国民の休日';
        }
        if( parseInt(php_date('d', iArrHolidayTimeStamp[12]), 10) == 23 ) {
                iArrHolidayTimeStamp[11] = php_mktime( 0, 0, 0, '9', 22, iYear );
                strArrHolidayID[11] = '国民の休日';
        }
        // for debug
        // alert( "strArrHolidayID[11]" + strYear + " " + php_date( 'd', iArrHolidayTimeStamp[11] ) );
    }
    // for debug
    // alert( "strArrHolidayID[11]" + strYear + " " + php_date( 'd', iArrHolidayTimeStamp[11] ) );

    // [13] ** 体育の日 **
    if( iYear >= 2000 ) {
        // happy manday 第2月曜
        iArrHolidayTimeStamp[13] = happyMon( iYear, 10, 2 );
    }
    else {
        iArrHolidayTimeStamp[13] = php_mktime( 0, 0, 0, 10, 10, iYear );
    }
    strArrHolidayID[13] = '体育の日';

    // [14] ** 文化の日 **
    iArrHolidayTimeStamp[14] = php_mktime( 0, 0, 0, 11, 3, iYear );
    // 天長節(後の明治節)
    if( iYear > 1873 && iYear < 1912 ) {
        strArrHolidayID[14] = '天長節(明治)';
    }
    // 明治節(後の文化の日)
    else if( iYear > 1926 && iYear < 1949 ) {
        strArrHolidayID[14] = '明治節';
    }
    else {
        strArrHolidayID[14] = '文化の日';
    }

    // [15] ** 勤労感謝の日 **
    iArrHolidayTimeStamp[15] = php_mktime( 0, 0, 0, 11, 23, iYear );
    // 新嘗祭(後の勤労感謝の日)
    if( iYear > 1873 && iYear < 1949 ) {
        strArrHolidayID[15] = '新嘗祭';
    }
    else {
        strArrHolidayID[15] = '勤労感謝の日';
    }

    // [16] ** 天皇誕生日 **
    if( iYear < 2019 ) {
        iArrHolidayTimeStamp[16] = php_mktime( 0, 0, 0, 12, 23, iYear );
        strArrHolidayID[16] = '天皇誕生日(平成)';
    }
    else if( iYear > 2019 ) {
        iArrHolidayTimeStamp[16] = php_mktime( 0, 0, 0, 2, 23, iYear );
        strArrHolidayID[16] = '天皇誕生日';
    }

    // [30] ** 天皇退位日(2019年限定) **
    if( iYear == 2019 ) {
        iArrHolidayTimeStamp[30] = php_mktime( 0, 0, 0, 4, 30, iYear );
        strArrHolidayID[30] = '天皇退位日';
    }
    // [31] ** 皇太子即位日(2019年限定) **
    if( iYear == 2019 ) {
        iArrHolidayTimeStamp[31] = php_mktime( 0, 0, 0, 5, 1, iYear );
        strArrHolidayID[31] = '皇太子即位日';
    }
    // [32] ** 国民の休日=イレギュラー=(2019年限定) **
    if( iYear == 2019 ) {
        iArrHolidayTimeStamp[32] = php_mktime( 0, 0, 0, 5, 2, iYear );
        strArrHolidayID[32] = '国民の休日';
    }
    // [33] ** 即位礼正殿の儀(2019年限定) **
    if( iYear == 2019 ) {
        iArrHolidayTimeStamp[33] = php_mktime( 0, 0, 0, 10, 22, iYear );
        strArrHolidayID[33] = '即位礼正殿の儀';
    }
    //// 1873年10月14日の「法律制定」から1948年の「祝日法施行」まで
    //// 紀元節は建国記念の日、天長節・明治節は文化の日、新嘗祭は勤労感謝の日セクションでまとめた
    //////////////////////////////////////////////////////////////////
    // [40] ** 元始祭
    if( iYear > 1873 && iYear < 1949 ) {
        iArrHolidayTimeStamp[40] = php_mktime( 0, 0, 0, 1, 3, iYear );
        strArrHolidayID[40] = '元始祭';
    }
    // [41] ** 新年宴会
    if( iYear > 1873 && iYear < 1949 ) {
        iArrHolidayTimeStamp[41] = php_mktime( 0, 0, 0, 1, 5, iYear );
        strArrHolidayID[41] = '新年宴会';
    }
    // [42] ** 孝明天皇祭(明治天皇)
    if( iYear > 1873 && iYear < 1913 ) {
        iArrHolidayTimeStamp[42] = php_mktime( 0, 0, 0, 1, 30, iYear );
        strArrHolidayID[42] = '孝明天皇祭';
    }
    // [43] ** 神武天皇祭
    if( iYear > 1873 && iYear < 1949 ) {
        iArrHolidayTimeStamp[43] = php_mktime( 0, 0, 0, 4, 3, iYear );
        strArrHolidayID[43] = '神武天皇祭';
    }
    // [44] ** 明治天皇祭
    if( iYear > 1912 && iYear < 1927 ) {
        iArrHolidayTimeStamp[44] = php_mktime( 0, 0, 0, 7, 30, iYear );
        strArrHolidayID[44] = '明治天皇祭';
    }
    // [45] ** 天長節(大正天皇)
    if( iYear > 1912 && iYear < 1927 ) {
        iArrHolidayTimeStamp[45] = php_mktime( 0, 0, 0, 8, 31, iYear );
        strArrHolidayID[45] = '天長節(大正)';
    }
    // [46] ** 天長節祝日(大正天皇の誕生日は暑い時期だったので、2ヶ月後も天長節の祝日とした 休んでばっかだなぁ (^^; )
    if( iYear > 1912 && iYear < 1927 ) {
        iArrHolidayTimeStamp[46] = php_mktime( 0, 0, 0, 10, 31, iYear );
        strArrHolidayID[46] = '天長節祝日';
    }
    // [47] ** 神嘗祭
    if( iYear > 1873 && iYear < 1948 ) {
        iArrHolidayTimeStamp[47] = php_mktime( 0, 0, 0, 10, 17, iYear );
        strArrHolidayID[47] = '神嘗祭';
    }
    // [48] ** 大正天皇祭
    if( iYear > 1926 && iYear < 1948 ) {
        iArrHolidayTimeStamp[48] = php_mktime( 0, 0, 0, 12, 25, iYear );
        strArrHolidayID[48] = '大正天皇祭';
    }
    //////////////////////////////////////////////////////////////////
}

function targetMonth(strYear, strMonth) {
    var iYear = parseInt(strYear, 10);
    var iMonth = parseInt(strMonth, 10);

    //###################################################################################
    // 指定月の処理
    //-------------

    // 指定月の一日が何曜日から始まるか調べる( ついでに指定月の末日も調べておく)

    // 引数に指定した値のタイムスタンプを求める
    iFirstDayTimeStamp = php_mktime( 0, 0, 0, iMonth, iFirst, iYear );
    iLastDayTimeStamp = php_mktime( 0, 0, 0, iMonth + 1, iFirst - 1, iYear );
    // for debug
    // alert( iTargetTimeStamp );

    // 一日の曜日を$iFirstDaysに格納
    iFirstDays = parseInt(php_date('w', iFirstDayTimeStamp), 10);
    iLastDays = parseInt(php_date( 'w', iLastDayTimeStamp), 10);

    // 一日が日曜以外の場合，先月の最終日曜の日付までタイムスタンプを求めておく( この後，振休判定で必要になる )
    // 当月はmax31日とすると，配列は最大で37個必要になる( １日が日曜の場合も、とりあえず37日分求めておく)
    // 140801 実際にカレンダーを表示させるときのために42日分求めておく
    for( i = 0; i < iSumTargetDay; i++ ) {
        iToday = i - iFirstDays + 1;
        // for debug
        // alert( $strToday );
        iArrTargetDay_TimeStamp[i] = php_mktime( 0, 0, 0, iMonth, iToday, iYear );
    }

    // 指定月の祝日処理
    //-----------------

    // 祝日情報格納配列と祝日名格納配列にデフォルト値をセット
    for( i = 0; i < iSumTargetDay; i++ ) {
        iArrTargetMonthHoliday[i] = 0;                // 0 : 平日
        strArrTargetMonthHolidayID[i] = "";        // "": 空文字列
    }
    for( i = 0; i < iSumTargetDay; i++ ) {
        var j = 0;
        while( j < iHolidayNum ) {
            // 「国民の休日」がセットされていない年もある( iArrHolidayTimeStamp[11]が存在しない )ので、
            // データが格納されている配列のみ祝日処理を行うようにする
            if( iArrHolidayTimeStamp[j] ) {
                if( iArrTargetDay_TimeStamp[i] == iArrHolidayTimeStamp[j] ) {
                    // とりあえず，祝日に設定する
                    iArrTargetMonthHoliday[i] = 1;
                    // 祝日制定年による場合分け( それまで，該当する祝日はなかったんだ...)
                    switch(j) {
                        // 0: 元旦
                        case 0:
                            // 戦前は正式な休日ではなかった
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if( iYear < 1949 ) {
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 1: 成人の日
                        case 1:
                            // 成人の日は1949からの祝日
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if( iYear < 1949 ) {
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 3: 春分の日, 12: 秋分の日は昔から祝日だった
                        case 3: case 12:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            break;
                        // 2: 建国記念日
                        case 2:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if( iYear > 1948 && iYear < 1967 ) {
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 4: 昭和の日
                        case 4:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if( iYear < 1927 ) {
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            else if( iYear > 1926 && iYear < 1949 ) {
                                strArrTargetMonthHolidayID[i] = "天長節(昭和)";
                            }
                            else if( iYear > 1948 && iYear <= 1988 ) {
                                strArrTargetMonthHolidayID[i] = "天皇誕生日(昭和)";
                            }
                            else if( iYear <= 2006 ){
                                strArrTargetMonthHolidayID[i] = "みどりの日";
                            }
                            break;
                        // 5: 憲法記念日  7: こどもの日
                        case 5: case 7:
                            // 1949～
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if( iYear < 1949 ) {
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 6: みどりの日
                        case 6:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if( iYear >= 1986 && iYear <= 2006 ) {
                                if( strArrHolidayID[j] == '平日' ) {
                                    strArrTargetMonthHolidayID[i] = "";
                                    iArrTargetMonthHoliday[i] = 0;
                                }
                            }
                            else if( iYear <= 1985 ) {
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 8: 海の日
                        case 8:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if( iYear < 1996 ) {
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 9: 山の日
                        case 9:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if( iYear < 2016 ) {
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 10: 敬老の日 13: 体育の日
                        // 1966～
                        case 10: case 13:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if( iYear < 1966 ) {
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 11: 国民の休日
                        case 11:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            // for debug
                            // alert( $strArrHolidayID[j] j strArrTargetMonthHolidayID[i] );
                            if( iYear < 2004 ) {
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 14: 文化の日
                        case 14:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if ( iYear > 1911 && iYear < 1927  ) {  // この間跳んでいる
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 15: 勤労感謝の日
                        case 15:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            break;
                        // 16: 天皇誕生日
                        case 16:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            if( iYear < 1989 ) {
                                strArrTargetMonthHolidayID[i] = "";
                                iArrTargetMonthHoliday[i] = 0;
                            }
                            break;
                        // 30: 天皇退位日
                        case 30:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            break;
                        // 31: 皇太子即位日
                        case 31:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            break;
                        // 32: 国民の休日=イレギュラー=
                        case 32:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            break;
                        // 33: 即位礼正殿の儀
                        case 33:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            break;
                        // 40: 元始祭           41: 新年宴会   42: 孝明天皇祭(明治天皇) 43: 神武天皇祭 44: 明治天皇祭,
                        // 45: 天長節(大正天皇) 46: 天長節祝日 47: 神嘗祭               48: 大正天皇祭
                        case 40: case 41: case 42: case 43: case 44: case 45: case 46: case 47: case 48:
                            strArrTargetMonthHolidayID[i] = strArrHolidayID[j];
                            break;
                    }
                    // for debug
                    // alert( strArrTargetMonthHolidayID[i] );
                }
            }
            j = j + 1;
        }
    }
}

function subHoliday(strYear, strMonth) {
    var iYear = parseInt(strYear, 10);
    var iMonth = parseInt(strMonth, 10);

    //###################################################################################
    // 振替休日処理
    //-------------
    /*
        例)
        2015年05月
        03日 日 -> 0       憲法記念日   日 祝
        04日 月 -> 1       緑の日          祝
        05日 火 -> 2       こどもの日      祝
        06日 水 -> 3       振替休日
    */
    // 振替休日の制度が始まったのは、1973年なので、それ以降の年が指定された場合に、処理を行う
    if( iYear >= 1973 ) {
        for( i = 0; i < iSumTargetDay; i++ ) {
            // 37個のタイムスタンプのうち、指定月のみを処理対象とする
            if( iMonth == parseInt(php_date( 'm', iArrTargetDay_TimeStamp[i]), 10) ) {
                // iは当日のタイムスタンプが格納された配列のindexのため、値を変えることは出来ないので、
                // jにiの値を格納して処理日をさかのぼらせることにする
                j = i;
                // $iDays : 当日の曜日番号を格納する整数型変数
                iWeekDays = parseInt(php_date( 'w', iArrTargetDay_TimeStamp[j]), 10);
                // for debug
                // alert( "今日は " + parseInt(php_date( 'd', iArrTargetDay_TimeStamp[j]), 10) + "日なので " + iWeekDays + " 曜日です" );
                // document.write( "今日は " + parseInt(php_date( 'd', iArrTargetDay_TimeStamp[j]), 10) + "日なので " + iWeekDays + " 曜日です <br>" );
                // 当日が平日だった場合に、振休の処理に入る
                if( iArrTargetMonthHoliday[j] == 0 ) {
                    /*
                        水なら日までさかのぼり火，月，日が全て祝なら水は振休
                        火なら日までさかのぼり月，日が全て祝なら火は振休
                        月なら日までさかのぼり日が祝なら月は振休
                        その間に平日が出て来た場合、または最後が「普通の」日曜ならば、振休にはならないので処理から抜ける
                    */
                    // 処理対象は月曜から水曜まで
                    while( iWeekDays > 0 && iWeekDays < 4 ) {
                        j = j - 1;                    // 祝日情報格納配列から前日以前の祝日情報を呼び出す準備
                        iWeekDays = iWeekDays - 1;    // 前日以前の曜日番号をセット
                        // 前日が休日の場合、if文内の処理を行う
                        if( iArrTargetMonthHoliday[j] == 1 ) {
                            iArrTargetMonthHoliday[i] = 2; // 振替休日は一般の休日とは区別する。振休の振休はないため
                                                             // これを「1」に指定すると、どうなるか試してみればすぐに分かる
                            strArrTargetMonthHolidayID[i] = '振替休日';
                        }
                        else {
                            iArrTargetMonthHoliday[i] = 0; // 残念ながら振休にはならなかったので、平日に戻す
                            strArrTargetMonthHolidayID[i] = '';
                            break;
                        }
                    }
                }
                // for debug
                // alert( date( 'd', iArrTargetDay_TimeStamp[i] ) + " は " + strArrTargetMonthHolidayID[i] );
                // document.write( php_date( 'd', iArrTargetDay_TimeStamp[i] ) + " は " + strArrTargetMonthHolidayID[i] + " 曜日です <br>" );
            }
        }
    }
}

function set_caption(year, month){
    var reset_data = document.createElement('input');
    reset_data.type = "button";
    reset_data.value = "reset";
    reset_data.className = "reset_data";
    reset_data.id = "id_reset_data";

    var prev_y = document.createElement('a');
    prev_y.href = '#year-' + ((year < 1902) ? 1902 : year-1) + '-' + month;
    prev_y.className = 'prev_y';
    prev_y.innerHTML = "&laquo;";
    var next_y = document.createElement('a');
    next_y.href = '#year-' + ((year > 2037) ? 2037 : year+1) + '-' + month;
    next_y.className = 'next_y';
    next_y.innerHTML = "&raquo;";

    var prev_m = document.createElement('a');
    prev_m.href = '#month-' + ((month === 1) ? year-1 : year) + '-' + (month===1?12:month-1);
    prev_m.className = 'prev_m';
    prev_m.innerHTML = "&laquo;";
    var next_m = document.createElement('a');
    next_m.href = '#month-' + ((month === 12) ? year+1 : year) + '-' + (month===12?1:month+1);
    next_m.className = 'next_m';
    next_m.innerHTML = "&raquo;";

    var current_y = document.createElement('input');
    current_y.type = "text";
    current_y.size = "4";
    var text_y = year;
    current_y.value = text_y;
    current_y.className = "year";
    current_y.id = "id_year";
    var current_m = document.createElement('input');
    current_m.type = "text";
    current_m.size = "2";
    var text_m = month;
    current_m.value = text_m;
    current_m.className = "month";
    current_m.id = "id_month";

    var caption = document.createElement('caption');
    var div = document.createElement('div');
    div.appendChild(prev_y);
    div.appendChild(current_y);
    div.appendChild(next_y);
    div.appendChild(prev_m);
    div.appendChild(current_m);
    div.appendChild(next_m);
    div.appendChild(reset_data);
    caption.appendChild(div);
    this.table.appendChild(caption);
}

function set_thead(){
    // 曜日
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    for (var i = 0; i < 7; i++){
        var th = document.createElement('th');
        var day = day_en[i];
        th.appendChild(document.createTextNode(day));
        th.className = 'calendar day-head day' + i;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    this.table.appendChild(thead);
}

function set_body(year, month){
    //画面に表示
    // 140801
    // 当月のカレンダーを表示するのに何行必要か調べておく
    var iLastDate = parseInt(php_date( 'd', iLastDayTimeStamp), 10);
    // 以下のパターン以外は、全て5行
    var rowNum = 5;
    if( iLastDate == 31 ) {
        // １日が金曜, 土曜の場合は、6行必要
        if( iFirstDays > 4 ) {
            rowNum = 6;
        }
    }
    if( iLastDate == 30 ) {
        // １日が土曜の場合は、6行必要
        if( iFirstDays > 5 ) {
            rowNum = 6;
        }
    }
    if( iLastDate == 28 ) {
        // １日が日曜なら、4行でよい
        if( iFirstDays == 0 ) {
            rowNum = 4;
        }
    }

    var tbody = document.createElement('tbody');
    var skip = true;
    var i = -1;
    for (var row = 0; row < rowNum; row++) {
        var tr = document.createElement('tr');
        for (var col = 0; col < 7; col++){
            i++;
            if (row === 0 && iFirstDays === col){
                skip = false;
            }
            if (i - iFirstDays + 1 > iLastDate) {
                skip = true;
            }
            var td = document.createElement('td');
            td.className = 'calendar day' + col;
            if (!skip) {
                var a = document.createElement('a');
                var strTargetDay = parseInt(php_date( 'd', iArrTargetDay_TimeStamp[i]), 10);
                // 祝日IDを付加
                if( strArrTargetMonthHolidayID[i] ) {
                    strTargetDay += "<br> <span style = \"font-size: 10px;\">" + strArrTargetMonthHolidayID[i] + "</span>";
                }
                else {
                    strTargetDay += "<br> &nbsp;";
                }
                if( parseInt(php_date('w', iArrTargetDay_TimeStamp[i]), 10)  == 0 ) {
                    a.href = '#day-' +year+ '-' +month+ '-' +strTargetDay;
                    a.innerHTML = strTargetDay;
                    td.appendChild(a);
                    td.className =  'calendar day' + col + ' red';
                }
                else if( parseInt(php_date( 'w', iArrTargetDay_TimeStamp[i]), 10)  == 6 ) {
                    a.href = '#day-' +year+ '-' +month+ '-' +strTargetDay;
                    a.innerHTML = strTargetDay;
                    td.appendChild(a);
                    td.className =  'calendar day' + col + ' blue';
                }
                if( iArrTargetMonthHoliday[i] == 1 || iArrTargetMonthHoliday[i] == 2 ) {
                    a.href = '#day-' +year+ '-' +month+ '-' +strTargetDay;
                    a.innerHTML = strTargetDay;
                    td.appendChild(a);
                    td.className =  'calendar day' + col + ' red';
                }
                else {
                    a.href = '#day-' +year+ '-' +month+ '-' +strTargetDay;
                    a.innerHTML = strTargetDay;
                    td.appendChild(a);
                }
            }
            else {
                td.innerHTML='<span class="blank">&nbsp;</span>';
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    this.table.appendChild(tbody);
}

function create(year, month){
    var that = this;
    var table = document.createElement('table');
    table.className = 'p_calen';
    this.table = table;

    table.onclick = function(e){
        // 以下の2行の「||」より右側は、IE対応
        var evt = e || window.event; // 引数eの内容: click clientX=104, clientY=25 など、table内の座標
        var target = evt.target || evt.srcElement; // evt.target: イベントの発生元であるオブジェクトを取得
                                                   // 元のオブジェクト？ <a class="next_y" href="#year-2016-8">»</a>
                                                   // targetの内容: a.next_y #year-2016-8 <- アンカーオブジェクトでクラスに「next_y」を持ち、
                                                   //                                        hrefが「#year-2016-8」ということ...か？
        if (target.tagName === 'A' && target.hash.indexOf('#day-') === 0) {
            return that.onclick_date.apply(that, target.hash.match(/day-(\d+)-(\d+)-(\d+)/));
        }
        else if (target.tagName === 'A' && target.hash.indexOf('#month-') === 0) {
            return that.onclick_month.apply(that, target.hash.match(/month-(\d+)-(\d+)/));
        }
        else if (target.tagName === 'A' && target.hash.indexOf('#year-') === 0) {
                                          // hashメソッド: target内のアンカー文字列( #以降 )を取り出す
                                                        // Ex. a.prev_y #year-2016-8
                                                        // ならば、#year-2016-8
                                          // indexOfメソッドは対象の文字列( この場合、hashで取り出された#year-2016-8 )の中に
                                          // ''内で指定した文字列が含まれるかどうか検索し、
                                          // 含まれていた場合は最初の見つかった位置( 先頭で見つかった場合はゼロ )を返す
            return that.onclick_year.apply(that, target.hash.match(/year-(\d+)-(\d+)/));
                                                          // この場合は、year-2016-8, 2016, 8がマッチする
        }
        // 表示内容をリセットし、現在の月を表示する
        else if(target.tagName === 'INPUT' && target.id === 'id_reset_data') {
            var yearNow = parseInt(php_date( 'Y'), 10);               // 現在の西暦を取得
            var monthNow = parseInt(php_date( 'm'), 10);              // 現在の月を取得
            return that.set_year_month.call(that, yearNow, monthNow);
        }
        else {
            return false;
        }
    };

    table.onchange = function(e){
        var evt = e || window.event;// 引数eの内容: change
        var target = evt.target || evt.srcElement; // evt.target: イベントの発生元であるオブジェクトを取得
                                                   // evt.target: [例] input#id_month.month プロパティ値 = "9" 属性値 = "null"
        if (target.tagName === 'INPUT' && target.className === 'month') {
            var monthVal = inputDataCheck(target.className, target.value); // [例] target.value: "9"
            var id_year_content = document.getElementById('id_year'); // [例] input#id_year.year プロパティ値 = "2014" 属性値 = "null"
//            alert(id_year_content);
//            alert(id_year_content.value);
            return that.onchange_month.call(that, id_year_content.value, monthVal);
        }
        else if (target.tagName === 'INPUT' && target.className === 'year') {
            var yearVal = inputDataCheck(target.className, target.value);
            var id_month_content = document.getElementById('id_month');
            return that.onchange_year.call(that, yearVal, id_month_content.value);
        }
    };

    this.set_date(year, month);
    this.happyHoliday(this.year, this.month);
    this.targetMonth(this.year, this.month);
    this.subHoliday(this.year, this.month);
    this.set_caption(this.year, this.month);
    this.set_thead();
    this.set_body(this.year, this.month);
    this.parent.appendChild(table);
}

})();
