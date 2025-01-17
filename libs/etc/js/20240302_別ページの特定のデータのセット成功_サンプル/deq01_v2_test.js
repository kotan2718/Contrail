        // Gloavbl 変数 //
        let max = 99999;
        let eps = 0.01;
        let dat = 1;
        // 係数
        let ma;
        let mb;
        let mc;
        let md;
        let me;
        let mf;
        let mg;
        let mh;
        // 係数使用可否
        let ma_used = 1;
        let mb_used = 1;
        let mc_used = 1;
        let md_used = 1;
        let me_used = 0;
        let mf_used = 0;
        let mg_used = 0;
        let mh_used = 0;
        // 繰返し回数
        cnt_dp = 320;
        // 刻み幅(時間経過ステップ)
        dh = 0.01;

        let mode = 0;
        //////////////////

        let width0 = 8;
        let height0 = 8;
        const canvas = document.getElementById('graphCanvas');
        const ctx = canvas.getContext('2d');

        // 描画領域をリセット
        ctx.fillStyle = 'rgb( 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        async function animateGraph() {

            // 描画中に使用不可とするコントロール
            usability(false);

            // スケーリング
            let scaleX = canvas.width / width0;
            let scaleY = canvas.height / height0;

            let linePoints = [];
            let linePoints2 = [];
            // 64個の配列を初期化
            for (let i = 0; i < 64; i++) {
                linePoints.push([]);
                linePoints2.push([]);
            }

//            var dh = Math.sqrt(Math.pow((width0 / canvas.width), 2) + Math.pow((height0 / canvas.height), 2));
            var dt = 0.0;
            var dnt = 0.0;

            // Runge-Kutta法
            var Ru_dx = new Array(64);
            var Ru_dy = new Array(64);
            var Ru_dx_init = new Array(64);   // 全象限初期値格納位置
            var Ru_dy_init = new Array(64);
            var Ru_x0 = 0.0;
            var Ru_y0 = 0.0;
            var Ru_x0_init = new Array(16);   // 第1象限 初期値格納位置
            var Ru_y0_init = new Array(16);
            var Ru_kx = new Array(4);
            var Ru_ky = new Array(4);

            let Ru_r0;
            let Ru_x1;
            let Ru_y1;
            let Ru_r1;
            let Ru_u0;
            let Ru_v0;
            let Ru_u1;
            let Ru_v1;

            let Ru_hq;
            let Ru_dq;
            let pixelX;
            let pixelY;

            // 第1象限に16個の初期点を作る
            // 乱数使用
            var j = 0;
            for (let l = 0; l < 4; l++)
            {
                for (let m = 0; m < 4; m++)
                {
                    Ru_x0_init[j] = l * (0.5 * width0 / 4.0) + (l + 1) * (0.5 * width0 / 4.0) * Math.random();
                    Ru_y0_init[j] = m * (0.5 * -height0 / 4.0) + (m + 1) * (0.5 * -height0 / 4.0) * Math.random();
                    j++;
                }
            }

            // x軸の描画
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2); // canvasの中心から左右に直線を引く
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.strokeStyle = 'rgb(155, 155, 155)';
            ctx.stroke();

            // y軸の描画
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0); // canvasの中心から上下に直線を引く
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.strokeStyle = 'rgb(155, 155, 155)';
            ctx.stroke();

            for (let k = 0; k < 2; k++) {
                // 第1象限から10個の初期点を取って、各象限にコピーする
                for (let j = 0; j < 16; j++)
                {
                    Ru_dx[j] = Ru_x0_init[j]; // 第1象限
                    Ru_dy[j] = Ru_y0_init[j];
                    Ru_dx[j + 16] = -Ru_x0_init[j]; // 第2象限
                    Ru_dy[j + 16] = Ru_y0_init[j];
                    Ru_dx[j + 32] = -Ru_x0_init[j]; // 第3象限
                    Ru_dy[j + 32] = -Ru_y0_init[j];
                    Ru_dx[j + 48] = Ru_x0_init[j]; // 第4象限
                    Ru_dy[j + 48] = -Ru_y0_init[j];
                }
                for (let i = 0; i < 64; i++) {
                    Ru_dx_init[i] = Ru_dx[i];
                    Ru_dy_init[i] = Ru_dy[i];
                }

                //// for debug start
//                Ru_dx[0] = 0.25;
//                Ru_dy[0] = 0.5;
                //// for debug   end

                if (k == 1) {
                    dh = -dh;
                }

                for (dp = 1; dp <= cnt_dp; dp++) {
                    for (let i = 0; i < 64; i++) {

                        Ru_x0 = Ru_dx[i];
                        Ru_y0 = Ru_dy[i];
                        dt = dnt;

                        if (dp == 1) {
                            pixelX = scaleX * (Ru_dx[i] + width0 / 2);
                            pixelY = scaleY * (height0 / 2 - Ru_dy[i]);

                            if (k == 0) {
                                linePoints[i].push({ x: pixelX, y: pixelY });
                            }
                            else {
                                linePoints2[i].push({ x: pixelX, y: pixelY });
                            }
                        }

                        switch (mode)
                        {
                            case 0:
                                ///////////////////
                                //               //
                                // Euler法       //
                                //               //
                                ///////////////////
                                if (Math.abs(Ru_x0) > Math.abs(width0) || Math.abs(Ru_y0) > Math.abs(height0)) {
                                    continue;
                                }
                                Ru_r0 = Math.sqrt(Ru_x0 * Ru_x0 + Ru_y0 * Ru_y0);
                                Ru_u0 = FNF(dh, Ru_x0, Ru_y0) / Ru_r0;
                                Ru_v0 = FNG(dh, Ru_x0, Ru_y0) / Ru_r0;
                                Ru_dq = Math.sqrt(Ru_u0 * Ru_u0 + Ru_v0 * Ru_v0);
                                //Ru_dx[i] = Ru_x0 + FNF(dh, Ru_x0, Ru_y0) * dh;
                                //Ru_dy[i] = Ru_y0 + FNG(dh, Ru_x0, Ru_y0) * dh;
//                              //  Ru_dy[i] = Ru_y0 + FNG(dt, Ru_dx[i], Ru_y0) * dh;   // これありかなぁ？
                                //Ru_dx[i] = Ru_x0 + Ru_u * dh / Ru_q;
                                //Ru_dy[i] = Ru_y0 + Ru_v * dh / Ru_q;
                                Ru_dx[i] = Ru_x0 + Ru_u0 * dh;
                                Ru_dy[i] = Ru_y0 + Ru_v0 * dh;
                                if (Math.abs(Ru_dx[i]) > Math.abs(width0) || Math.abs(Ru_dy[i]) > Math.abs(height0)) {
                                    //ovrRangeFlg = 1;
                                    //break;
                                    continue;
                                }
                                //if (Math.sqrt(Math.pow(Ru_dx[i] - Ru_x0, 2.0) + Math.pow(Ru_dy[i] - Ru_y0, 2.0)) < eps / 10.0) {  // 20230904 epsが0.01は小さすぎるか？
                                if (Math.sqrt(Math.pow(Ru_dx[i] - Ru_x0, 2) + Math.pow(Ru_dy[i] - Ru_y0, 2)) < Math.abs(width0) / 10000) {
                                    //ovrRangeFlg = 1;
                                    //break;
                                    //continue;
                                }

                                break;

                            case 1:
                                /////////////////////
                                ////               //
                                //// 修正Euler法   //
                                ////               //
                                /////////////////////
                                if (Math.abs(Ru_x0) > Math.abs(width0) || Math.abs(Ru_y0) > Math.abs(height0)) {
                                    continue;
                                }

                                //Ru_kx[0] = dh * FNF(dt, Ru_x0, Ru_y0);
                                //Ru_ky[0] = dh * FNG(dt, Ru_x0, Ru_y0);
                                //Ru_kx[1] = dh * FNF(dt + dh, Ru_x0 + Ru_kx[0], Ru_y0 + Ru_ky[0]);
                                //Ru_ky[1] = dh * FNG(dt + dh, Ru_x0 + Ru_kx[0], Ru_y0 + Ru_ky[0]);
                                //Ru_dx[i] = Ru_x0 + (Ru_kx[0] + Ru_kx[1] + Ru_kx[2]) / 2.0;
                                //Ru_dy[i] = Ru_y0 + (Ru_ky[0] + Ru_ky[1] + Ru_ky[2]) / 2.0;
                                dnt = dt + dh;
                                Ru_r0 = Math.sqrt(Ru_x0 * Ru_x0 + Ru_y0 * Ru_y0);
                                Ru_u0 = FNF(dh, Ru_x0, Ru_y0) / Ru_r0;
                                Ru_v0 = FNG(dh, Ru_x0, Ru_y0) / Ru_r0;
                                Ru_dq = Math.sqrt(Ru_u0 * Ru_u0 + Ru_v0 * Ru_v0);

                                Ru_u1 = Ru_x0 + 0.5 * Ru_u0 * dh;// Ru_hq;
                                Ru_v1 = Ru_y0 + 0.5 * Ru_v0 * dh;// Ru_hq;
                                Ru_r1 = Math.sqrt(Ru_u1 * Ru_u1 + Ru_v1 * Ru_v1);
                                Ru_x1 = FNF(dh, Ru_u1, Ru_v1) / Ru_r1;
                                Ru_y1 = FNG(dh, Ru_u1, Ru_v1) / Ru_r1;
                                Ru_dx[i] = Ru_x0 + Ru_x1 * dh;// Ru_hq;
                                Ru_dy[i] = Ru_y0 + Ru_y1 * dh;// Ru_hq;
                                if (Math.abs(Ru_dx[i]) > Math.abs(width0) || Math.abs(Ru_dy[i]) > Math.abs(height0)) {
                                    //ovrRangeFlg = 1;
                                    //break;
                                    continue;
                                }
                                //if (Math.sqrt(Math.pow(Ru_dx[i] - Ru_x0, 2.0) + Math.pow(Ru_dy[i] - Ru_y0, 2.0)) < eps / 10.0) {  // 20230904 epsが0.01は小さすぎるか？
                                if (Math.sqrt(Math.pow(Ru_dx[i] - Ru_x0, 2) + Math.pow(Ru_dy[i] - Ru_y0, 2)) < Math.abs(width0) / 10000) {
                                    //ovrRangeFlg = 1;
                                    //break;
                                    //continue;
                                }

                                break;

                            case 2:
                                ///////////////////
                                //               //
                                // Runge-Kutta法 //
                                //               //
                                ///////////////////

                                Ru_kx[0] = dh * FNF(dt, Ru_x0, Ru_y0);
                                Ru_ky[0] = dh * FNG(dt, Ru_x0, Ru_y0);
                                Ru_kx[1] = dh * FNF(dt + dh / 2.0, Ru_x0 + Ru_kx[0] / 2.0, Ru_y0 + Ru_ky[0] / 2.0);
                                Ru_ky[1] = dh * FNG(dt + dh / 2.0, Ru_x0 + Ru_kx[0] / 2.0, Ru_y0 + Ru_ky[0] / 2.0);
                                Ru_kx[2] = dh * FNF(dt + dh / 2.0, Ru_x0 + Ru_kx[1] / 2.0, Ru_y0 + Ru_ky[1] / 2.0);
                                Ru_ky[2] = dh * FNG(dt + dh / 2.0, Ru_x0 + Ru_kx[1] / 2.0, Ru_y0 + Ru_ky[1] / 2.0);
                                Ru_kx[3] = dh * FNF(dt + dh, Ru_x0 + Ru_kx[2], Ru_y0 + Ru_ky[2]);
                                Ru_ky[3] = dh * FNG(dt + dh, Ru_x0 + Ru_kx[2], Ru_y0 + Ru_ky[2]);

                                if (Math.abs(Ru_x0) > Math.abs(width0) || Math.abs(Ru_y0) > Math.abs(height0)) {
                                    continue;
                                }

                                if (Math.abs(Ru_kx[3]) > max || Math.abs(Ru_ky[3]) > max) {
                                    //ovrRangeFlg = 1;
                                    //break;
                                    continue;
                                }

                                Ru_dx[i] = Ru_x0 + (Ru_kx[0] + 2.0 * Ru_kx[1] + 2.0 * Ru_kx[2] + Ru_kx[3]) / 6.0;
                                Ru_dy[i] = Ru_y0 + (Ru_ky[0] + 2.0 * Ru_ky[1] + 2.0 * Ru_ky[2] + Ru_ky[3]) / 6.0;
                                dnt = dt + dh;

                                if (Math.abs(Ru_dx[i]) > Math.abs(width0) || Math.abs(Ru_dy[i]) > Math.abs(height0)) {
                                    //ovrRangeFlg = 1;
                                    //break;
                                    continue;
                                }
                                //if (Math.sqrt(Math.pow(Ru_dx[i] - Ru_x0, 2.0) + Math.pow(Ru_dy[i] - Ru_y0, 2.0)) < eps / 10.0) {  // 20230904 epsが0.01は小さすぎるか？
                                if (Math.sqrt(Math.pow(Ru_dx[i] - Ru_x0, 2) + Math.pow(Ru_dy[i] - Ru_y0, 2)) < Math.abs(width0) / 10000) {
                                    //ovrRangeFlg = 1;
                                    //break;
                                    //continue;
                                }
                                break;

                            default:
                                break;
                        }

//                        const y = a * x * x + b;
                        pixelX = scaleX * (Ru_dx[i] + width0 / 2);
                        pixelY = scaleY * (height0 / 2 - Ru_dy[i]);

                        if (k == 0) {
                            linePoints[i].push({ x: pixelX, y: pixelY });
                        }
                        else {
                            linePoints2[i].push({ x: pixelX, y: pixelY });
                        }

                        // Draw the lines
                        if (k == 0) {
                            ctx.beginPath();
                            ctx.moveTo(linePoints[i][0].x, linePoints[i][0].y);
                            for (const point of linePoints[i]) {
                                ctx.lineTo(point.x, point.y);
                            }
                            ctx.strokeStyle = 'rgb(100, 149, 237)';
                            ctx.stroke();
                        }
                        else {
                            ctx.beginPath();
                            ctx.moveTo(linePoints2[i][0].x, linePoints2[i][0].y);
                            for (const point of linePoints2[i]) {
                                ctx.lineTo(point.x, point.y);
                            }
                            ctx.strokeStyle = 'rgb(200, 200, 55)';
                            ctx.stroke();
                        }

//                        if (dp % baisoku == 0) // 倍速設定  ここで描画ステップを定義することができる 20230904
                        if (dp % 20 == 0) { // 倍速設定
                            await new Promise(resolve => setTimeout(resolve, 0)); // Wait for 10 milliseconds
                        }
                    }
                }
            }
            for (let i = 0; i < 64; i++) {
                // Draw the point
                pixelX = scaleX * (Ru_dx_init[i] + width0 / 2);
                pixelY = scaleY * (height0 / 2 - Ru_dy_init[i]);
                ctx.beginPath();
                ctx.arc(pixelX, pixelY, 2, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
            }
            // 描画後に使用可とするコントロール
            usability(true);
        }

        // コントロールの使用可否 : 描画中, それ以外の場合
        function usability(flg)
        {
            // 使用可否属性がdisabledしかないので、trueとfalseが逆になる
            if (flg == true) {
                flg = false;
            }
            else {
                flg = true;
            }
            document.getElementById('type').disabled = flg;
                if (ma_used == 1) {
                    document.getElementById('ma').disabled = flg;
                }
                else {
                    document.getElementById('ma').disabled = true;
                    }
                if (mb_used == 1) {
                    document.getElementById('mb').disabled = flg;
                }
                else {
                    document.getElementById('mb').disabled = true;
                }
                if (mc_used == 1) {
                    document.getElementById('mc').disabled = flg;
                }
                else {
                    document.getElementById('mc').disabled = true;
                }
                if (md_used == 1) {
                    document.getElementById('md').disabled = flg;
                }
                else {
                    document.getElementById('md').disabled = true;
                }
                if (me_used == 1) {
                    document.getElementById('me').disabled = flg;
                }
                else {
                    document.getElementById('me').disabled = true;
                }
                if (mf_used == 1) {
                    document.getElementById('mf').disabled = flg;
                }
                else {
                    document.getElementById('mf').disabled = true;
                }
                if (mg_used == 1) {
                    document.getElementById('mg').disabled = flg;
                }
                else {
                    document.getElementById('mg').disabled = true;
                }
                if (mh_used == 1) {
                    document.getElementById('mh').disabled = flg;
                }
                else {
                    document.getElementById('mh').disabled = true;
                }
            document.getElementById('width0').disabled = flg;
            document.getElementById('dh').disabled = flg;
            document.getElementById('cnt_dp').disabled = flg;
            document.getElementById('start').disabled = flg;
        }

        function startAnimation() {
            ma = parseFloat(document.getElementById('ma').value);
            mb = parseFloat(document.getElementById('mb').value);
            mc = parseFloat(document.getElementById('mc').value);
            md = parseFloat(document.getElementById('md').value);
            me = parseFloat(document.getElementById('me').value);
            mf = parseFloat(document.getElementById('mf').value);
            mg = parseFloat(document.getElementById('mg').value);
            mh = parseFloat(document.getElementById('mh').value);
            dh = parseFloat(document.getElementById('dh').value);
            width0 = parseFloat(document.getElementById('width0').value) || width0;
            height0 = parseFloat(document.getElementById('width0').value) || width0;
            cnt_dp = parseInt(document.getElementById('cnt_dp').value) || width0;

            // 固有値を求める
            // ラベルを一度非表示にする
            document.getElementById('lambda').style.visibility ="hidden";
            document.getElementById('KAI1').style.visibility ="hidden";
            document.getElementById('pm').style.visibility ="hidden";
            document.getElementById('KAI2').style.visibility ="hidden";

            // 以下はtype = 1 の場合のみ実行
            if (dat == 1) {

                document.getElementById('lambda').style.visibility ="visible";

                // 判別式
                const han = (ma + md) * (ma + md) - 4 * (ma * md - mb * mc);
                const han2 = ma + md;
                // 解を求める
                let kaiA = ((ma + md) - Math.sqrt(han)) / 2;
                let kaiB = Math.sqrt(Math.abs(han)) / 2;
                // 重根
                if (han == 0) {
                    document.getElementById('KAI1').innerText = kaiA;
                    document.getElementById('KAI1').style.visibility ="visible";
                }
                if (han > 0) {
                    kaiA = (ma + md) / 2;
                        document.getElementById('pm').style.visibility ="visible";
                        document.getElementById('KAI1').innerText = kaiA;
                        document.getElementById('KAI2').innerText = kaiB;
                        document.getElementById('KAI1').style.visibility ="visible";
                        document.getElementById('KAI2').style.visibility ="visible";
                }
                if (han < 0) {
                    // 純虚数根
                    if (han2 == 0) {
                        document.getElementById('pm').style.visibility ="visible";
                        document.getElementById('KAI2').innerText = String(kaiB) + "i";
                        document.getElementById('KAI2').style.visibility ="visible";
                    }
                    else {
                    // 実部と虚部を持つ根
                        kaiA = (ma + md) / 2;
                        document.getElementById('pm').style.visibility ="visible";
                        document.getElementById('KAI1').innerText = kaiA;
                        document.getElementById('KAI2').innerText = String(kaiB) + "i";
                        document.getElementById('KAI1').style.visibility ="visible";
                        document.getElementById('KAI2').style.visibility ="visible";
                    }
                }
            }
            // 描画領域をリセット
            ctx.fillStyle = 'rgb( 0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animateGraph();
        }

        function updateRange() {
            const width0 = parseFloat(document.getElementById('width0').value);
            const wmax = width0 / 2;
            const wmin = -wmax;
            document.getElementById('wmax').innerText = wmax;
            document.getElementById('wmin').innerText = wmin;
        }

        function setRange() {
            document.getElementById('width0').value = 8;
            document.getElementById('cnt_dp').value = 320;
            document.getElementById('dh').value = 0.01;
            updateRange();
        }

        // 計算モード指定
        function changeMode() {
            const calc = String(document.getElementById('mode').value);
            switch (calc) {
                case "1":  // Euler法
                    mode = 0;
                    break;
                case "2":  // 修正Euler法
                    mode = 1;
                    break;
                case "3":  // Runge-Kutta法
                    mode = 2;
                    break;
                default:
                    break;
            }
        }

        function changeType() {
            const type = String(document.getElementById('type').value);
            const typeAry = type.split('&');

            const selectMode = document.getElementById('mode');

            switch (typeAry[0]) {
                case "01":  // 2次元1次線形自励系
                    selectMode.selectedIndex = 2;
                    dat = 1;
                    switch (typeAry[1]) {
                        case "01":  // 固有値の1つが0の場合
                            changeProperty(0);
                            document.getElementById('ma').value = 1;
                            document.getElementById('mb').value = 1;
                            document.getElementById('mc').value = 2;
                            document.getElementById('md').value = 2;
                            setRange();
                            break;
                        case "02":  // λ1 < 0 < λ2 (鞍状点)
                            changeProperty(0);
                            document.getElementById('ma').value = -2;
                            document.getElementById('mb').value = 2;
                            document.getElementById('mc').value = -2;
                            document.getElementById('md').value = 3;
                            setRange();
                            break;
                        case "03":  // 0 < λ1 < λ2 (不安定結節点)
                            changeProperty(0);
                            document.getElementById('ma').value = 1;
                            document.getElementById('mb').value = 0;
                            document.getElementById('mc').value = 3;
                            document.getElementById('md').value = 2;
                            setRange();
                            break;
                        case "04":  // 0 < λ1 < λ2 (1)
                            changeProperty(0);
                            document.getElementById('ma').value = 1;
                            document.getElementById('mb').value = 0;
                            document.getElementById('mc').value = 0;
                            document.getElementById('md').value = 2;
                            setRange();
                            break;
                        case "05":  // λ1 < λ2 < 0 (安定結節点)
                            changeProperty(0);
                            document.getElementById('ma').value = -4;
                            document.getElementById('mb').value = -3;
                            document.getElementById('mc').value = 2;
                            document.getElementById('md').value = -11;
                            setRange();
                            break;
                        case "06":  // 重複する固有値  > 0 かつ 行列Aが対角化可能の場合 (不安定退化結節点)
                            changeProperty(0);
                            document.getElementById('ma').value = 2;
                            document.getElementById('mb').value = 0;
                            document.getElementById('mc').value = 0;
                            document.getElementById('md').value = 2;
                            setRange();
                            break;
                        case "07":  // 固有値 λが重根で、行列Aが対角化不可能な場合
                            changeProperty(0);
                            document.getElementById('ma').value = 2;
                            document.getElementById('mb').value = 1;
                            document.getElementById('mc').value = 0;
                            document.getElementById('md').value = 2;
                            setRange();
                            break;
                        case "08":  // 固有値 λが純虚数の場合
                            changeProperty(0);
                            document.getElementById('ma').value = 1;
                            document.getElementById('mb').value = 2;
                            document.getElementById('mc').value = -1;
                            document.getElementById('md').value = -1;
                            setRange();
                            break;
                        case "09":  // 固有値 λが実部と虚部を持つ場合
                            changeProperty(0);
                            document.getElementById('ma').value = -1;
                            document.getElementById('mb').value = -1;
                            document.getElementById('mc').value = 2;
                            document.getElementById('md').value = -1;
                            setRange();
                            break;
                        defaut:
                            break;
                    }
                    document.getElementById('ma').disabled = false;
                    document.getElementById('mb').disabled = false;
                    document.getElementById('mc').disabled = false;
                    document.getElementById('md').disabled = false;
                    ma_used = 1;
                    mb_used = 1;
                    mc_used = 1;
                    md_used = 1;
                    // ラベル「固有値」を表示する
                    document.getElementById('koyu').innerText = "固有値";
                    // 式を表示する
                    document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = ax + by \\]";
                    document.getElementById('dy').innerText = "\\[ \\frac{dy}{dt} = cx + dy \\]";
                    break;
                case "02":  // 2次元2次線形自励系
                    selectMode.selectedIndex = 2;
                    dat = 2;
                    switch (typeAry[1]) {
                        case "01":  // 結節峠点型
                            changeProperty(0);
                            document.getElementById('ma').value = 1;
                            document.getElementById('mb').value = 0;
                            document.getElementById('mc').value = 0;
                            document.getElementById('md').value = 2;
                            document.getElementById('me').value = -4;
                            document.getElementById('mf').value = 2;
                            setRange();
                            document.getElementById('cnt_dp').value = 1280;
                            break;
                        case "02":  // 退化結節峠点型
                            changeProperty(0);
                            document.getElementById('ma').value = 4;
                            document.getElementById('mb').value = 0;
                            document.getElementById('mc').value = 0;
                            document.getElementById('md').value = 1;
                            document.getElementById('me').value = 0;
                            document.getElementById('mf').value = 4;
                            setRange();
                            document.getElementById('cnt_dp').value = 1280;
                            document.getElementById('dh').value = 0.004;
                            break;
                        case "03":  // 双楕円型
                            changeProperty(0);
                            document.getElementById('ma').value = -1;
                            document.getElementById('mb').value = 0;
                            document.getElementById('mc').value = 1;
                            document.getElementById('md').value = 0;
                            document.getElementById('me').value = -2;
                            document.getElementById('mf').value = 0;
                            setRange();
                            break;
                        case "04":  // 3峠型
                            changeProperty(0);
                            document.getElementById('ma').value = 1;
                            document.getElementById('mb').value = 0;
                            document.getElementById('mc').value = -1;
                            document.getElementById('md').value = 0;
                            document.getElementById('me').value = -2;
                            document.getElementById('mf').value = 0;
                            setRange();
                            break;
                        case "05":  // 退化結節峠点型
                            changeProperty(0);
                            document.getElementById('ma').value = -1;
                            document.getElementById('mb').value = 0;
                            document.getElementById('mc').value = 0;
                            document.getElementById('md').value = 0;
                            document.getElementById('me').value = 0;
                            document.getElementById('mf').value = 1;
                            setRange();
                            break;
                        case "06":  // 放物型角領域
                            changeProperty(0);
                            document.getElementById('ma').value = 0;
                            document.getElementById('mb').value = 0;
                            document.getElementById('mc').value = -1;
                            document.getElementById('md').value = 1;
                            document.getElementById('me').value = 0;
                            document.getElementById('mf').value = 0;
                            setRange();
                            document.getElementById('cnt_dp').value = 1280;
                            break;
                        defaut:
                            break;
                    }
                    document.getElementById('ma').disabled = false;
                    document.getElementById('mb').disabled = false;
                    document.getElementById('mc').disabled = false;
                    document.getElementById('md').disabled = false;
                    document.getElementById('me').disabled = false;
                    document.getElementById('mf').disabled = false;
                    document.getElementById('mg').disabled = true;
                    document.getElementById('mh').disabled = true;
                    ma_used = 1;
                    mb_used = 1;
                    mc_used = 1;
                    md_used = 1;
                    me_used = 1;
                    mf_used = 1;
                    // ラベル「固有値」は非表示にする
                    document.getElementById('koyu').innerText = "";
                    // 式を表示する
                    document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = ax^2 + bxy + cy^2 \\]";
                    document.getElementById('dy').innerText = "\\[ \\frac{dy}{dt} = dx^2 + exy + fy^2 \\]";
                    break;

                case "03":  // 高次の自励系
                    selectMode.selectedIndex = 2;
                    switch (typeAry[1]) {
                        case "01":  // 周期解を持つ同次自励形
                            dat = 31;
                            changeProperty(0);
                            // 式を表示する
                            document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = -y^3 \\]";
                            document.getElementById('dy').innerText = "\\[ \\frac{dy}{dt} = x^3 \\]";
                            setRange();
                            break;
                        case "02":  // 8つの放物型角領域を持つ同次自励形
                            dat = 32;
                            changeProperty(0);
                            // 式を表示する
                            document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = x^3 \\]";
                            document.getElementById('dy').innerText = "\\[ \\frac{dy}{dt} = y^3 \\]";
                            //document.getElementById('width0').value = 32;
                            document.getElementById('cnt_dp').value = 1280;
                            //document.getElementById('dh').value = 0.001;
                            //updateRange();
                            selectMode.selectedIndex = 0;
                            break;
                        case "03":  // 複合角領域を持つ同次自励形
                            dat = 33;
                            changeProperty(0);
                            // 式を表示する
                            document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = x^2(y - x) \\]";
                            document.getElementById('dy').innerText = "\\[ \\frac{dy}{dt} = y^2(y - 2x) \\]";
                            setRange();
                            //document.getElementById('width0').value = 64;
                            document.getElementById('cnt_dp').value = 1280;
                            //document.getElementById('dh').value = 0.00005;
                            //updateRange();
                            selectMode.selectedIndex = 1;
                            break;
                        case "04":  // Vinograd(ヴィノグラード)の自励形
                            dat = 34;
                            changeProperty(0);
                            // 式を表示する
                            document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = x^2(y - x) + y^5 \\]";
                            document.getElementById('dy').innerText = "\\[ \\frac{dy}{dt} = y^2(y - 2x) \\]";
                            setRange();
                            document.getElementById('width0').value = 4;
                            document.getElementById('cnt_dp').value = 1280;
                            document.getElementById('dh').value = 0.01;
                            updateRange();
                            break;
                        defaut:
                            break;
                    }
                    // ラベル「固有値」は非表示にする
                    document.getElementById('koyu').innerText = "";
                    break;
                case "04":  // 非線形の自励系
                    selectMode.selectedIndex = 2;
                    switch (typeAry[1]) {
                        case "01":  // その1
                            dat = 41;
                            changeProperty(0);
                            // 式を表示する
                            document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = y \\]";
                            document.getElementById('dy').innerText = "\\[ \\frac{dy}{dt} = \sin x + y^3 \\]";
                            setRange();
                            document.getElementById('cnt_dp').value = 1280;
                            document.getElementById('dh').value = 0.01;
                            break;
                        defaut:
                            break;
                    }
                    // ラベル「固有値」は非表示にする
                    document.getElementById('koyu').innerText = "";
                    break;
            }

            // 固有値
            // ラベルを一度非表示にする
            document.getElementById('lambda').style.visibility ="hidden";
            document.getElementById('KAI1').style.visibility ="hidden";
            document.getElementById('pm').style.visibility ="hidden";
            document.getElementById('KAI2').style.visibility ="hidden";

            // 他の処理が終わった後にMathJaxを再度実行する
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

        }

        function changeProperty(flg) {
                ma_used = 0;
                mb_used = 0;
                mc_used = 0;
                md_used = 0;
                me_used = 0;
                mf_used = 0;
                mg_used = 0;
                mh_used = 0;
                document.getElementById('ma').value = "";
                document.getElementById('mb').value = "";
                document.getElementById('mc').value = "";
                document.getElementById('md').value = "";
                document.getElementById('me').value = "";
                document.getElementById('mf').value = "";
                document.getElementById('mg').value = "";
                document.getElementById('mh').value = "";
                if (flg == 0) {
                    document.getElementById('ma').disabled = true;
                    document.getElementById('mb').disabled = true;
                    document.getElementById('mc').disabled = true;
                    document.getElementById('md').disabled = true;
                    document.getElementById('me').disabled = true;
                    document.getElementById('mf').disabled = true;
                    document.getElementById('mg').disabled = true;
                    document.getElementById('mh').disabled = true;
                }
                else {
                    document.getElementById('ma').disabled = false;
                    document.getElementById('mb').disabled = false;
                    document.getElementById('mc').disabled = false;
                    document.getElementById('md').disabled = false;
                    document.getElementById('me').disabled = false;
                    document.getElementById('mf').disabled = false;
                    document.getElementById('mg').disabled = false;
                }
        }

        function FNF(dt, x, y) {
            let FNF;
            switch (dat)
            {
                case 1:
                    FNF = ma * x + mb * y;
                    return FNF;
                case 2:
                    FNF = ma * x * x + mb * x * y + mc * y * y;
                    return FNF;
                case 31:
                    FNF = -y * y * y;
                    return FNF;
                case 32:
                    FNF = x * x * x;
                    return FNF;
                case 33:
                    FNF = x * x * (y - x);
                    return FNF;
                case 34:
                    FNF = x * x * (y - x) + Math.pow(y, 5);
                    return FNF;
                case 41:
                    FNF = y;
                    return FNF;
                default:
                    break;
            }
            return 0.0;
        }
        function FNG(dt, x, y) {
            let FNG;
            switch (dat)
            {
                case 1:
                    FNG = mc * x + md * y;
                    return FNG;
                case 2:
                    FNG = md * x * x + me * x * y + mf * y * y;
                    return FNG;
                case 31:
                    FNG = x * x * x;
                    return FNG;
                case 32:
                    FNG = y * y * y;
                    return FNG;
                case 33:
                    FNG = y * y * (y - 2 * x);
                    return FNG;
                case 34:
                    FNG = y * y * (y - 2 * x);
                    return FNG;
                case 41:
                    FNG = Math.sin(x) + Math.pow(y, 2);
                    return FNG;
                default:
                    break;
            }
            return 0.0;
        }
