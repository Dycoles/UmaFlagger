// script.js

const bannedWords = ["ho", "anus"];

const input = document.getElementById("input");
const output = document.getElementById("output");

function hasRequiredSpace(text, start, end) {
  // space before
  if (start > 0 && text[start - 1] === " ") return true;
  // space after
  if (end < text.length - 1 && text[end + 1] === " ") return true;
  // space between letters
  for (let i = start; i <= end; i++) {
    if (text[i] === " ") return true;
  }
  return false;
}

function findOffenses(text, banned) {
  const offenses = [];

  let buffer = "";
  let bufferMap = [];

  function flushBuffer() {
    if (!buffer) return;

    banned.forEach(word => {
      let idx = buffer.indexOf(word);
      while (idx !== -1) {
        const origStart = bufferMap[idx];
        const origEnd = bufferMap[idx + word.length - 1];

        // REQUIRE at least one literal space before/after/between
        if (hasRequiredSpace(text, origStart, origEnd)) {
          offenses.push([origStart, origEnd]);
        }

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
      // soft separators: ignored but don't flush
      continue;
    } else {
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

  for (const [start, end] of ranges) {
    result += escapeHTML(text.slice(lastIndex, start));
    result += `<mark>${escapeHTML(text.slice(start, end + 1))}</mark>`;
    lastIndex = end + 1;
  }

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
