# 📋✨ MathJax-Clipboard-Formula-Replacer

Replace complex MathJax HTML with its underlying TeX formula in your clipboard, making it easy to paste into LaTeX, Markdown, and other TeX-aware applications. If no MathJax is detected, the original selection is copied.

## Demo
[![demo-image](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmszeHM5eHR2eWVxMWFtOTVueHFxcGdsMjRiNGN2eWY1eDQ0cnN2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tzQgiwWzNa6gOPp1FI/giphy.gif)](https://youtu.be/uIwWMj-_4HU)

## Why I Wrote This
My intro to AI class uses webpages as slides, and so do the homework questions for my ECE class (on Canvas). One problem with this setup is that whenever I copy something containing a formula and paste it into tools like ChatGPT, the formula disappears. Personally, I use Typora to convert the content into Markdown before pasting it into ChatGPT, while some of my classmates just take tons of screenshots. 
## 🚀 Demo
[![image-20250506173341455](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHJnc2ZpYm9pMTkwN3V3dzBrcnF5cG9sanpjdm50bWp5NHR4NzJraCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YbWRYySHR92dDJJAtS/giphy.gif)](https://youtu.be/uIwWMj-_4HU)
## 🤔 Why I Wrote This

My intro to AI class uses webpages as slides, and so do the homework questions for my ECE class (on Canvas). One problem with this setup is that whenever I copy something containing a formula and paste it into tools like ChatGPT, the formula disappears. Personally, I use Typora to convert the content into Markdown before pasting it into ChatGPT, while some of my classmates just take tons of screenshots.

Neither approach is elegant—both waste either time or time & storage space. So I learned scripting from scratch and implemented this with help from ChatGPT. I hope this script can help others facing similar issues!

## ✨ Features

*   **Automatic MathJax Detection:** Identifies MathJax content within your copied selection.
*   **TeX Extraction:** Accurately extracts TeX formulas from both MathJax v2 and MathJax v3.
*   **HTML Cleaning:** Removes unnecessary `style`, `class`, and `id` attributes from the copied HTML for cleaner pasting.
*   **Graceful Fallback:** If no MathJax is found, or if an error occurs during TeX extraction, the script copies the original selected content without modification.
*   **Universal Compatibility:** Designed to work on all websites (`*://*/*`).
*   **Lightweight:** Requires no special browser permissions (`@grant none`).
*   **Console Logging:** Provides feedback in the browser console regarding its operations and successful installation.

## 🛠️ How to Use

This script is a UserScript and requires a browser extension like Tampermonkey (for Chrome, Firefox, Edge, Opera) or Greasemonkey (for Firefox) to manage and run it.

1.  **Install a UserScript Manager:**
    *   **Tampermonkey:** Visit the [Tampermonkey website](https://www.tampermonkey.net/) and install the extension for your browser.
    *   **Greasemonkey:** If you use Firefox, you can get it from the [Firefox Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).

2.  **Install the Script:**
    *   Navigate to the `MathJax Clipboard Formula Replacer.user.js` file in this repository.
    *   Click the "Raw" button to view the script's source code.
    *   If you have Tampermonkey/Greasemonkey installed, it should automatically detect the UserScript and prompt you to install it. Confirm the installation.
    *   Alternatively, you can:
        1.  Copy the entire content of `MathJax Clipboard Formula Replacer.user.js`.
        2.  Open your UserScript manager's dashboard (e.g., Tampermonkey).
        3.  Create a new script.
        4.  Paste the copied code into the editor, replacing any template code.
        5.  Save the script.

3.  **Usage:**
    *   Once installed, the script runs automatically on all web pages (`*://*/*`) after the document is idle (`@run-at document-idle`).
    *   Simply select and copy text from any webpage as you normally would (e.g., using `Ctrl+C` or `Cmd+C`).
    *   **If MathJax formulas are detected:** They will be automatically converted to their TeX representation in your clipboard.
    *   **If no MathJax is detected:** Your original selection will be copied as-is.
    *   You can then paste the content into LaTeX editors, Markdown files (like Obsidian, Typora), or any other application that understands TeX.
    *   Check your browser's developer console for logs from the script, which can confirm its actions or indicate any issues.

## ⚙️ How It Works

This is a UserScript, intended to be used with a browser extension like Tampermonkey or Greasemonkey.

1.  **Event Listener:** The script listens for the `copy` event on the webpage.
2.  **Selection Analysis:** When you copy something, the script:
    *   Prevents the default copy behavior.
    *   Captures the selected content as both plain text (`sel.toString()`) and an HTML fragment (`range.cloneContents()`).
3.  **MathJax Check:** It performs a quick regular expression test (`/mjx-container|class="MathJax"/.test(htmlFrag)`) on the HTML fragment to check for the presence of MathJax elements.
4.  **Processing Logic:**
    *   **No MathJax Found:** If the check fails, the script sets the clipboard data to the original plain text and HTML content that was selected.
    *   **MathJax Found:**
        *   The script parses the HTML fragment of the selection into a DOM document.
        *   It iterates through all elements (`doc.querySelectorAll('*')`) and removes their `style`, `class`, and `id` attributes. This helps in cleaning up the resulting HTML.
        *   **MathJax v3:** It finds `mjx-container` elements that have an `alttext` attribute (which holds the TeX formula) and replaces the entire `mjx-container` element with a text node containing this TeX formula.
        *   **MathJax v2:** It finds `span` elements with the class `MathJax` that have an `aria-label` attribute (which also holds the TeX formula) and replaces the entire `span` element with a text node containing this TeX formula.
        *   After these replacements, the `textContent` of the modified DOM body is taken as the cleaned plain text, and `innerHTML` as the cleaned HTML.
        *   These cleaned versions are then set to the clipboard.
        *   **Error Handling:** If any part of this parsing and replacement process fails, the script catches the error, logs a warning, and falls back to using the original plain text and HTML.
5.  **Console Feedback:** The script logs its actions, including the original and cleaned plain/HTML content when MathJax is processed, or indicates a fallback. It also logs a success message upon initial installation.

## 📜 UserScript Header Details

The script includes standard Tampermonkey metadata:

```javascript
// ==UserScript==
// @name         MathJax Clipboard Formula Replacer
// @name:en      MathJax Clipboard Formula Replacer
// @name:zh      MathJax 剪切板公式文本替换器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Intercepts copy events. If MathJax content is detected in the selection, it extracts the TeX formula and cleans associated HTML. Otherwise, the original selection is copied.
// @author       Ethan Pan
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
```
This metadata tells your UserScript manager:
*   The name of the script (including English and Chinese localizations).
*   A unique namespace (often the author's homepage or a project URL).
*   The current version.
*   A brief description of what it does.
*   The author.
*   Which pages it should run on (`*://*/*` means all pages).
*   That it requires no special Greasemonkey API functions (`@grant none`).
*   That it should run after the page has fully loaded and parsed (`document-idle`).

## 🗓️ Timeline & Contributing

I'll test it myself. When ready (stable), I'll maybe upload it to GreasyFork.
This is my first time creating a UserScript, so all comments, suggestions, and criticisms are welcome!
If you find this project useful, please consider starring it! ⭐

If you'd like to contribute:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License
This project is licensed under the GNU General Public License v3 - see the [LICENSE](LICENSE) file for details.
