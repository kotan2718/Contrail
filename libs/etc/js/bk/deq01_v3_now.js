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
        
        let mag;
        const magStd = 80;

        const canvas = document.getElementById('graphCanvas');
        const ctx = canvas.getContext('2d');

        // 描画領域をリセット
        ctx.fillStyle = 'rgb( 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // スケーリング
        const scaleX = canvas.width / width0;
        const scaleY = canvas.height / height0;

        // 初期値
        var init1 = new Array(3);   // 初期値
        var init2 = new Array(3);
        init1[0] = 0;
        init1[1] = 1;
        init1[2] = 2;
        init2[0] = 0;
        init2[1] = 1;
        init2[2] = 2.01;

        let linePoints = [];


        async function animateGraph() {

            prep();

//            let linePoints = [];

            // 2つの初期点から解軌道を描くために、配列に要素をセットする
            for (let i = 0; i < 2; i++) {
                linePoints.push([]);
            }

            var dt = 0.0;
            var dnt = 0.0;

            // Runge-Kutta法
            var Ru_dx = new Array(64);
            var Ru_dy = new Array(64);
            var Ru_dz = new Array(2);
            var Ru_x0 = 0.0;
            var Ru_y0 = 0.0;
            var Ru_z0 = 0.0;
            var Ru_x0_init = new Array(2);   // 初期値
            var Ru_y0_init = new Array(2);
            var Ru_kx = new Array(4);
            var Ru_ky = new Array(4);
            var Ru_kz = new Array(4);

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
            let obj1 = {x3: vx1, y3: vy1, z3: vz1};
            let obj2 = {x3: vx2, y3: vy2, z3: vz2};

            // 3軸の描画
            Axis();

            //// for debug start
            Ru_dx[0] = init1[0];
            Ru_dy[0] = init1[1];
            Ru_dz[0] = init1[2];
            Ru_dx[1] = init2[0];
            Ru_dy[1] = init2[1];
            Ru_dz[1] = init2[2];
            //// for debug   end

            for (dp = 1; dp <= cnt_dp; dp++) {
                for (let i = 0; i < 2; i++) {

                    Ru_x0 = Ru_dx[i];
                    Ru_y0 = Ru_dy[i];
                    Ru_z0 = Ru_dz[i];

                    if (i % 2 == 0) { // 20231229 dtのカウントが2倍で効いていたバグを修正
                        dt = dnt;
                    }

                    if (dp == 1) {
                        R3D(Ru_x0, Ru_y0, Ru_z0, obj1);

                        pixelX = scaleX * (obj1.x + width0 / 2);
                        pixelY = scaleY * (height0 / 2 - obj1.y);
                        linePoints[i].push({ x: pixelX, y: pixelY });
                    }

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
                    Ru_kz[1] = dh * FNH(dt + dh / 2.0, Ru_x0 + Ru_kx[0] / 2.0, Ru_y0 + Ru_ky[0] / 2.0, Ru_z0 + Ru_kz[0] / 2.0);
                    Ru_kx[2] = dh * FNF(dt + dh / 2.0, Ru_x0 + Ru_kx[1] / 2.0, Ru_y0 + Ru_ky[1] / 2.0, Ru_z0 + Ru_kz[1] / 2.0);
                    Ru_ky[2] = dh * FNG(dt + dh / 2.0, Ru_x0 + Ru_kx[1] / 2.0, Ru_y0 + Ru_ky[1] / 2.0, Ru_z0 + Ru_kz[1] / 2.0);
                    Ru_kz[2] = dh * FNH(dt + dh / 2.0, Ru_x0 + Ru_kx[1] / 2.0, Ru_y0 + Ru_ky[1] / 2.0, Ru_z0 + Ru_kz[1] / 2.0);
                    Ru_kx[3] = dh * FNF(dt + dh, Ru_x0 + Ru_kx[2], Ru_y0 + Ru_ky[2], Ru_z0 + Ru_kz[2]);
                    Ru_ky[3] = dh * FNG(dt + dh, Ru_x0 + Ru_kx[2], Ru_y0 + Ru_ky[2], Ru_z0 + Ru_kz[2]);
                    Ru_kz[3] = dh * FNH(dt + dh, Ru_x0 + Ru_kx[2], Ru_y0 + Ru_ky[2], Ru_z0 + Ru_kz[2]);

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

                    if (i % 2 == 0)
                    {
                        dnt = dt + dh;
                    }

                    //////////
                    //      //
                    // 描画 //
                    //      //
                    //////////

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

                    Axis();

                    if (i == 0) {
                        R3D(Ru_dx[i], Ru_dy[i], Ru_dz[i], obj2);

                        pixelX = scaleX * (obj2.x3 + width0 / 2);
                        pixelY = scaleY * (height0 / 2 - obj2.y3);

                        linePoints[i].push({ x: pixelX, y: pixelY });

                        ctx.beginPath();
                        ctx.moveTo(linePoints[i][0].x, linePoints[i][0].y);
                        for (const point of linePoints[i]) {
                            ctx.lineTo(point.x, point.y);
                        }
                        ctx.strokeStyle = 'rgb(100, 149, 237)';
                        ctx.stroke();

                        // Draw the point
                        ctx.beginPath();
                        ctx.arc(pixelX, pixelY, 2, 0, 2 * Math.PI);
                        ctx.fillStyle = 'orange';
                        ctx.fill();
                    }

                    if (i == 1) {
                        R3D(Ru_dx[i], Ru_dy[i], Ru_dz[i], obj2);

                        pixelX = scaleX * (obj2.x3 + width0 / 2);
                        pixelY = scaleY * (height0 / 2 - obj2.y3);

                        linePoints[i].push({ x: pixelX, y: pixelY });

                        ctx.beginPath();
                        ctx.moveTo(linePoints[i][0].x, linePoints[i][0].y);
                        for (const point of linePoints[i]) {
                            ctx.lineTo(point.x, point.y);
                        }
                        ctx.strokeStyle = 'rgb(200, 200, 55)';
                        ctx.stroke();

                        // Draw the point
                        ctx.beginPath();
                        ctx.arc(pixelX, pixelY, 2, 0, 2 * Math.PI);
                        ctx.fillStyle = 'red';
                        ctx.fill();
                    }

                    if (dp % 100 == 0 || dp == cnt_dp - 1) // 描画リフレッシュステップ
                    {
                        if (dp != cnt_dp) {
                            // 描画領域をリセット
                            ctx.fillStyle = 'rgb( 0, 0, 0)';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                        }
                    }
//                        if (dp % baisoku == 0) // 倍速設定  ここで描画ステップを定義することができる 20230904
//                    if (dp % 1 == 0) { // 倍速設定
//                        await new Promise(resolve => setTimeout(resolve, 20)); // Wait for 10 milliseconds
//                    }
                    if (dp % 20 == 0) { // 倍速設定
                        await new Promise(resolve => setTimeout(resolve, 0)); // Wait for 10 milliseconds
                    }
                }
            }
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

        // 3Dデータ(計算値)を平面の画面に変換する
        function R3D(x, y, z, obj)
        {
        // 透視図描画で俯角/仰角の変更に対して、描画高さを一定にするための基準高さの定義
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
                    obj.x3 = -m_RRX + z;
                    obj.y3 = (-m_RRZ + x) * PERS_BASE_HEIGHT / curtHeight;
                    break;
                case 2:
                    obj.x3 = -m_RRX + x;
                    obj.y3 = (-m_RRZ + y) * PERS_BASE_HEIGHT / curtHeight;
                    break;
                case 3:
                    obj.x3 = -m_RRX + x;
                    obj.y3 = (-m_RRZ + z) * PERS_BASE_HEIGHT / curtHeight;
                    break;
                default:
                    break;
            }
            obj.z3 = 0.0;

            // DrawLine Overflow 対策
            if (Math.abs(obj.x3) > max || Math.abs(obj.y3) > max)
            {
                msg(0, obj.x3, obj.y3, obj.z3);
                // 座標系の回転で更にoverflowの可能性があり、その場合は無限ループになるので回転は不可とする
                rotateFlg = false;
            }
            // *********************************************************************

        }

        // 座標軸の描画
        function Axis()
        {
            // x軸の描画
            let vx1 = 0.0, vy1 = 0.0, vz1 = 0.0, vx2 = 0.0, vy2 = 0.0, vz2 = 0.0;
            let obj1 = {x3: vx1, y3: vy1, z3: vz1};
            let obj2 = {x3: vx2, y3: vy2, z3: vz2};
            R3D(-width0 / 2.0, 0.0, 0.0, obj1);
            pixelX1 = scaleX * (obj1.x3 + width0 / 2);
            pixelY1 = scaleY * (height0 / 2 - obj1.y3);
            R3D( width0 / 2.0, 0.0, 0.0, obj2);
            pixelX2 = scaleX * (obj2.x3 + width0 / 2);
            pixelY2 = scaleY * (height0 / 2 - obj2.y3);
            ctx.beginPath();
            ctx.moveTo(pixelX1, pixelY1);
            ctx.lineTo(pixelX2, pixelY2);
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            ctx.stroke();
            label_xyz(1, obj2.x3, obj2.y3);   // 座標名(x)表示

            // y軸の描画
            vx1 = 0.0, vy1 = 0.0, vz1 = 0.0, vx2 = 0.0, vy2 = 0.0, vz2 = 0.0;
            obj1 = {x3: vx1, y3: vy1, z3: vz1};
            obj2 = {x3: vx2, y3: vy2, z3: vz2};
            R3D(0.0, -height0 / 2.0, 0.0, obj1);
            pixelX1 = scaleX * (obj1.x3 + width0 / 2);
            pixelY1 = scaleY * (height0 / 2 - obj1.y3);
            R3D(0.0, height0 / 2.0, 0.0, obj2);
            pixelX2 = scaleX * (obj2.x3 + width0 / 2);
            pixelY2 = scaleY * (height0 / 2 - obj2.y3);
            ctx.beginPath();
            ctx.moveTo(pixelX1, pixelY1);
            ctx.lineTo(pixelX2, pixelY2);
            ctx.strokeStyle = 'rgb(255, 0, 0)';
            ctx.stroke();
            label_xyz(2, obj2.x3, obj2.y3);   // 座標名(x)表示

            // z軸の描画
            if (m_gamma90Flg == 0) {
                vx1 = 0.0, vy1 = 0.0, vz1 = 0.0, vx2 = 0.0, vy2 = 0.0, vz2 = 0.0;
                obj1 = {x3: vx1, y3: vy1, z3: vz1};
                obj2 = {x3: vx2, y3: vy2, z3: vz2};
                R3D(0.0, 0.0, -width0 / 2, obj1);
                pixelX1 = scaleX * (obj1.x3 + width0 / 2);
                pixelY1 = scaleY * (height0 / 2 - obj1.y3);
                R3D(0.0, 0.0, width0 / 2, obj2);
                pixelX2 = scaleX * (obj2.x3 + width0 / 2);
                pixelY2 = scaleY * (height0 / 2 - obj2.y3);
                ctx.beginPath();
                ctx.moveTo(pixelX1, pixelY1);
                ctx.lineTo(pixelX2, pixelY2);
                ctx.strokeStyle = 'rgb(0, 255, 0)';
                ctx.stroke();
                label_xyz(3, obj2.x3, obj2.y3);   // 座標名(x)表示
            }
        }

        // 座標名(x y z)の描画
        function label_xyz(kbn, x, y)
        {
            let pixelX1, pixelY1, pixelX2, pixelY2;
            let addLen = 1.0; ;  // (x, y)から座標の記号を書き込むために伸ばす距離
            let AxLen;           // 軸の長さ
            let xc;  // 座標軸の余弦
            let ys;  // 座標軸の正弦
            let addLenX;  // 座標を書き込むための x 方向の伸ばし量
            let addLenY;  // 座標を書き込むための y 方向の伸ばし量

            AxLen = Math.sqrt(x * x + y * y);
            xc = x / AxLen;
            ys = y / AxLen;
            mag = width0 / magStd;
            addLenX = mag * addLen * xc;
            if (addLenX < 0.0) addLenX = addLenX * 2.0;
            addLenY = mag * addLen * ys;
            if (addLenY < 0.0) addLenY = addLenY * 2.0;
            switch (kbn)
            {
                case 1: // 文字"X"の描画
                    pixelX1 = scaleX * ((x + addLenX + mag * 0.4) + width0 / 2);
                    pixelY1 = scaleY * (height0 / 2 - (y + addLenY + mag * 0.4));
                    pixelX2 = scaleX * ((x + addLenX + mag * 1.2) + width0 / 2);
                    pixelY2 = scaleY * (height0 / 2 - (y + addLenY - mag * 0.4));
                    ctx.beginPath();
                    ctx.moveTo(pixelX1, pixelY1);
                    ctx.lineTo(pixelX2, pixelY2);
                    ctx.strokeStyle = 'rgb(255, 255, 255)';
                    ctx.stroke();
                    pixelX1 = scaleX * ((x + addLenX + mag * 1.2) + width0 / 2);
                    pixelY1 = scaleY * (height0 / 2 - (y + addLenY + mag * 0.4));
                    pixelX2 = scaleX * ((x + addLenX + mag * 0.4) + width0 / 2);
                    pixelY2 = scaleY * (height0 / 2 - (y + addLenY - mag * 0.4));
                    ctx.beginPath();
                    ctx.moveTo(pixelX1, pixelY1);
                    ctx.lineTo(pixelX2, pixelY2);
                    ctx.strokeStyle = 'rgb(255, 255, 255)';
                    ctx.stroke();
                    break;
                case 2: // 文字"Y"の描画
                    pixelX1 = scaleX * ((x + addLenX + mag * 0.4) + width0 / 2);
                    pixelY1 = scaleY * (height0 / 2 - (y + addLenY + mag * 0.4));
                    pixelX2 = scaleX * ((x + addLenX + mag * 0.8) + width0 / 2);
                    pixelY2 = scaleY * (height0 / 2 - (y + addLenY));
                    ctx.beginPath();
                    ctx.moveTo(pixelX1, pixelY1);
                    ctx.lineTo(pixelX2, pixelY2);
                    ctx.strokeStyle = 'rgb(255, 0, 0)';
                    ctx.stroke();
                    pixelX1 = scaleX * ((x + addLenX + mag * 1.2) + width0 / 2);
                    pixelY1 = scaleY * (height0 / 2 - (y + addLenY + mag * 0.4));
                    pixelX2 = scaleX * ((x + addLenX + mag * 0.4) + width0 / 2);
                    pixelY2 = scaleY * (height0 / 2 - (y + addLenY - mag * 0.8));
                    ctx.beginPath();
                    ctx.moveTo(pixelX1, pixelY1);
                    ctx.lineTo(pixelX2, pixelY2);
                    ctx.strokeStyle = 'rgb(255, 0, 0)';
                    ctx.stroke();
                    break;
                case 3: // 文字"Y"の描画
                    pixelX1 = scaleX * ((x + addLenX + mag * 0.4) + width0 / 2);
                    pixelY1 = scaleY * (height0 / 2 - (y + addLenY + mag * 0.4));
                    pixelX2 = scaleX * ((x + addLenX + mag * 1.2) + width0 / 2);
                    pixelY2 = scaleY * (height0 / 2 - (y + addLenY + mag * 0.4));
                    ctx.beginPath();
                    ctx.moveTo(pixelX1, pixelY1);
                    ctx.lineTo(pixelX2, pixelY2);
                    ctx.strokeStyle = 'rgb(0, 255, 0)';
                    ctx.stroke();
                    pixelX1 = scaleX * ((x + addLenX + mag * 1.2) + width0 / 2);
                    pixelY1 = scaleY * (height0 / 2 - (y + addLenY + mag * 0.4));
                    pixelX2 = scaleX * ((x + addLenX + mag * 0.4) + width0 / 2);
                    pixelY2 = scaleY * (height0 / 2 - (y + addLenY - mag * 0.4));
                    ctx.beginPath();
                    ctx.moveTo(pixelX1, pixelY1);
                    ctx.lineTo(pixelX2, pixelY2);
                    ctx.strokeStyle = 'rgb(0, 255, 0)';
                    ctx.stroke();
                    pixelX1 = scaleX * ((x + addLenX + mag * 0.4) + width0 / 2);
                    pixelY1 = scaleY * (height0 / 2 - (y + addLenY - mag * 0.4));
                    pixelX2 = scaleX * ((x + addLenX + mag * 1.2) + width0 / 2);
                    pixelY2 = scaleY * (height0 / 2 - (y + addLenY - mag * 0.4));
                    ctx.beginPath();
                    ctx.moveTo(pixelX1, pixelY1);
                    ctx.lineTo(pixelX2, pixelY2);
                    ctx.strokeStyle = 'rgb(0, 255, 0)';
                    ctx.stroke();
                    break;
                default:
                    break;
            }

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
            cnt_dp = parseInt(document.getElementById('cnt_dp').value) || cnt_dp;
            init1[0] = parseFloat(document.getElementById('init1_x').value) || init1[0];
            init1[1] = parseFloat(document.getElementById('init1_y').value) || init1[1];
            init1[2] = parseFloat(document.getElementById('init1_z').value) || init1[21];
            init2[0] = parseFloat(document.getElementById('init2_x').value) || init2[0];
            init2[1] = parseFloat(document.getElementById('init2_y').value) || init2[1];
            init2[2] = parseFloat(document.getElementById('init2_z').value) || init2[21];

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
            document.getElementById('width0').value = 100;
            document.getElementById('cnt_dp').value = 3200;
            document.getElementById('dh').value = 0.01;
            updateRange();
        }

        function changeType() {
            const type = String(document.getElementById('type').value);

            switch (type) {
                case "01":  // Lorenz
                    dat = 1;
                    changeProperty(0);
                    // 係数デフォルト値
                    document.getElementById('ma').value = 10.0;
                    document.getElementById('mb').value = 28.0;
                    document.getElementById('mc').value = 8.0 / 3.0;
                    // 初期値デフォルト値
                    document.getElementById('init1_x').value = 0;
                    document.getElementById('init1_y').value = 1;
                    document.getElementById('init1_z').value = 2;
                    document.getElementById('init2_x').value = 0;
                    document.getElementById('init2_y').value = 1;
                    document.getElementById('init2_z').value = 2.01;
                    // 式を表示する
                    document.getElementById('dx').innerText = "\\[ \\dot{x} = ay - ax \\]";
                    document.getElementById('dy').innerText = "\\[ \\dot{y} = bx - xz - y \\]";
                    document.getElementById('dz').innerText = "\\[ \\dot{z} = xy - cz \\]";
                    setRange();
                    document.getElementById('cnt_dp').value = 3200;
                    document.getElementById('dh').value = 0.01;
                    document.getElementById('ma').disabled = false;
                    document.getElementById('mb').disabled = false;
                    document.getElementById('mc').disabled = false;
                    break;
                defaut:
                    break;
            }

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
                    FNH = md * x * x + me * x * y + mf * y * y;
                    return FNH;
                case 31:
                    FNH = x * x * x;
                    return FNH;
                case 32:
                    FNH = y * y * y;
                    return FNH;
                case 33:
                    FNH = y * y * (y - 2 * x);
                    return FNH;
                case 34:
                    FNH = y * y * (y - 2 * x);
                    return FNH;
                case 41:
                    FNH = Math.sin(x) + Math.pow(y, 2);
                    return FNH;
                default:
                    break;
            }
            return 0.0;
        }
