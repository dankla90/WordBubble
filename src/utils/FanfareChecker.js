export function isFanfareWorthy(word, possibleWords) {
    if (word.length < 8) return false; // Minimum length requirement.
  
    const maxLength = Math.max(...possibleWords.map(w => w.length));
    return word.length >= maxLength + 3; // Check if it's 3+ characters longer.
  }
  