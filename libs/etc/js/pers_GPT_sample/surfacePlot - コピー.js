function drawSurface() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const range = parseFloat(document.getElementById('range').value);
    const divisions = parseInt(document.getElementById('divisions').value);

    const step = (2 * range) / divisions;

    function f(x, y) {
        return Math.sin(Math.sqrt(x * x + y * y));
    }

    ctx.clearRect(0, 0, width, height);

    function project(x, y, z) {
        const scale = 100;
        const x0 = width / 2;
        const y0 = height / 2;
        return [
            x0 + x * scale,
            y0 - z * scale - y * scale * 0.5
        ];
    }

    for (let i = -range; i < range; i += step) {
        for (let j = -range; j < range; j += step) {
            const x = i;
            const y = j;
            const z = f(x, y);

            const nextX = i + step;
            const nextY = j + step;

            const zNextX = f(nextX, y);
            const zNextY = f(x, nextY);

            const [x0, y0] = project(x, y, z);
            const [x1, y1] = project(nextX, y, zNextX);
            const [x2, y2] = project(x, nextY, zNextY);

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
