# All Out Hell UX Redesign (Chrome Extension)

This Chrome extension enhances the user interface of the browser game [All Out Hell](https://allouthell.com) by injecting custom styles and layout improvements. It adds a visual inventory panel, equipment layout, icons, and reorganizes key blocks for better usability during gameplay.

> ⚠️ This extension is not available on the Chrome Web Store. It must be loaded manually as an **unpacked extension**.

---

## 🔧 Features

- 🧍 Redesigned **Equipment & Inventory Panel**
- 🖼️ Item icons and slot visuals for better readability

---

## 🛠️ How to Install (Manual Method)

### 1. Clone or Download the Folder

bash
git clone https://github.com/igloro/allouthell_igloro_ux.git

Or download the ZIP and extract it to a folder.

### 2. Open Chrome Extensions Page

Go to:
chrome://extensions

Enable Developer Mode using the toggle in the top right.

### 3. Load Unpacked Extension

Click "Load unpacked"
Select the folder you downloaded or cloned (allouthell_igloro_ux/)
Done!

The extension will now automatically apply on all pages under https://allouthell.com/*.

Project Structure
```
allouthell_igloro_ux/
├── manifest.json        # Extension configuration
├── styles.css           # Custom styles for redesign
├── script.js            # DOM manipulation logic
```

