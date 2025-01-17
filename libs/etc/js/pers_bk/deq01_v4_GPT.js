function startAnimation() {
    var formula_dx = document.getElementById('dxdt').value;
    var formula_dy = document.getElementById('dydt').value;
    var node_dx = math.parse(formula_dx);
    var node_dy = math.parse(formula_dy);

    var dxTex = "\\frac{dx}{dt} = " + node_dx.toTex();
    var dyTex = "\\frac{dy}{dt} = " + node_dy.toTex();

    var maxLineLength = 44;
    var splitDxTex = splitLongTex(dxTex, maxLineLength);
    var splitDyTex = splitLongTex(dyTex, maxLineLength);

    document.getElementById('dx').innerHTML = "\\[\\begin{aligned}" + splitDxTex + "\\end{aligned}\\]";
    document.getElementById('dy').innerHTML = "\\[\\begin{aligned}" + splitDyTex + "\\end{aligned}\\]";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function splitLongTex(tex, maxLineLength) {
    var result = '';
    var currentLine = '';
    var brackets = 0;
    var characters = tex.split('');

    characters.forEach(function(char, index) {
        if (char === '{' || char === '(') {
            brackets++;
        } else if (char === '}' || char === ')') {
            brackets--;
        }

        if (currentLine.length >= maxLineLength && (char === '+' || char === '-' || (char === '*' && characters[index + 1] !== '*') || char === '/') && brackets === 0) {
            result += currentLine + ' \\\\ ';
            currentLine = char;
        } else if (currentLine.length >= maxLineLength && (char === '}' || char === ')') && brackets === 0) {
            result += currentLine + char + ' \\\\ ';
            currentLine = '';
        } else {
            currentLine += char;
        }
    });

    result += currentLine;
    return result;
}