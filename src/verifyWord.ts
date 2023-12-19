import wordList5 from './wordlists/words_alpha_filtered_5.json';
import wordList6 from './wordlists/words_alpha_filtered_6.json';
import wordList7 from './wordlists/words_alpha_filtered_7.json';
import wordList8 from './wordlists/words_alpha_filtered_8.json';
import wordList9 from './wordlists/words_alpha_filtered_9.json';
import wordList10 from './wordlists/words_alpha_filtered_10.json';

const wordListMap: Record<number, Array<string>> = {
	5: wordList5,
	6: wordList6,
	7: wordList7,
	8: wordList8,
	9: wordList9,
	10: wordList10,
}

export function verifyWord(word: string): boolean {
	const wordList = wordListMap[word.length];
	return wordList.includes(word.toLowerCase());
}