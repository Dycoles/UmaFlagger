console.log("script.js loaded");

const banned = ["ho "];

const analyzeButton = document.getElementById("analyze");
const inputBox = document.getElementById("input");
const outputBox = document.getElementById("output");

console.log("Elements:", {
  analyzeButton,
  inputBox,
  outputBox
});

analyzeButton.addEventListener("click", () => {
  const text = inputBox.value;

  console.log("Analyze clicked");
  console.log("Input text:", JSON.stringify(text));

  const matches = analyze(text);

  console.log("Matches found:", matches);

  const rendered = render(text, matches);
  outputBox.innerHTML = rendered;
});

function analyze(text) {
  console.log("Running analyze()");

  let matches = [];
  const lower = text.toLowerCase();

  banned.forEach(pattern => {
    console.log("Checking pattern:", JSON.stringify(pattern));

    let index = 0;
    while ((index = lower.indexOf(pattern, index)) !== -1) {
      console.log(
        "Match found at",
        index,
        "→",
        index + pattern.length,
        "substring:",
        JSON.stringify(text.slice(index, index + pattern.length))
      );

      matches.push({
        start: index,
        end: index + pattern.length
      });

      index += 1;
    }
  });

  return matches;
}

function render(text, matches) {
  console.log("Rendering output");

  let result = text;

  matches
    .sort((a, b) => b.start - a.start)
    .forEach(m => {
      const raw = text.slice(m.start, m.end);
      const visible = raw.replace(/ /g, "_");

      console.log("Rendering highlight:", visible);

      result =
        result.slice(0, m.start) +
        `<span class="highlight">${visible}</span>` +
        result.slice(m.end);
    });

  return result;
}
