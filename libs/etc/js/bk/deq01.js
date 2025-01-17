        // Gloavbl 変数 //
        dat = 1;
        ma = 1;
        mb = -2;
        mc = 2;
        md = 1;
        cnt_dp = 320;
        dh = 0.01;
        //////////////////

        let width0 = 2;
        let height0 = 2;
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
                        ///////////////////
                        //               //
                        // Runge-Kutta法 //
                        //               //
                        ///////////////////
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

                        Ru_kx[0] = dh * FNF(dt, Ru_x0, Ru_y0);
                        Ru_ky[0] = dh * FNG(dt, Ru_x0, Ru_y0);
                        Ru_kx[1] = dh * FNF(dt + dh / 2.0, Ru_x0 + Ru_kx[0] / 2.0, Ru_y0 + Ru_ky[0] / 2.0);
                        Ru_ky[1] = dh * FNG(dt + dh / 2.0, Ru_x0 + Ru_kx[0] / 2.0, Ru_y0 + Ru_ky[0] / 2.0);
                        Ru_kx[2] = dh * FNF(dt + dh / 2.0, Ru_x0 + Ru_kx[1] / 2.0, Ru_y0 + Ru_ky[1] / 2.0);
                        Ru_ky[2] = dh * FNG(dt + dh / 2.0, Ru_x0 + Ru_kx[1] / 2.0, Ru_y0 + Ru_ky[1] / 2.0);
                        Ru_kx[3] = dh * FNF(dt + dh, Ru_x0 + Ru_kx[2], Ru_y0 + Ru_ky[2]);
                        Ru_ky[3] = dh * FNG(dt + dh, Ru_x0 + Ru_kx[2], Ru_y0 + Ru_ky[2]);

                        Ru_dx[i] = Ru_x0 + (Ru_kx[0] + 2.0 * Ru_kx[1] + 2.0 * Ru_kx[2] + Ru_kx[3]) / 6.0;
                        Ru_dy[i] = Ru_y0 + (Ru_ky[0] + 2.0 * Ru_ky[1] + 2.0 * Ru_ky[2] + Ru_ky[3]) / 6.0;
                        dnt = dt + dh;

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

        }

        function startAnimation() {
            ma = parseFloat(document.getElementById('ma').value);
            mb = parseFloat(document.getElementById('mb').value);
            mc = parseFloat(document.getElementById('mc').value);
            md = parseFloat(document.getElementById('md').value);
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
                document.getElementById('pm').style.visibility ="visible";
                document.getElementById('KAI1').innerText = kaiA;
                document.getElementById('KAI1').style.visibility ="visible";
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

        function FNF(dt, x, y) {
            switch (dat)
            {
                case 1:
                    const FNF = ma * x + mb * y;
                    return FNF;
                default:
                    break;
            }
            return 0.0;
        }
        function FNG(dt, x, y) {
            switch (dat)
            {
                case 1:
                    const FNG = mc * x + md * y;
                    return FNG;
                default:
                    break;
            }
            return 0.0;
        }
