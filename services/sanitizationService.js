const dbEscapeCharacters = [
  '{',
  '}',
  '(',
  ')',
  '[',
  ']',
  '/',
  '\\',
  '$',
  '%',
  '*',
  '+',
  "'",
  '"',
  '!',
  '@',
  '#',
  '^',
  ':',
  '.',
  ',',
];

module.exports.sanitizeCharacters = function (searchKeyWord) {
  let search = searchKeyWord;
  for (let i = 0; i < dbEscapeCharacters.length; i++) {
    const regex = new RegExp(`\\${dbEscapeCharacters[i]}`, 'g');
    search = search.replace(regex, `\\${dbEscapeCharacters[i]}`);
  }
  return search;
};
