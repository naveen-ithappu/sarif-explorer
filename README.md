# SARIF Explorer

A simple, zero-dependency Node.js utility that converts SARIF reports into an interactive HTML viewer. It features:

✅ File explorer for navigating files  
✅ Collapsible issue list with code snippets for each finding  
✅ Quick, shareable HTML output without requiring any external server  

---

## 🚀 Features
- Interactive file tree to browse files with issues  
- Expandable/collapsible issue panels  
- Code snippets with highlighted issue context  
- Fully static HTML output for easy sharing  
- No runtime dependencies  

---

## 📦 Installation

```bash
npm install -g sarif-explorer
```

---

## 🛠️ Usage

```bash
sarif-explorer --input path/to/report.sarif --output report.html
```

- `--input`: Path to your SARIF report  
- `--output`: Path for generated HTML file  

Open the `report.html` file in any browser to explore issues interactively.

---

## 🔧 Example

```bash
sarif-explorer --input results.sarif --output results.html
```

---

## 👀 Screenshot

<<TBD>>

---

## 🤝 Contributing

PRs, feature suggestions, and improvements welcome! Check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## ⭐ Support the Project

If you find this tool helpful, star the repo and share with your team!
