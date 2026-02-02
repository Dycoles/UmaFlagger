// script.js

const bannedWords = ["ho", "anus"];

const input = document.getElementById("input");
const output = document.getElementById("output");

function findOffenses(text, banned) {
  const offenses = [];

  let buffer = "";
  let bufferMap = [];

  function flushBuffer() {
    if (!buffer) return;

    banned.forEach(word => {
      let idx = buffer.indexOf(word);
      while (idx !== -1) {
        const start = bufferMap[idx];
        const end = bufferMap[idx + word.length - 1];
        offenses.push([start, end]);
        idx = buffer.indexOf(word, idx + 1);
      }
    });

    buffer = "";
    bufferMap = [];
  }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (/[a-zA-Z]/.test(ch)) {
      buffer += ch.toLowerCase();
      bufferMap.push(i);
    } else if (ch === " " || ch === "'" || ch === "_") {
      // allow soft separators to be skipped
      continue;
    } else {
      // hard break on punctuation/newlines
      flushBuffer();
    }
  }

  flushBuffer();
  return offenses;
}

function highlight(text, ranges) {
  if (ranges.length === 0) return escapeHTML(text);

  ranges.sort((a, b) => a[0] - b[0]);

  let result = "";
  let lastIndex = 0;

  ranges.forEach(([start, end]) => {
    result += escapeHTML(text.slice(lastIndex, start));
    result += `<mark>${escapeHTML(text.slice(start, end + 1))}</mark>`;
    lastIndex = end + 1;
  });

  result += escapeHTML(text.slice(lastIndex));
  return result;
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

input.addEventListener("input", () => {
  const text = input.value;
  const offenses = findOffenses(text, bannedWords);
  output.innerHTML = highlight(text, offenses);
});
