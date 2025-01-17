let surface = [];
let range, divisions, step, angle = 0;

function initializeSurface() {
    range = parseFloat(document.getElementById('range').value);
    divisions = parseInt(document.getElementById('divisions').value);
    step = (2 * range) / divisions;

    surface = [];
    for (let i = 0; i <= divisions; i++) {
        surface[i] = [];
        for (let j = 0; j <= divisions; j++) {
            const x = -range + i * step;
            const y = -range + j * step;
            const z = f(x, y);
            surface[i][j] = {x, y, z};
        }
    }
}

function f(x, y) {
    return Math.sin(Math.sqrt(x * x + y * y));
}

function project(x, y, z) {
    const scale = 100;
    const x0 = canvas.width / 2;
    const y0 = canvas.height / 2;
    return [
        x0 + x * scale,
        y0 - z * scale - y * scale * 0.5
    ];
}

function drawSurface() {
    initializeSurface();
    draw();
}

function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < divisions; i++) {
        for (let j = 0; j < divisions; j++) {
            const p1 = surface[i][j];
            const p2 = surface[i + 1][j];
            const p3 = surface[i][j + 1];

            const [x0, y0] = project(p1.x, p1.y, p1.z);
            const [x1, y1] = project(p2.x, p2.y, p2.z);
            const [x2, y2] = project(p3.x, p3.y, p3.z);

            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
}

function rotateSurface() {
    angle += Math.PI / 36; // 5度回転

    for (let i = 0; i <= divisions; i++) {
        for (let j = 0; j <= divisions; j++) {
            const p = surface[i][j];
            const x = p.x * Math.cos(angle) - p.y * Math.sin(angle);
            const y = p.x * Math.sin(angle) + p.y * Math.cos(angle);
            surface[i][j] = {x, y, z: p.z};
        }
    }

    draw();
}
