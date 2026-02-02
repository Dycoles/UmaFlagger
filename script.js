console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  /* =========================
     CONFIG
  ========================= */

  const bannedWords = [
    "ho",
    "banned"
  ];

  /* =========================
     PATTERN GENERATION
  ========================= */

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

  /* =========================
     DOM
  ========================= */

  const analyzeButton = document.getElementById("analyze");
  const inputBox = document.getElementById("input");
  const outputBox = document.getElementById("output");

  console.log("DOM elements:", {
    analyzeButton,
    inputBox,
    outputBox
  });

  if (!analyzeButton || !inputBox || !outputBox) {
    console.error("Missing required DOM elements");
    return;
  }

  /* =========================
     ANALYSIS
  ========================= */

  function analyze(text) {
    const lower = text.toLowerCase();
    let matches = [];

    bannedPatterns.forEach(pattern => {
      let index = 0;

      while ((index = lower.indexOf(pattern, index)) !== -1) {
        console.log(
          `[MATCH] "${pattern}" @ ${index}-${index + pattern.length}`,
          `"${text.slice(index, index + pattern.length)}"`
        );

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

  /* =========================
     RENDER
  ========================= */

  function render(text, matches) {
    let result = text;

    matches
      .sort((a, b) => b.start - a.start)
      .forEach(m => {
        const raw = text.slice(m.start, m.end);
        const visible = raw.replace(/ /g, "_");

        result =
          result.slice(0, m.start) +
          `<span class="highlight" title="${m.pattern.replace(/ /g, "_")}">${visible}</span>` +
          result.slice(m.end);
      });

    return result;
  }

  /* =========================
     EVENT
  ========================= */

  analyzeButton.addEventListener("click", () => {
    console.log("Analyze clicked");

    const text = inputBox.value;
    const matches = analyze(text);

    console.log("Matches:", matches);
    outputBox.innerHTML = render(text, matches);
  });
});
