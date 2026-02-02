console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("input");
  const outputBox = document.getElementById("highlighted");

  // List of banned words (lowercase)
  const bannedWords = [
    "ho",
    "banned"
  ];

  // Escape regex special chars
  function escapeRegex(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  // Create regex that matches word with optional spaces inside,
  // and boundaries at start (^ or whitespace) and end (whitespace or $)
  function makeRegexForWord(word) {
    const letters = [...word].map(escapeRegex);
    const pattern = letters.join('\\s*');
    return new RegExp(`(?:^|\\s)${pattern}(?:\\s|$)`, 'gi'); // g & i for global and case-insensitive
  }

  const bannedRegexes = bannedWords.map(makeRegexForWord);
  console.log("Compiled banned regexes:", bannedRegexes);

  // Analyze text and find matches of banned words
  function analyze(text) {
    let matches = [];

    bannedRegexes.forEach(regex => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index + (match[0].match(/^\s/) ? 1 : 0), // skip leading space if matched
          end: regex.lastIndex,
          pattern: regex.source
        });

        // To avoid infinite loop on zero-length matches
        if (regex.lastIndex === match.index) {
          regex.lastIndex++;
        }
      }
    });

    return matches;
  }

  // Merge overlapping or adjacent matches
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

  // Escape HTML special characters to prevent injection and broken tags
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  // Render text with highlight spans replacing spaces with underscores inside highlights
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

  // Update highlight overlay on every input event
  function update() {
    const text = inputBox.value;
    const matches = analyze(text);
    outputBox.innerHTML = render(text, matches);
  }

  inputBox.addEventListener("input", update);

  // Initial highlight (empty)
  update();
});
