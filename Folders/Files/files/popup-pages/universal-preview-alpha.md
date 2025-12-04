# 🚀 Alpha Test: Universal Preview Extension

## What is Universal Preview?

**Universal Preview** is a new VS Code extension that provides unified preview capabilities for multiple file formats - all running completely locally!

### ✨ Features

- **📄 Markdown Preview** - Live rendering with syntax highlighting
- **🌐 Web Files** - HTML, PHP preview with base path handling
- **📊 PDF Viewer** - Embedded PDF display
- **📈 CSV Tables** - Beautiful table rendering
- **🖼️ Images** - PNG, JPG, SVG, GIF support
- **📝 Office Files** - DOCX, XLSX, PPT (basic support, extensible)
- **📐 TeX/LaTeX** - Syntax preview for .tex and .bib files
- **⚡ Live Edit** - Real-time updates as you type
- **🎨 Customizable** - Configure refresh delay and auto-refresh behavior

### 🔧 Current Status: ALPHA

This extension is currently in **alpha testing**. We're looking for feedback!

### 📥 How to Try It

1. **Download the Extension**
   - Location: `Folders/Files/Resources/universal-preview/`
   - The extension source code is available in this repository

2. **Install & Run**

   ```bash
   cd Folders/Files/Resources/universal-preview
   npm install
   ```

3. **Test in VS Code**
   - Press `F5` in VS Code to launch Extension Development Host
   - Open any supported file (`.md`, `.csv`, `.html`, etc.)
   - Run: `Universal Preview: Open Preview` from Command Palette

4. **Try Live Edit**
   - Make changes to your file
   - Watch the preview update automatically!

### ⚙️ Configuration Options

Customize the extension in VS Code settings:

```json
{
  "universalPreview.autoRefresh": true,
  "universalPreview.refreshDelay": 300
}
```

- **autoRefresh**: Enable/disable live preview updates
- **refreshDelay**: Milliseconds to wait before refreshing (default: 300ms)

### 🎯 Roadmap

**Coming Soon:**

- [ ] Full Office file rendering (using mammoth.js, SheetJS)
- [ ] LaTeX compilation and rendering
- [ ] Syntax highlighting for code files
- [ ] Split-screen mode improvements
- [ ] Export to HTML/PDF functionality
- [ ] Custom themes support
- [ ] Hyperlink navigation within previews

### 🐛 Known Issues

- Office files (.docx, .xlsx) show placeholder - full rendering requires additional libraries
- TeX files show raw code - compilation coming in next release
- Some PDF files may not embed properly depending on browser security settings

### 💬 Feedback Wanted

We need your input! Please test and let us know:

1. **What file types do you preview most?**
2. **Any bugs or crashes?**
3. **Feature requests?**
4. **Performance issues?**

**Contact**: [yuemingdd@gmail.com](mailto:yuemingdd@gmail.com)

### 📦 Technical Details

**Built With:**

- TypeScript
- VS Code Extension API
- Webview API for rendering
- File system watchers for live updates

**Runs Completely Locally:**

- No external servers required
- All processing done in VS Code
- Your files never leave your machine

### 🔗 Quick Links

- [Extension Source Code](../../Resources/universal-preview/)
- [Report Issues](https://github.com/mchigm/mchigm.github.io/issues)
- [Feature Requests](https://github.com/mchigm/mchigm.github.io/issues)

---

**Version**: 0.0.1 (Alpha)  
**Last Updated**: December 2025  
**Author**: Chen Yueming (陈悦铭)

---

### 🚦 Getting Started Guide

#### Step 1: Open the Extension Folder

```bash
cd e:\Pjt\Programming\mchigm.github.io\Folders\Files\Resources\universal-preview
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Launch Extension

- Open the folder in VS Code
- Press `F5` to start debugging
- A new Extension Development Host window opens

#### Step 4: Test Files

Create a test file or use existing ones:

- `test.md` - Try Markdown preview
- `test.csv` - See CSV table rendering
- `test.html` - View HTML rendering

#### Step 5: Open Preview

- `Ctrl+Shift+P` → Type "Universal Preview"
- Select "Universal Preview: Open Preview"
- Edit your file and watch it update live!

---

### 💡 Pro Tips

1. **Multi-file workflow**: Open multiple previews side-by-side
2. **Keyboard shortcut**: Assign a custom keybinding for quick access
3. **Auto-save**: Enable VS Code auto-save for seamless live preview
4. **Custom delay**: Increase `refreshDelay` if you have large files

---

**Thank you for testing!** 🎉

Your feedback helps make this extension better for everyone.
