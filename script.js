// script.js

const bannedWords = ["ho", "anus"];

const input = document.getElementById("input");
const output = document.getElementById("output");

function findOffenses(text, banned) {
  const offenses = [];

  // Build a normalized string (letters only) and map back to original indices
  let normalized = "";
  const indexMap = []; // normalized index -> original index

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/[a-zA-Z]/.test(ch)) {
      normalized += ch.toLowerCase();
      indexMap.push(i);
    }
  }

  banned.forEach(word => {
    let start = 0;
    while (true) {
      const idx = normalized.indexOf(word, start);
      if (idx === -1) break;

      const origStart = indexMap[idx];
      const origEnd = indexMap[idx + word.length - 1];
      offenses.push([origStart, origEnd]);

      start = idx + 1;
    }
  });

  return offenses;
}

function highlight(text, ranges) {
  if (ranges.length === 0) return text;

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
