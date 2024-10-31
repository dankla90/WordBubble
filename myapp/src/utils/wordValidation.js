export function validateWord(word, possibleWords) {
    return word.length > 3 && possibleWords.includes(word);
}
