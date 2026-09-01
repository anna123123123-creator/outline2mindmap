(function () {
  'use strict';

  var EXAMPLE = [
    'Project Plan',
    '  Research',
    '    Competitor analysis',
    '    User interviews',
    '  Design',
    '    Wireframes',
    '    Visual design',
    '  Build',
    '    Frontend',
    '    Backend',
    '    QA',
    '  Launch',
    '    Marketing site',
    '    Release notes',
  ].join('\n');

  var input = document.getElementById('outlineInput');
  var svg = document.getElementById('mindmap');
  var canvasWrap = document.getElementById('canvasWrap');

  var NODE_H = 36;
  var H_GAP = 70;
  var V_GAP = 16;
  var PAD_X = 18;
  var PAD_Y = 24;
  var CHAR_W = 7.2;
  var MIN_NODE_W = 120;

  function indentLevel(line) {
    var m = line.match(/^[ \t]*/)[0];
    var spaces = m.replace(/\t/g, '  ');
    return Math.floor(spaces.length / 2);
  }

  function parseOutline(text) {
    var lines = text.split('\n').filter(function (l) { return l.trim().length > 0; });
    if (!lines.length) return null;

    var root = { text: lines[0].trim(), children: [], depth: 0 };
    var stack = [root];

    for (var i = 1; i < lines.length; i++) {
      var line = lines[i];
      var depth = indentLevel(line); // relative to root at depth 0
      var text = line.trim().replace(/^[-*]\s+/, '');
      var node = { text: text, children: [], depth: depth };

      while (stack.length > depth) stack.pop();
      var parent = stack[stack.length - 1] || root;
      parent.children.push(node);
      stack[depth] = node;
      stack.length = depth + 1;
    }
    return root;
  }

  function nodeWidth(text) {
    return Math.max(MIN_NODE_W, Math.round(text.length * CHAR_W) + 32);
  }

  function layout(root) {
    var leafIndex = 0;
    var maxDepth = 0;

    function assign(node) {
      maxDepth = Math.max(maxDepth, node.depth);
      if (!node.children.length) {
        node.y = leafIndex * (NODE_H + V_GAP);
        leafIndex++;
      } else {
        node.children.forEach(assign);
        var ys = node.children.map(function (c) { return c.y; });
        node.y = (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2;
      }
      node.w = nodeWidth(node.text);
    }
    assign(root);

    var levelMaxW = [];
    (function scanWidths(node) {
      levelMaxW[node.depth] = Math.max(levelMaxW[node.depth] || 0, node.w);
      node.children.forEach(scanWidths);
    })(root);

    var levelX = [0];
    for (var d = 1; d <= maxDepth; d++) {
      levelX[d] = levelX[d - 1] + levelMaxW[d - 1] + H_GAP;
    }
    (function assignX(node) {
      node.x = levelX[node.depth];
      node.children.forEach(assignX);
    })(root);

    var totalW = levelX[maxDepth] + levelMaxW[maxDepth];
    var totalH = leafIndex > 0 ? (leafIndex - 1) * (NODE_H + V_GAP) + NODE_H : NODE_H;
    return { totalW: totalW, totalH: totalH };
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function render(root) {
    svg.innerHTML = '';
    var dims = layout(root);
    var W = dims.totalW + PAD_X * 2;
    var H = dims.totalH + PAD_Y * 2;
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    var defs = svgEl('defs', {});
    var grad = svgEl('linearGradient', { id: 'rootGrad', x1: '0', y1: '0', x2: '1', y2: '1' });
    var s1 = svgEl('stop', { offset: '0%', 'stop-color': '#19B8D4' });
    var s2 = svgEl('stop', { offset: '100%', 'stop-color': '#8B5CF6' });
    grad.appendChild(s1); grad.appendChild(s2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    var linkGroup = svgEl('g', { class: 'links' });
    var nodeGroup = svgEl('g', { class: 'nodes' });
    svg.appendChild(linkGroup);
    svg.appendChild(nodeGroup);

    function drawLink(parent, child) {
      var x1 = parent.x + parent.w + PAD_X;
      var y1 = parent.y + NODE_H / 2 + PAD_Y;
      var x2 = child.x + PAD_X;
      var y2 = child.y + NODE_H / 2 + PAD_Y;
      var mx = (x1 + x2) / 2;
      var d = 'M ' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ', ' + mx + ' ' + y2 + ', ' + x2 + ' ' + y2;
      linkGroup.appendChild(svgEl('path', { class: 'link', d: d }));
    }

    function drawNode(node, isRoot) {
      var g = svgEl('g', { class: 'node' + (isRoot ? ' root' : ''), transform: 'translate(' + (node.x + PAD_X) + ',' + (node.y + PAD_Y) + ')' });
      g.appendChild(svgEl('rect', { width: node.w, height: NODE_H, rx: 10 }));
      var t = svgEl('text', { x: node.w / 2, y: NODE_H / 2, 'text-anchor': 'middle' });
      t.textContent = node.text;
      g.appendChild(t);
      nodeGroup.appendChild(g);

      node.children.forEach(function (c) {
        drawLink(node, c);
        drawNode(c, false);
      });
    }
    drawNode(root, true);
  }

  function generate() {
    var tree = parseOutline(input.value);
    if (!tree) return;
    render(tree);
  }

  function serializeSVG() {
    var clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    var style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = [
      '.node rect{fill:#111a2c;stroke:rgba(147,160,184,.35);stroke-width:1.4}',
      '.node.root rect{fill:url(#rootGrad);stroke:none}',
      '.node text{fill:#EAF0FA;font-size:13px;font-family:sans-serif;dominant-baseline:middle}',
      '.node.root text{fill:#06121A;font-weight:700}',
      '.link{fill:none;stroke:rgba(147,160,184,.35);stroke-width:1.6}',
    ].join('\n');
    clone.insertBefore(style, clone.firstChild);
    var bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '100%');
    bg.setAttribute('height', '100%');
    bg.setAttribute('fill', '#0A101E');
    clone.insertBefore(bg, clone.firstChild);
    return new XMLSerializer().serializeToString(clone);
  }

  function download(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function exportSVG() {
    var svgStr = serializeSVG();
    download(new Blob([svgStr], { type: 'image/svg+xml' }), 'mindmap.svg');
  }

  function exportPNG() {
    var svgStr = serializeSVG();
    var w = parseInt(svg.getAttribute('width'), 10) || 800;
    var h = parseInt(svg.getAttribute('height'), 10) || 600;
    var scale = 2;
    var img = new Image();
    var svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(svgBlob);
    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = w * scale;
      canvas.height = h * scale;
      var ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (blob) {
        download(blob, 'mindmap.png');
      });
    };
    img.src = url;
  }

  document.getElementById('btnGenerate').addEventListener('click', generate);
  document.getElementById('btnExample').addEventListener('click', function () {
    input.value = EXAMPLE;
    generate();
  });
  document.getElementById('btnSVG').addEventListener('click', exportSVG);
  document.getElementById('btnPNG').addEventListener('click', exportPNG);

  input.value = EXAMPLE;
  generate();
})();
