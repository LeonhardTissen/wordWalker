import { verifyWord } from "./verifyWord";

const cvs = document.getElementById("game") as HTMLCanvasElement;
const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;

let lastWord: string = '';
let currentWord: string = '';
let targetLength: number = 5;

const validCharacters = 'abcdefghijklmnopqrstuvwxyz';

document.body.addEventListener('keydown', (e) => {
	if (e.key === 'Backspace') {
		currentWord = currentWord.slice(0, -1);
	}
	else if (validCharacters.includes(e.key) && currentWord.length < targetLength) {
		currentWord += e.key;
	}

	if (currentWord.length === targetLength) {
		const isValidWord = verifyWord(currentWord);

		console.log(currentWord, isValidWord);
	}
});
