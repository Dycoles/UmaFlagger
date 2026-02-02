console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("input");
  const outputBox = document.getElementById("highlighted");

  const bannedWords = [
    "ho",
    "banned"
  ];

  // Generate patterns with spaces inserted
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

  // Analyze text for banned patterns, returning matches
  function analyze(text) {
    const lower = text.toLowerCase();
    let matches = [];

    bannedPatterns.forEach(pattern => {
      let index = 0;
      while ((index = lower.indexOf(pattern, index)) !== -1) {
        matches.push({ start: index, end: index + pattern.length, pattern });
        index += 1;
      }
    });

    return matches;
  }

  // Merge overlapping or adjacent ranges
  function mergeRanges(ranges) {
    if (!ranges.length) return [];
    ranges.sort((a, b) => a.start - b.start);
    const merged = [];
    let current = { ...ranges[0] };
    for (let i = 1; i < ranges.length; i++) {
      if (ranges[i].start <= current.end) {
        current.end = Math.max(current.end, ranges[i].end);
      } else {
        merged.push(current);
        current = { ...ranges[i] };
      }
    }
    merged.push(current);
    return merged;
  }

  // Escape HTML special characters
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  // Render text with highlights
  function render(text, matches) {
    const merged = mergeRanges(matches);
    let result = '';
    let lastIndex = 0;
    for (const range of merged) {
      result += escapeHtml(text.slice(lastIndex, range.start));
      const highlighted = escapeHtml(text.slice(range.start, range.end)).replace(/ /g, '_');
      result += `<span class="highlight">${highlighted}</span>`;
      lastIndex = range.end;
    }
    result += escapeHtml(text.slice(lastIndex));
    return result;
  }

  // Update overlay highlights on input event
  function update() {
    const text = inputBox.value;
    const matches = analyze(text);
    outputBox.innerHTML = render(text, matches);
  }

  inputBox.addEventListener("input", update);

  update(); // initialize highlight overlay
});
