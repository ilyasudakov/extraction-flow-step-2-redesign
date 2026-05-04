# Extraction Flow - Step 2 Redesign

Browser prototype for the redesigned second step of the extraction flow.

## Requirements

- A modern browser
- Internet access for CDN dependencies:
  - React
  - ReactDOM
  - Babel standalone

No package install or build step is required.

## Run Locally

For the simplest preview, open `Extraction Flow standalone.html` in your browser.

You can also open `Extraction Flow.html`. This version keeps the app split across
separate JSX and CSS files, which is easier for editing.

If your browser blocks local file loading, serve the folder with a small static server:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/Extraction%20Flow.html
```

Or open the standalone version:

```text
http://localhost:8000/Extraction%20Flow%20standalone.html
```

## Project Structure

- `Extraction Flow.html` - browser entry point
- `Extraction Flow standalone.html` - self-contained browser preview
- `app.jsx` - main app component
- `data.jsx` - demo data
- `styles.css` - app styling
- `*-pane.jsx`, `*-panel.jsx`, and related files - UI sections and controls
- `uploads/` - image assets used by the prototype

## Notes

The prototype uses `type="text/babel"` scripts, so JSX is compiled in the browser at runtime. This keeps setup simple, but it is intended for design review and iteration rather than production deployment.
