# MathJax-Clipboard-Formula-Replacer

Replace complex MathJax HTML with its underlying TeX formula in your clipboard, making it easy to paste into LaTeX, Markdown, and other TeX-aware applications. If no MathJax is detected, the original selection is copied.

## Why I Wrote This

My intro to AI class uses webpages as slides, and so do the homework questions for my ECE class (on Canvas). One problem with this setup is that whenever I copy something containing a formula and paste it into tools like ChatGPT, the formula disappears. Personally, I use Typora to convert the content into Markdown before pasting it into ChatGPT, while some of my classmates just take tons of screenshots. 

Neither approach is elegant—both waste either time or time & storage space. So I learned scripting from scratch and implemented this with help from ChatGPT.

## Features

*   **Automatic MathJax Detection:** Identifies MathJax content within your copied selection.
*   **TeX Extraction:** Accurately extracts TeX formulas from both MathJax v2 and MathJax v3.
*   **HTML Cleaning:** Removes unnecessary `style`, `class`, and `id` attributes from the copied HTML for cleaner pasting.
*   **Graceful Fallback:** If no MathJax is found, or if an error occurs during TeX extraction, the script copies the original selected content without modification.
*   **Universal Compatibility:** Designed to work on all websites (`*://*/*`).
*   **Lightweight:** Requires no special browser permissions (`@grant none`).
*   **Console Logging:** Provides feedback in the browser console regarding its operations and successful installation.

# Timeline

I'll test it myself. When ready (stable) I'll maybe upload it to GreasyFork. First time doing this, all comments suggestions and critics are welcome! 

## How It Works

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

## UserScript Header Details

The script includes standard Tampermonkey metadata:

```javascript
// ==UserScript==
// @name         MathJax Clipboard Formula Replacer
// @name:en      MathJax Clipboard Formula Replacer
// @name:zh      MathJax 剪切板公式文本替换器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Intercept copy, but only parse & extract TeX when MathJax is present; otherwise, pass through the original selection untouched.
// @author       Ethan Pan
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
```
This metadata tells your UserScript manager:
*   The name of the script (including English and Chinese localizations).
*   A unique namespace.
*   The current version.
*   A brief description of what it does.
*   The author.
*   Which pages it should run on (all pages).
*   That it requires no special Greasemonkey API functions.
*   That it should run after the page has loaded (`document-idle`).
