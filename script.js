const bannedWords = ["ho"];

document.getElementById("analyze").addEventListener("click", () => {
  const text = document.getElementById("input").value;
  const output = document.getElementById("output");

  const tokens = [...text.matchAll(/\b\w+\b/g)];
  let result = text;

  // Process from end to avoid index shifting
  tokens.reverse().forEach(match => {
    const word = match[0].toLowerCase();
    if (bannedWords.includes(word)) {
      result =
        result.slice(0, match.index) +
        `<span class="highlight">${match[0]}</span>` +
        result.slice(match.index + match[0].length);
    }
  });

  output.innerHTML = result;
});
