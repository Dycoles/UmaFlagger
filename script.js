console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("input");
  const outputBox = document.getElementById("highlighted");

  /* ========== CONFIG ========== */
  const bannedWords = [
    "ho",
    "banned"
  ];

  /* ========== PATTERN GENERATION ========== */
  function generatePatterns(word) {
    const patterns = new Set();
    patterns.add(word);
    patterns.add(" " + word);
    patterns.add(word + " ");
    for (let i = 1; i < word.length; i++) {
      patterns.add(word.slice(0, i) + " " + word.slice(i));
    }
    return [...patterns];
  }

  const bannedPatterns = bannedWords.flatMap(w =>
    generatePatterns(w.toLowerCase())
  );
  console.log("Generated patterns:", bannedPatterns);

  /* ========== ANALYZE FUNCTION ========== */
  function analyze(text) {
    const lower = text.toLowerCase();
    let matches = [];

    bannedPatterns.forEach(pattern => {
      let index = 0;
      while ((index = lower.indexOf(pattern, index)) !== -1) {
        matches.push({
          start: index,
          end: index + pattern.length,
          pattern
        });
        index += 1;
      }
    });

    return matches;
  }

  /* ========== RENDER HIGHLIGHTED ========== */
 function mergeRanges(ranges) {
  if (ranges.length === 0) return [];

  // Sort by start index
  ranges.sort((a, b) => a.start - b.start);

  const merged = [];
  let current = { start: ranges[0].start, end: ranges[0].end };

  for (let i = 1; i < ranges.length; i++) {
    const r = ranges[i];
    if (r.start <= current.end) {
      // Overlapping or adjacent, extend the current range
      if (r.end > current.end) current.end = r.end;
    } else {
      merged.push(current);
      current = { start: r.start, end: r.end };
    }
  }
  merged.push(current);
  return merged;
}

function render(text, matches) {
  const merged = mergeRanges(matches);

  let result = "";
  let lastIndex = 0;

  merged.forEach(range => {
    // Add text before the highlight
    result += escapeHtml(text.slice(lastIndex, range.start));
    // Add highlighted text with spaces replaced by _
    const highlighted = escapeHtml(text.slice(range.start, range.end)).replace(/ /g, "_");
    result += `<span class="highlight">${highlighted}</span>`;
    lastIndex = range.end;
  });

  // Add remaining text after last highlight
  result += escapeHtml(text.slice(lastIndex));

  return result;
}

// Simple helper to escape HTML special chars to prevent XSS and broken tags
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m];
  });
}


  /* ========== LIVE UPDATE ========== */
  function update() {
    const text = inputBox.value;
    const matches = analyze(text);
    outputBox.innerHTML = render(text, matches);
  }

  inputBox.addEventListener("input", update);

  // initialize empty
  update();
});
