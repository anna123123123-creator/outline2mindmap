# Outline2MindMap

A tiny, free, browser-only tool that turns an indented text outline into a visual mind map — export as PNG or SVG. No install, no account, no backend, no analytics. The outline text never leaves your browser.

![screenshot](screenshot.png)

## Why

Most mind-map tools want an account, a cloud save, or a subscription just to draw boxes and lines. Sometimes you just have an outline (or can write one in 30 seconds) and want a clean diagram out of it. This is that tool.

## Try it

Open `index.html` in any modern browser — no build step, no dependencies. Or serve the folder with any static file server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Usage

1. Type or paste an outline in the left panel. Indent with 2 spaces (or a tab) per level:
   ```
   Project Plan
     Research
       Competitor analysis
       User interviews
     Design
       Wireframes
   ```
2. Click **Generate** (or just start typing — the example loads automatically on first open).
3. Click **Export PNG** or **Export SVG** to save the diagram.

## How it works

Plain-text outline → tree structure → a simple left-to-right tree layout, computed and rendered directly as inline SVG. No canvas libraries, no charting dependencies — about 200 lines of vanilla JavaScript in `script.js`.

## License

MIT — do whatever you want with it.

## Related

This started as a companion tool while building a full **AI-powered** mind-map product (AI-generated outlines from a single prompt, automatic branching, multiple map styles, multi-tenant admin backend, member/credit system). If you need that instead of a manual outline-to-diagram tool, the full source code is here: [AI Mind Map source code](https://inzyxuashop.com/aisiweidaotu-yuanma.html).
