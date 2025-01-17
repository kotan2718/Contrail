        // Gloavbl 変数 //
        let max = 99999;
        let eps = 0.01;
        let dat = 1;
        let ma;
        let mb;
        let mc;
        let md;
        let me;
        let mf;
        let mg;
        let mh;
        cnt_dp = 3200;
        dh = 0.01;

        let mode = 2;

        let m_alpha = -20.0;   // X軸が基線と成す角
        let m_gamma = -30.0;   // 基線にもっとも近い矩形の頂点を視点Eから仰ぐ角度

        let m_ca = 0.0;        // m_alphaのcosとsinの値を格納する変数
        let m_sa = 0.0;

        let m_zfctr = 0.75;       // 図形座標にスケール変換するときにz方向を縮めるための比率(0.75位が丁度良い)
        let m_zc;                 // 図形座標上の原点(X0, Y0, Z0)に対応する透視座標の原点(ξ0、η0)のξ0
        let m_zm;                 // 図形座標上の原点(X0, Y0, Z0)に対応する透視座標の原点(ξ0、η0)のη0
        let m_el, m_et;           // 図形座標から透視座標へ投影処理を制御する変数

        let m_RRX = 0.0, m_RRZ = 0.0;  // ピクチャーボックスの原点

        let m_dHV;               // 図形座標の点(X, Y, Z)を透視座標に変換するときZの値を入れておく変数

        let m_gamma90Flg = 0;    // 20230927 描画のmappingでgammaが +/-90 ではどうしてもうまく処理できないので、89で描画を代用する Axis()でこのフラグが1ならばz軸を描画しない
        let mappingFlg;          // 20231002 updpen2, 3で予め角度を指定するときはmapping()の呼び出しを抑制する

        let vAx = 3;             // 20231010 vertical Axis(1 : x軸, 2 : y軸, 3 : z軸 ==default==)

        //////////////////

        let width0 = 100;
        let height0 = 100;
        const canvas = document.getElementById('graphCanvas');
        const ctx = canvas.getContext('2d');

        // 描画領域をリセット
        ctx.fillStyle = 'rgb( 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        async function animateGraph() {
            // スケーリング
            let scaleX = canvas.width / width0;
            let scaleY = canvas.height / height0;

            let linePoints = [];
            //let linePoints2 = [];
            // 64個の配列を初期化
            for (let i = 0; i < 2; i++) {
                linePoints.push([]);
                //linePoints2.push([]);
            }

//            var dh = Math.sqrt(Math.pow((width0 / canvas.width), 2) + Math.pow((height0 / canvas.height), 2));
            let dt = 0.0;
            let dnt = 0.0;

            // Runge-Kutta法
            let Ru_dx = new Array(2);
            let Ru_dy = new Array(2);
            let Ru_dz = new Array(2);
//            let Ru_dx_init = new Array(2);
//            let Ru_dy_init = new Array(2);
            let Ru_x0 = 0.0;
            let Ru_y0 = 0.0;
            let Ru_z0 = 0.0;
//            var Ru_x0_init = new Array(16);   // 第1象限 初期値格納位置
//            var Ru_y0_init = new Array(16);
            let Ru_kx = new Array(4);
            let Ru_ky = new Array(4);
            let Ru_kz = new Array(4);

            let Ru_r0;
            let Ru_x1;
            let Ru_y1;
            let Ru_z1;
            let Ru_r1;
            let Ru_u0;
            let Ru_v0;
            let Ru_w0;
            let Ru_u1;
            let Ru_v1;
            let Ru_w1;

            let Ru_hq;
            let Ru_dq;
            let pixelX;
            let pixelY;

            let vx1 = 0.0, vy1 = 0.0, vz1 = 0.0, vx2 = 0.0, vy2 = 0.0, vz2 = 0.0;

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

//            for (let k = 0; k < 2; k++) {
            //// for debug start
            Ru_dx[0] = 0.0;
            Ru_dy[0] = 1.0;
            Ru_dz[0] = 2.0;
            //// for debug   end

            //if (k == 1) {
            //    dh = -dh;
            //}

            for (dp = 1; dp <= cnt_dp; dp++) {
                for (let i = 0; i < 2; i++) {

                    Ru_x0 = Ru_dx[i];
                    Ru_y0 = Ru_dy[i];
                    Ru_z0 = Ru_dz[i];
                    dt = dnt;

                    if (dp == 1) {
                        pixelX = scaleX * (Ru_dx[i] + width0 / 2);
                        pixelY = scaleY * (height0 / 2 - Ru_dy[i]);
                        linePoints[i].push({ x: pixelX, y: pixelY });
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
                            Ru_r0 = Math.sqrt(Ru_x0 * Ru_x0 + Ru_y0 * Ru_y0 + Ru_z0 * Ru_z0);
                            Ru_u0 = FNF(dh, Ru_x0, Ru_y0, Ru_z0) / Ru_r0;
                            Ru_v0 = FNG(dh, Ru_x0, Ru_y0, Ru_z0) / Ru_r0;
                            Ru_w0 = FNH(dh, Ru_x0, Ru_y0, Ru_z0) / Ru_r0;
                            Ru_dq = Math.sqrt(Ru_u0 * Ru_u0 + Ru_v0 * Ru_v0 + Ru_w0 * Ru_w0);
                            //Ru_dx[i] = Ru_x0 + FNF(dh, Ru_x0, Ru_y0) * dh;
                            //Ru_dy[i] = Ru_y0 + FNG(dh, Ru_x0, Ru_y0) * dh;
//                              //  Ru_dy[i] = Ru_y0 + FNG(dt, Ru_dx[i], Ru_y0) * dh;   // これありかなぁ？
                            //Ru_dx[i] = Ru_x0 + Ru_u * dh / Ru_q;
                            //Ru_dy[i] = Ru_y0 + Ru_v * dh / Ru_q;
                            Ru_dx[i] = Ru_x0 + Ru_u0 * dh;
                            Ru_dy[i] = Ru_y0 + Ru_v0 * dh;
                            Ru_dz[i] = Ru_z0 + Ru_w0 * dh;
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
                            Ru_r0 = Math.sqrt(Ru_x0 * Ru_x0 + Ru_y0 * Ru_y0 + Ru_z0 * Ru_z0);
                            Ru_u0 = FNF(dh, Ru_x0, Ru_y0, Ru_z0) / Ru_r0;
                            Ru_v0 = FNG(dh, Ru_x0, Ru_y0, Ru_z0) / Ru_r0;
                            Ru_v0 = FNH(dh, Ru_x0, Ru_y0, Ru_z0) / Ru_r0;
                            Ru_dq = Math.sqrt(Ru_u0 * Ru_u0 + Ru_v0 * Ru_v0 + Ru_w0 * Ru_w0);

                            Ru_u1 = Ru_x0 + 0.5 * Ru_u0 * dh;// Ru_hq;
                            Ru_v1 = Ru_y0 + 0.5 * Ru_v0 * dh;// Ru_hq;
                            Ru_w1 = Ru_z0 + 0.5 * Ru_w0 * dh;// Ru_hq;
                            Ru_r1 = Math.sqrt(Ru_u1 * Ru_u1 + Ru_v1 * Ru_v1 + Ru_w1 * Ru_w1);
                            Ru_x1 = FNF(dh, Ru_u1, Ru_v1, Ru_w1) / Ru_r1;
                            Ru_y1 = FNG(dh, Ru_u1, Ru_v1, Ru_w1) / Ru_r1;
                            Ru_z1 = FNH(dh, Ru_u1, Ru_v1, Ru_w1) / Ru_r1;
                            Ru_dx[i] = Ru_x0 + Ru_x1 * dh;// Ru_hq;
                            Ru_dy[i] = Ru_y0 + Ru_y1 * dh;// Ru_hq;
                            Ru_dz[i] = Ru_z0 + Ru_z1 * dh;// Ru_hq;
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

                            Ru_kx[0] = dh * FNF(dt, Ru_x0, Ru_y0, Ru_z0);
                            Ru_ky[0] = dh * FNG(dt, Ru_x0, Ru_y0, Ru_z0);
                            Ru_kz[0] = dh * FNH(dt, Ru_x0, Ru_y0, Ru_z0);
                            Ru_kx[1] = dh * FNF(dt + dh / 2.0, Ru_x0 + Ru_kx[0] / 2.0, Ru_y0 + Ru_ky[0] / 2.0, Ru_z0 + Ru_kz[0] / 2.0);
                            Ru_ky[1] = dh * FNG(dt + dh / 2.0, Ru_x0 + Ru_kx[0] / 2.0, Ru_y0 + Ru_ky[0] / 2.0, Ru_z0 + Ru_kz[0] / 2.0);
                            Ru_kz[1] = dh * FNG(dt + dh / 2.0, Ru_x0 + Ru_kx[0] / 2.0, Ru_y0 + Ru_ky[0] / 2.0, Ru_z0 + Ru_kz[0] / 2.0);
                            Ru_kx[2] = dh * FNF(dt + dh / 2.0, Ru_x0 + Ru_kx[1] / 2.0, Ru_y0 + Ru_ky[1] / 2.0, Ru_z0 + Ru_kz[1] / 2.0);
                            Ru_ky[2] = dh * FNG(dt + dh / 2.0, Ru_x0 + Ru_kx[1] / 2.0, Ru_y0 + Ru_ky[1] / 2.0, Ru_z0 + Ru_kz[1] / 2.0);
                            Ru_kz[2] = dh * FNG(dt + dh / 2.0, Ru_x0 + Ru_kx[1] / 2.0, Ru_y0 + Ru_ky[1] / 2.0, Ru_z0 + Ru_kz[1] / 2.0);
                            Ru_kx[3] = dh * FNF(dt + dh, Ru_x0 + Ru_kx[2], Ru_y0 + Ru_ky[2], Ru_z0 + Ru_kz[2]);
                            Ru_ky[3] = dh * FNG(dt + dh, Ru_x0 + Ru_kx[2], Ru_y0 + Ru_ky[2], Ru_z0 + Ru_kz[2]);
                            Ru_kz[3] = dh * FNG(dt + dh, Ru_x0 + Ru_kx[2], Ru_y0 + Ru_ky[2], Ru_z0 + Ru_kz[2]);

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
                            Ru_dz[i] = Ru_z0 + (Ru_kz[0] + 2.0 * Ru_kz[1] + 2.0 * Ru_kz[2] + Ru_kz[3]) / 6.0;
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

                    vx1 = 0.0; vy1 = 0.0; vz1 = 0.0; vx2 = 0.0; vy2 = 0.0; vz2 = 0.0;
                    R3D(Ru_x0, Ru_y0, Ru_z0, vx1, vy1, vz1);
                    R3D(Ru_dx[i], Ru_dy[i], Ru_dz[i], vx2, vy2, vz2);

//                    pixelX = scaleX * (vx2 + width0 / 2);
//                    pixelY = scaleY * (height0 / 2 - vy2);
                        pixelX = scaleX * (Ru_dx[i] + width0 / 2);
                        pixelY = scaleY * (height0 / 2 - Ru_dy[i]);

                    //if (k == 0) {
                    linePoints[i].push({ x: pixelX, y: pixelY });
                    //}
                    //else {
                    //    linePoints2[i].push({ x: pixelX, y: pixelY });
                    //}

                    // Draw the lines
                    //if (k == 0) {
                    ctx.beginPath();
                    ctx.moveTo(linePoints[i][0].x, linePoints[i][0].y);
                    for (const point of linePoints[i]) {
                        ctx.lineTo(point.x, point.y);
                    }
                    ctx.strokeStyle = 'rgb(100, 149, 237)';
                    ctx.stroke();
                    //}
                    //else {
                    //    ctx.beginPath();
                    //    ctx.moveTo(linePoints2[i][0].x, linePoints2[i][0].y);
                    //    for (const point of linePoints2[i]) {
                    //        ctx.lineTo(point.x, point.y);
                    //    }
                    //    ctx.strokeStyle = 'rgb(200, 200, 55)';
                    //    ctx.stroke();
                    //}

//                        if (dp % baisoku == 0) // 倍速設定  ここで描画ステップを定義することができる 20230904
                    if (dp % 20 == 0) { // 倍速設定
                        await new Promise(resolve => setTimeout(resolve, 0)); // Wait for 10 milliseconds
                    }
                }
            }
//            }
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
                            document.getElementById('ma').value = 10.0;
                            document.getElementById('mb').value = 28.0;
                            document.getElementById('mc').value = 8.0 / 3.0;
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
                    document.getElementById('md').disabled = true;
                    // ラベル「固有値」を表示する
                    document.getElementById('koyu').innerText = "固有値　";
                    // 式を表示する
                    document.getElementById('dx').innerText = "\\[ \\frac{dx}{dt} = ay - ax \\]";
                    document.getElementById('dy').innerText = "\\[ \\frac{dy}{dt} = bx - xz - y \\]";
                    document.getElementById('dz').innerText = "\\[ \\frac{dz}{dt} = xy - cz \\]";
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

        function FNF(dt, x, y, z) {
            let FNF;
            switch (dat)
            {
                case 1:
                    FNF = ma * y - ma * x;
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
        function FNG(dt, x, y, z) {
            let FNG;
            switch (dat)
            {
                case 1:
                    FNG = mb * x - x * z - y;
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
        function FNH(dt, x, y, z) {
            let FNH;
            switch (dat)
            {
                case 1:
                    FNH = x * y - mc * z;
                    return FNH;
                case 2:
                    FNH = 0;
                    return FNH;
                case 31:
                    FNH = 0;
                    return FNH;
                case 32:
                    FNH = 0;
                    return FNH;
                case 33:
                    FNH = 0;
                    return FNH;
                case 34:
                    FNH = 0;
                    return FNH;
                case 41:
                    FNH = 0;
                    return FNH;
                default:
                    break;
            }
            return 0.0;
        }
        // 描画に必要な定数を入力データから計算して用意する
        function prep()
        {
            let tau;             // 基線(画面)から図形座標の原点までの距離
            let tg;              // tangent gamma
            let zMin = -1.5;     // z方向描画領域の最小値

            m_el = 1000.0;  // 基線（画面）までの視距離
            tau  =   10.0;  // 矩形領域のうち基線に一番近い頂点から基線までの距離
            // *******************************
            m_et = m_el + tau;
            // *******************************

            // *******************************
            tg = Math.sin(Math.PI / 180.0 * m_gamma) / Math.cos(Math.PI / 180.0 * m_gamma);
            m_zc = m_et * tg - zMin * m_zfctr;
            m_zm = tg;
            // *******************************
        }

        // 座標変換で指定された角度で計算済みの解曲線を描画する
/*        function mapping()
        {
            prep();
            let haba;
//            Array.Resize(ref linePoints1, 0);
//            Array.Resize(ref linePoints2, 0);
            let vx1, vy1, vz1, vx2, vy2, vz2;
            // 描画領域をリセット
            ctx.fillStyle = 'rgb( 0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            Axis();

            if (drawnFlg == true && debugMode == false)
            {
                //for (int dp = 1; dp <= cnt_dp; dp++)
                for (let dp = 1; dp <= cnt_dp; dp = dp + 1)
                {
                    for (let i = 0; i < 2; i++)
                    {
                        if (i == 0)
                        {
                            vx1 = 0.0; vy1 = 0.0; vz1 = 0.0; vx2 = 0.0; vy2 = 0.0; vz2 = 0.0;
                            R3D(arr_x0[dp - 1], arr_y0[dp - 1], arr_z0[dp - 1], vx1, vy1, vz1);
                            R3D(arr_x0[dp], arr_y0[dp], arr_z0[dp], vx2, vy2, vz2);

                            haba = Math.sqrt(Math.pow(vx2 - vx1, 2.0) + Math.pow(vy2 - vy1, 2.0));

                            // Drawlineで線分が引ける閾値を下回る線分幅が含まれているか判定し、描画方法を振り分ける
//                            if (haba < 0.0006284)
//                            {
                                //if (linePoints1.Length == 0)
                                //{
                                //    Array.Resize(ref linePoints1, 1);
                                //    linePoints1[0] = new PointF((float)vx1, (float)vy1);
                                //}
                                ctx.beginPath();
                                ctx.moveTo(linePoints[i][0].x, linePoints[i][0].y);
                                for (const point of linePoints[i]) {
                                    ctx.lineTo(point.x, point.y);
                                }
                                ctx.strokeStyle = 'rgb(100, 149, 237)';
                                ctx.stroke();
//                            }
//                            else
//                            {
//                                graphGraphics.DrawLine(graphPen, (float)vx1, (float)vy1, (float)vx2, (float)vy2);
//                            }

                            
                            // これは遅すぎる
                            //if (linePoints1.Length == 0)
                            //{
                            //    Array.Resize(ref linePoints1, 1);
                            //    linePoints1[0] = new PointF((float)vx1, (float)vy1);
                            //}
                            //Array.Resize(ref linePoints1, linePoints1.Length + 1);
                            //linePoints1[linePoints1.Length - 1] = new PointF((float)vx2, (float)vy2);
                            //graphGraphics.DrawLines(graphPen, linePoints1);

                            //graphGraphics.DrawLine(graphPen, (float)vx1, (float)vy1, (float)vx2, (float)vy2);
                            
                            //graphGraphics.FillEllipse(pointBrush1a, (float)vx2 - mag * 0.2f, (float)vy2 - mag * 0.2f, mag * 0.5f, mag * 0.5f);
                            //graphGraphics.FillEllipse(pointBrush1a, (float)vx2 - mag * 0.1f, (float)vy2 - mag * 0.1f, mag * 0.1f, mag * 0.1f);
                        }
                        if (i == 1)
                        {
                            vx1 = 0.0f; vy1 = 0.0f; vz1 = 0.0f; vx2 = 0.0f; vy2 = 0.0f; vz2 = 0.0f;
                            R3D(arr_x1[dp - 1], arr_y1[dp - 1], arr_z1[dp - 1], vx1, ref vy1, ref vz1);
                            R3D(arr_x1[dp], arr_y1[dp], arr_z1[dp], vx2, ref vy2, ref vz2);

                            haba = Math.Sqrt(Math.pow(vx2 - vx1, 2.0) + Math.pow(vy2 - vy1, 2.0));

                            // Drawlineで線分が引ける閾値を下回る線分幅が含まれているか判定し、描画方法を振り分ける
//                            if (haba < 0.0006284)
//                            {
                                //if (linePoints2.Length == 0)
                                //{
                                //    Array.Resize(ref linePoints2, 1);
                                //    linePoints2[0] = new PointF((float)vx1, (float)vy1);
                                //}
                                ctx.beginPath();
                                ctx.moveTo(linePoints2[i][0].x, linePoints2[i][0].y);
                                for (const point of linePoints2[i]) {
                                    ctx.lineTo(point.x, point.y);
                                }
                                ctx.strokeStyle = 'rgb(200, 200, 55)';
                                ctx.stroke();
                            //}
                            //else 
                            //{
                            //    graphGraphics.DrawLine(graphPen, (float)vx1, (float)vy1, (float)vx2, (float)vy2);
                            //}


                                // これは遅すぎる
                                //if (linePoints2.Length == 0)
                                //{
                                //    Array.Resize(ref linePoints2, 1);
                                //    linePoints2[0] = new PointF((float)vx1, (float)vy1);
                                //}
                                //Array.Resize(ref linePoints2, linePoints2.Length + 1);
                                //linePoints2[linePoints2.Length - 1] = new PointF((float)vx2, (float)vy2);
                                //graphGraphics.DrawLines(graphPen, linePoints2);

                                //graphGraphics.DrawLine(graphPen, (float)vx1, (float)vy1, (float)vx2, (float)vy2);

                                //graphGraphics.FillEllipse(pointBrush2a, (float)vx2 - mag * 0.2f, (float)vy2 - mag * 0.2f, mag * 0.5f, mag * 0.5f);
                                //graphGraphics.FillEllipse(pointBrush2a, (float)vx2 - mag * 0.1f, (float)vy2 - mag * 0.1f, mag * 0.1f, mag * 0.1f);
                        }
                    }
                }
//                pictBox.Image = graphBitmap;
            }
            //CheckHenkan();
            //pictBox.Image = graphBitmap;  // for debug
        }
*/
        // 3Dデータ(計算値)を平面の画面に変換する
        function R3D(x, y, z, x3, y3, z3)
        {
/*        // 透視図描画で俯角/仰角の変更に対して、描画高さを一定にするための基準高さの定義
        // 各gamma角毎にPPlot()での(yMax - yMin)を求め、gamma角に対する描画領域高さを近似した
        // 5重指数減少関数で近似( これじゃぁ、単なる対処方法でしかない )
        const EXP_DEC_X0 =  0.0;
        const EXP_DEC_Y0 =  0.0;
        const EXP_DEC_A1 =  6.18893975111;
        const EXP_DEC_T1 = 42.4994092028;
        const EXP_DEC_A2 =  5.52820541383e-006;
        const EXP_DEC_T2 =  4.94077941896;
        const EXP_DEC_A3 = -3.25277800372e-008;
        const EXP_DEC_T3 =  4.02121236769;
        const EXP_DEC_A4 = -3.25277800372e-008;
        const EXP_DEC_T4 =  4.02121236769;
        const EXP_DEC_A5 =  5.70538289849e-023;
        const EXP_DEC_T5 =  1.55673261973;

        const PERS_BASE_HEIGHT = 12.538928450054133;

        let VVV;
        switch (vAx)
        {
            case 1:
                m_dHV = x;
                m_ca = Math.cos(Math.PI / 180.0 * m_alpha);
                m_sa = Math.sin(Math.PI / 180.0 * m_alpha);
                VVV = 1.0 / (z * m_sa + y * m_ca + m_et);

                z = (z * m_ca - y * m_sa) * VVV * m_el;
                x = ((m_dHV * m_zfctr + m_zc) * VVV - m_zm) * m_el;
                break;
            case 2:
                m_dHV = y;
                m_ca = Math.cos(Math.PI / 180.0 * m_alpha);
                m_sa = Math.sin(Math.PI / 180.0 * m_alpha);
                VVV = 1.0 / (z * m_sa + x * m_ca + m_et);

                x = (z * m_ca - x * m_sa) * VVV * m_el;
                y = ((m_dHV * m_zfctr + m_zc) * VVV - m_zm) * m_el;
                break;
            case 3:
                m_dHV = z;
                m_ca = Math.cos(Math.PI / 180.0 * m_alpha);
                m_sa = Math.sin(Math.PI / 180.0 * m_alpha);
                VVV = 1.0 / (x * m_sa + y * m_ca + m_et);

                x = (x * m_ca - y * m_sa) * VVV * m_el;
                z = ((m_dHV * m_zfctr + m_zc) * VVV - m_zm) * m_el;
                break;
            default:
                break;
        }

            let curtDeg = -(Math.abs(m_gamma));
            let curtHeight;

            if (Math.abs(m_gamma) == 89.0) {            // +/-89.0では近似式は使わず、固定値で拡大率を処理する
                curtHeight = 678.551409;
            }
            else if (Math.abs(m_gamma) == 90.0)         // +/-90.0では近似式は使わず、固定値で拡大率を処理する( 真上から見た図になる )
            {
                curtHeight = 1.38959E+16 / 1.9;
            }
            else if (Math.abs(m_gamma) >= 30.0) {        // 30°以上で描画が大きく歪むので、30～88に適用
                curtHeight = EXP_DEC_Y0 +
                    EXP_DEC_A1 * Math.exp(-(curtDeg - EXP_DEC_X0) / EXP_DEC_T1) +
                    EXP_DEC_A2 * Math.exp(-(curtDeg - EXP_DEC_X0) / EXP_DEC_T2) +
                    EXP_DEC_A3 * Math.exp(-(curtDeg - EXP_DEC_X0) / EXP_DEC_T3) +
                    EXP_DEC_A4 * Math.exp(-(curtDeg - EXP_DEC_X0) / EXP_DEC_T4) +
                    EXP_DEC_A5 * Math.exp(-(curtDeg - EXP_DEC_X0) / EXP_DEC_T5);
            }
            else {
                curtHeight = PERS_BASE_HEIGHT;
            }

            //  -------------plot-----------------
            switch (vAx)
            {
                case 1:
                    x3 = -m_RRX + z;
                    y3 = (-m_RRZ + x) * PERS_BASE_HEIGHT / curtHeight;
                    break;
                case 2:
                    x3 = -m_RRX + x;
                    y3 = (-m_RRZ + y) * PERS_BASE_HEIGHT / curtHeight;
                    break;
                case 3:
                    x3 = -m_RRX + x;
                    y3 = (-m_RRZ + z) * PERS_BASE_HEIGHT / curtHeight;
                    break;
                default:
                    break;
            }
            z3 = 0.0;

            // DrawLine Overflow 対策
            if (Math.abs(x3) > max || Math.abs(y3) > max)
            {
                msg(0, x3, y3, z3);
                // 座標系の回転で更にoverflowの可能性があり、その場合は無限ループになるので回転は不可とする
                rotateFlg = false;
            }
            // *********************************************************************
*/
        }

        // 座標軸の描画
/*        private void Axis()
        {
            graphPen.Color = Color.FromArgb(255, 255, 255);

            double vx1 = 0.0, vy1 = 0.0, vz1 = 0.0, vx2 = 0.0, vy2 = 0.0, vz2 = 0.0;
            //R3D(-width / 2.0, 0.0, 0.0, ref vx1, ref vy1, ref vz1);
            R3D(-width / 2.0, 0.0, 0.0, ref vx1, ref vy1, ref vz1);
            R3D( width / 2.0, 0.0, 0.0, ref vx2, ref vy2, ref vz2);
            graphGraphics.DrawLine(graphPen, (float)vx1, (float)vy1, (float)vx2, (float)vy2);   // x軸の描画
            label_xyz(1, vx2, vy2);   // 座標名(x)表示

            graphPen.Color = Color.FromArgb(255, 0, 0);
            vx1 = 0.0; vy1 = 0.0; vz1 = 0.0; vx2 = 0.0; vy2 = 0.0; vz2 = 0.0;
            R3D(0.0,  height / 2.0, 0.0, ref vx1, ref vy1, ref vz1);
            R3D(0.0, -height / 2.0, 0.0, ref vx2, ref vy2, ref vz2);
            graphGraphics.DrawLine(graphPen, (float)vx1, (float)vy1, (float)vx2, (float)vy2);   // y軸の描画
            label_xyz(2, vx2, vy2);   // 座標名(y)表示

            if (m_gamma90Flg == 0) {
                graphPen.Color = Color.FromArgb(0, 255, 0);
                //R3D(0.0, 0.0, -width / 2.0, ref vx1, ref vy1, ref vz1);
                R3D(0.0, 0.0, -width / 2.0, ref vx1, ref vy1, ref vz1);
                R3D(0.0, 0.0,  width / 2.0, ref vx2, ref vy2, ref vz2);
                graphGraphics.DrawLine(graphPen, (float)vx1, (float)vy1, (float)vx2, (float)vy2);   // z軸の描画
                label_xyz(3, vx2, vy2);   // 座標名(z)表示
            }
        }

        // 座標名(x y z)の描画
        private void label_xyz(int kbn, double x, double y)
        {
            double addLen = 1.0; ;  // (x, y)から座標の記号を書き込むために伸ばす距離
            double AxLen;           // 軸の長さ
            double xc;  // 座標軸の余弦
            double ys;  // 座標軸の正弦
            double addLenX;  // 座標を書き込むための x 方向の伸ばし量
            double addLenY;  // 座標を書き込むための y 方向の伸ばし量

            AxLen = Math.Sqrt(x * x + y * y);
            xc = x / AxLen;
            ys = y / AxLen;
            mag = (float)(width / magStd);
            addLenX = mag * addLen * xc;
            if (addLenX < 0.0) addLenX = addLenX * 2.0;
            addLenY = mag * addLen * ys;
            if (addLenY < 0.0) addLenY = addLenY * 2.0;
            switch (kbn)
            {
                case 1: // 文字"X"の描画
                    graphGraphics.DrawLine(graphPen, (float)(x + addLenX) + mag * 0.4f, (float)(y + addLenY) + mag * 0.4f,
                                                     (float)(x + addLenX) + mag * 1.2f, (float)(y + addLenY) - mag * 0.4f);
                    graphGraphics.DrawLine(graphPen, (float)(x + addLenX) + mag * 1.2f, (float)(y + addLenY) + mag * 0.4f,
                                                     (float)(x + addLenX) + mag * 0.4f, (float)(y + addLenY) - mag * 0.4f);
                    break;
                case 2: // 文字"Y"の描画
                    graphGraphics.DrawLine(graphPen, (float)(x + addLenX) + mag * 0.4f, (float)(y + addLenY) + mag * 0.4f,
                                                     (float)(x + addLenX) + mag * 0.8f, (float)(y + addLenY));
                    graphGraphics.DrawLine(graphPen, (float)(x + addLenX) + mag * 1.2f, (float)(y + addLenY) + mag * 0.4f,
                                                     (float)(x + addLenX) + mag * 0.4f, (float)(y + addLenY) - mag * 0.8f);
                    break;
                case 3: // 文字"Z"の描画
                    graphGraphics.DrawLine(graphPen, (float)(x + addLenX) + mag * 0.4f, (float)(y + addLenY) + mag * 0.4f,
                                                     (float)(x + addLenX) + mag * 1.2f, (float)(y + addLenY) + mag * 0.4f);
                    graphGraphics.DrawLine(graphPen, (float)(x + addLenX) + mag * 1.2f, (float)(y + addLenY) + mag * 0.4f,
                                                     (float)(x + addLenX) + mag * 0.4f, (float)(y + addLenY) - mag * 0.4f);
                    graphGraphics.DrawLine(graphPen, (float)(x + addLenX) + mag * 0.4f, (float)(y + addLenY) - mag * 0.4f,
                                                     (float)(x + addLenX) + mag * 1.2f, (float)(y + addLenY) - mag * 0.4f);
                    break;
                default:
                    break;
            }

        }
*/

