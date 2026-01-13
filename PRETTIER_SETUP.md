# Prettier Setup Guide

## ✅ Installation Complete!

Your Next.js + TypeScript project now has a professional Prettier setup with:

- **Prettier** for code formatting
- **prettier-plugin-tailwindcss** for automatic Tailwind class sorting
- **eslint-config-prettier** for ESLint compatibility

---

## 📁 Files Created

### 1. `.prettierrc` - Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 2. `.prettierignore` - Ignored Files

Excludes build outputs, dependencies, and cache files from formatting.

### 3. `.vscode/settings.json` - Editor Integration

Enables format-on-save for VS Code.

---

## 🚀 Usage

### Format All Files

```bash
npm run format
```

### Check Formatting (CI/CD)

```bash
npm run format:check
```

### Fix Formatting Issues

```bash
npm run format:fix
```

---

## 🎯 Features

### ✨ Automatic Tailwind Class Sorting

Before:

```tsx
<div className="text-white p-4 bg-blue-500 rounded-lg mt-2">
```

After:

```tsx
<div className="mt-2 rounded-lg bg-blue-500 p-4 text-white">
```

### 🔧 Format on Save

With VS Code settings configured, your code will automatically format when you save!

### 🤝 ESLint Integration

ESLint and Prettier work together without conflicts thanks to `eslint-config-prettier`.

---

## 💡 Tips

1. **Install VS Code Extension**: Install "Prettier - Code formatter" extension
2. **Team Consistency**: Commit `.prettierrc` and `.vscode/settings.json` to Git
3. **Pre-commit Hook**: Consider adding Husky + lint-staged for automatic formatting before commits
4. **CI/CD**: Add `npm run format:check` to your CI pipeline

---

## 🎨 Configuration Explained

| Setting         | Value      | Why                                    |
| --------------- | ---------- | -------------------------------------- |
| `semi`          | `true`     | Use semicolons (TypeScript standard)   |
| `singleQuote`   | `false`    | Use double quotes (Next.js convention) |
| `printWidth`    | `80`       | Keep lines readable                    |
| `tabWidth`      | `2`        | Standard for React/Next.js             |
| `trailingComma` | `"es5"`    | Better git diffs                       |
| `arrowParens`   | `"always"` | Consistent arrow functions             |

---

## 🔥 Next Steps (Optional)

### Add Pre-commit Hooks

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Then add to `package.json`:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,json,css,md}": [
    "prettier --write",
    "eslint --fix"
  ]
}
```

### Add to CI/CD

```yaml
- name: Check formatting
  run: npm run format:check
```

---

## ✅ You're All Set!

Your project now has professional-grade code formatting. Just save your files and watch Prettier work its magic! 🎉
