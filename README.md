# Outline2MindMap

**[Live demo →](https://anna123123123-creator.github.io/outline2mindmap/)**

A free, open-source tool that turns an indented text outline into a visual mind map, entirely in the browser. Exports PNG and SVG. No install, no signup, no backend, no analytics — the outline never leaves your tab.

![screenshot](screenshot.png)

## Why this exists

Most mind-mapping tools want an account, a cloud account, or a subscription before they will draw a few boxes and a few lines. But often all you have is an outline — or an outline you could write in 30 seconds — and you just want a clean diagram out of it. That is all this does.

## Run it

Open `index.html` in a browser. No build step, no dependencies. Or serve the folder with any static server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## How to use it

1. Type or paste an outline on the left. Indent each level with two spaces (or one tab):
   ```
   Project plan
     Research
       Competitor review
       User interviews
     Design
       Wireframes
   ```
2. Click **Generate** (a sample outline loads on first open).
3. Click **Export PNG** or **Export SVG** to save the map.

## How it works

Plain text outline → parsed into a tree → a simple left-to-right tree layout that computes coordinates directly and renders inline SVG. No drawing library, no charting dependency — roughly 200 lines of vanilla JavaScript in `script.js`.

## License

MIT — use it however you like.
