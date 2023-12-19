import { getHint, verifyWord } from "./verifyWord";

const cvs = document.getElementById("game") as HTMLCanvasElement;
const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;

let currentWord: string = '';
let targetLength: number = 5;

const wordHistory: Array<string> = [];

const validCharacters = 'abcdefghijklmnopqrstuvwxyz';

document.body.addEventListener('keydown', (e) => {
	if (e.key === 'Backspace' && currentWord.length > 1) {
		currentWord = currentWord.slice(0, -1);
	}
	else if (validCharacters.includes(e.key) && currentWord.length < targetLength) {
		currentWord += e.key;
	}

	console.log(currentWord.padEnd(targetLength, '_'));

	if (currentWord.length === targetLength) {
		const isValidWord = verifyWord(currentWord);

		if (isValidWord && !wordHistory.includes(currentWord)) {
			// Green text console log
			console.log(`%cCorrect`, 'color: green');
			wordHistory.push(currentWord);

			// Keep last letter
			currentWord = currentWord.slice(-1);
			console.log(currentWord.padEnd(targetLength, '_'));

			// Change target length to 5 - 10
			targetLength = Math.floor(Math.random() * 6) + 5;
			console.log('%cNew target length: ' + targetLength, 'color: yellow')
		} else {
			console.log(`%cFalse`, 'color: red');
		}
	}

	const hint = getHint(currentWord, targetLength)
	if (hint !== undefined) {
		console.log(`Hint: ${hint}`);
	}
});

function updateScreen() {
	cvs.width = window.innerWidth;
	cvs.height = window.innerHeight;
}

updateScreen();
window.addEventListener("resize", updateScreen);

function draw() {
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	requestAnimationFrame(draw);
}

draw();