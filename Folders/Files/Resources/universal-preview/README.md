# Universal Preview Extension

This extension provides a unified preview experience for various file types directly within VS Code.

## Features

- **Live Preview**: Updates in real-time as you edit.
- **Supported Formats**:
  - **Markdown**: Basic rendering (extensible with `markdown-it`).
  - **Web**: HTML, PHP (renders HTML output).
  - **PDF**: Embedded PDF viewer.
  - **CSV**: Table view.
  - **Images**: PNG, JPG, SVG, GIF.
  - **Office/TeX**: Basic stubs (requires additional libraries for full rendering).

## Setup

1. Open this folder in VS Code.
2. Install dependencies: `npm install`. Optionally add renderers: `npm install markdown-it mammoth xlsx katex`.
3. Press `F5` to launch the Extension Development Host.
4. Open a file (e.g., `test.md` or `test.csv`) and run the command `Universal Preview: Open Preview`.

## Customization

You can configure the refresh behavior in VS Code settings:
- `universalPreview.autoRefresh`: Enable/disable live updates.
- `universalPreview.refreshDelay`: Time in ms to wait before refreshing.

## Extending

To add full support for Office files (.docx, .xlsx), consider integrating libraries like:
- `mammoth.js` for Word documents.
- `SheetJS` for Excel files.
- `KaTeX` for LaTeX rendering.

