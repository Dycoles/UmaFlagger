const banned = ["ho"];

function analyze(text) {
  let matches = [];

  banned.forEach(word => {
    let index = 0;
    while ((index = text.toLowerCase().indexOf(word, index)) !== -1) {
      matches.push({
        start: index,
        end: index + word.length
      });
      index += 1;
    }
  });

  return matches;
}

function render(text, matches) {
  let result = text;

  matches
    .sort((a, b) => b.start - a.start)
    .forEach(m => {
      const raw = text.slice(m.start, m.end);
      const visible = raw.replace(/ /g, "_");

      result =
        result.slice(0, m.start) +
        `<span class="highlight">${visible}</span>` +
        result.slice(m.end);
    });

  return result;
}
