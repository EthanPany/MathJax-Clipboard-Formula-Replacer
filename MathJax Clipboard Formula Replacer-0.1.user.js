// ==UserScript==
// @name         MathJax Clipboard Formula Replacer
// @name:en      MathJax Clipboard Formula Replacer
// @name:zh      MathJax 剪切板公式文本替换器
// @namespace    https://github.com/EthanPany/MathJax-Clipboard-Formula-Replacer
// @homepage     https://github.com/EthanPany/MathJax-Clipboard-Formula-Replacer

// @version      0.1
// @description  Intercept copy, but only parse & extract TeX when MathJax is present; otherwise, pass through the original selection untouched.
// @author       Ethan Pan
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';

  document.addEventListener('copy', e => {
    e.preventDefault();

    const sel = document.getSelection();
    if (!sel || sel.rangeCount === 0) return; // No selection, no need to proceed
    const range = sel.getRangeAt(0);  // Get the first (and only) range in the selection
    const frag = range.cloneContents(); // Clone the contents of the range
    const container = document.createElement('div'); // Create a new div element
    container.appendChild(frag); // Append the cloned contents to the div

    const plain = sel.toString(); // Get the plain text of the selection
    const htmlFrag = container.innerHTML; // Get the HTML of the cloned contents

    // Quick check: do we actually have MathJax here?
    if (!/mjx-container|class="MathJax"/.test(htmlFrag)) {
      // No equations—just pass through exactly what was selected
      e.clipboardData.setData('text/plain', plain);
      e.clipboardData.setData('text/html',  htmlFrag);
      return;
    }

    // --- Only now do we parse & extract TeX ---
    // console.group('📋 Copy with MathJax extraction');
    // console.log('• original plain →', plain);
    // console.log('• original HTML  →', htmlFrag);

    let cleanedPlain, cleanedHtml;
    try {
      const doc = new DOMParser().parseFromString(htmlFrag, 'text/html');
      // strip style/class/id
      doc.querySelectorAll('*').forEach(el => {
        el.removeAttribute('style');
        el.removeAttribute('class');
        el.removeAttribute('id');
      });
      // extract v3 MathJax
      doc.querySelectorAll('mjx-container[alttext]').forEach(m => {
        const t = m.getAttribute('alttext');
        m.replaceWith(document.createTextNode(t));
      });
      // extract v2 MathJax
      doc.querySelectorAll('span.MathJax[aria-label]').forEach(s => {
        const t = s.getAttribute('aria-label');
        s.replaceWith(document.createTextNode(t));
      });
      cleanedPlain = doc.body.textContent.trim();
      cleanedHtml  = doc.body.innerHTML;
      // console.log('• cleaned plain →', cleanedPlain);
      // console.log('• cleaned HTML  →', cleanedHtml);
    } catch (err) {
      // console.warn('⚠️ Extraction failed, falling back to original', err);
      cleanedPlain = plain;
      cleanedHtml  = htmlFrag;
    }
    // console.groupEnd();

    e.clipboardData.setData('text/plain', cleanedPlain);
    e.clipboardData.setData('text/html',  cleanedHtml);
  });

  // console.log('✅ MathJax Clipboard Formula Replacer installed');
})();