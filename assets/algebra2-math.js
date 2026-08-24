(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const make = (tag, attrs = {}) => { const node = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value)); return node; };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const familyValue = (family, value) => family === "constant" ? 1 : family === "linear" ? value : family === "absolute" ? Math.abs(value) : value * value;

  function graphFrame(container, label, xMin = -8, xMax = 8, yMin = -8, yMax = 8) {
    container.replaceChildren();
    const svg = make("svg", { viewBox: "0 0 560 360", role: "img", "aria-label": label, class: "math-svg" });
    const width = 560, height = 360, pad = 34;
    const x = value => pad + (value - xMin) / (xMax - xMin) * (width - pad * 2);
    const y = value => height - pad - (value - yMin) / (yMax - yMin) * (height - pad * 2);
    const grid = make("g", { class: "math-grid" });
    for (let value = Math.ceil(xMin); value <= xMax; value += 1) grid.appendChild(make("line", { x1: x(value), y1: y(yMin), x2: x(value), y2: y(yMax) }));
    for (let value = Math.ceil(yMin); value <= yMax; value += 1) grid.appendChild(make("line", { x1: x(xMin), y1: y(value), x2: x(xMax), y2: y(value) }));
    svg.append(grid);
    svg.append(make("line", { x1: x(xMin), y1: y(0), x2: x(xMax), y2: y(0), class: "math-axis" }), make("line", { x1: x(0), y1: y(yMin), x2: x(0), y2: y(yMax), class: "math-axis" }));
    [-6, -4, -2, 2, 4, 6].forEach(value => { const tx = make("text", { x: x(value), y: y(0) + 18, class: "math-label" }); tx.textContent = value; svg.append(tx); });
    [-6, -4, -2, 2, 4, 6].forEach(value => { const ty = make("text", { x: x(0) + 7, y: y(value) + 4, class: "math-label" }); ty.textContent = value; svg.append(ty); });
    container.append(svg);
    return { svg, x, y, xMin, xMax, yMin, yMax };
  }

  function pathFor(frame, fn, className) {
    const points = [];
    let drawing = false;
    for (let value = frame.xMin; value <= frame.xMax; value += .08) {
      const output = fn(value);
      if (Number.isFinite(output) && output >= frame.yMin - 2 && output <= frame.yMax + 2) {
        points.push(`${drawing ? "L" : "M"}${frame.x(value).toFixed(2)},${frame.y(clamp(output, frame.yMin - 2, frame.yMax + 2)).toFixed(2)}`);
        drawing = true;
      } else drawing = false;
    }
    frame.svg.append(make("path", { d: points.join(" "), class: className, fill: "none" }));
  }

  function renderFunctionGraph(container, options = {}) {
    const family = options.family || "absolute", a = Number(options.a ?? 1), b = Number(options.b ?? 1), h = Number(options.h ?? 0), k = Number(options.k ?? 0);
    const names = { constant: "constant", linear: "linear", absolute: "absolute value", quadratic: "quadratic" };
    const label = `${names[family]} graph transformed with a ${a}, b ${b}, horizontal shift ${h}, and vertical shift ${k}`;
    const frame = graphFrame(container, label);
    if (options.showParent !== false) pathFor(frame, x => familyValue(family, x), "math-parent-path");
    pathFor(frame, x => a * familyValue(family, b * (x - h)) + k, "math-function-path");
    const vertexY = a * familyValue(family, 0) + k;
    if (["absolute", "quadratic"].includes(family) && vertexY >= frame.yMin && vertexY <= frame.yMax) frame.svg.append(make("circle", { cx: frame.x(h), cy: frame.y(vertexY), r: 5, class: "math-point" }));
    container.dataset.summary = label;
    return label;
  }

  function renderScatter(container, points, line = { m: 1, b: 0 }) {
    const xMax = Math.max(10, ...points.map(point => point[0])) + 1, yMax = Math.max(10, ...points.map(point => point[1])) + 2;
    const frame = graphFrame(container, `Scatter plot with ${points.length} data points and proposed line y=${line.m.toFixed(1)}x+${line.b.toFixed(1)}`, 0, xMax, 0, yMax);
    points.forEach(([px, py]) => frame.svg.append(make("circle", { cx: frame.x(px), cy: frame.y(py), r: 5, class: "scatter-point" })));
    pathFor(frame, x => line.m * x + line.b, "math-function-path");
    const above = points.filter(([px, py]) => py > line.m * px + line.b).length;
    const below = points.filter(([px, py]) => py < line.m * px + line.b).length;
    return { above, below, on: points.length - above - below };
  }

  function renderNumberLine(container, options = {}) {
    container.replaceChildren();
    const boundary = Math.abs(Number(options.boundary ?? 4)), between = options.mode !== "outside", inclusive = Boolean(options.inclusive);
    const svg = make("svg", { viewBox: "0 0 680 150", role: "img", "aria-label": between ? `Values between negative ${boundary} and ${boundary}` : `Values less than negative ${boundary} or greater than ${boundary}`, class: "math-svg number-line-svg" });
    const x = value => 40 + (value + 10) / 20 * 600, y = 76;
    svg.append(make("line", { x1: 34, y1: y, x2: 646, y2: y, class: "math-axis" }));
    for (let value = -10; value <= 10; value += 1) {
      svg.append(make("line", { x1: x(value), y1: y - 6, x2: x(value), y2: y + 6, class: "number-tick" }));
      if (value % 2 === 0) { const text = make("text", { x: x(value), y: y + 26, class: "math-label" }); text.textContent = value; svg.append(text); }
    }
    const left = x(-boundary), right = x(boundary);
    if (between) svg.append(make("line", { x1: left, y1: y, x2: right, y2: y, class: "number-solution" }));
    else svg.append(make("line", { x1: x(-10), y1: y, x2: left, y2: y, class: "number-solution" }), make("line", { x1: right, y1: y, x2: x(10), y2: y, class: "number-solution" }));
    [left, right].forEach(cx => svg.append(make("circle", { cx, cy: y, r: 8, class: inclusive ? "number-endpoint closed" : "number-endpoint open" })));
    container.append(svg);
  }

  function renderPiecewise(container, options = {}) {
    const boundary = Number(options.boundary ?? 1), first = options.first || (x => x + 3), second = options.second || (x => -x + 5), firstLabel = options.firstLabel || "y=x+3 for x<1", secondLabel = options.secondLabel || "y=-x+5 for x≥1";
    const frame = graphFrame(container, `Piecewise graph: ${firstLabel}; ${secondLabel}`);
    const leftFn = x => x < boundary ? first(x) : NaN, rightFn = x => x >= boundary ? second(x) : NaN;
    if (options.showFirst !== false) {
      pathFor(frame, leftFn, "math-function-path");
      frame.svg.append(make("circle", { cx: frame.x(boundary), cy: frame.y(first(boundary)), r: 6, class: "number-endpoint open" }));
    }
    if (options.showSecond !== false) {
      pathFor(frame, rightFn, "math-second-path");
      frame.svg.append(make("circle", { cx: frame.x(boundary), cy: frame.y(second(boundary)), r: 6, class: "number-endpoint closed" }));
    }
  }

  globalThis.AlgebraMath = { renderFunctionGraph, renderScatter, renderNumberLine, renderPiecewise };
})();
