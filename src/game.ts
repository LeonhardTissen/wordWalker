import { getHint, verifyWord } from "./verifyWord";

enum Direction {
	Up,
	Down,
	Right,
	Left,
}

let currentWord: string = '';
let targetLength: number = 5;
let currentDirection: Direction = Direction.Right;
let knowsAboutGoingLeft: boolean = false;
let score: number = 0;

const nextDirections: Array<Direction> = [
	Direction.Right,
	Direction.Down,
	Direction.Right,
	Direction.Up,
	Direction.Right,
	Direction.Down,
	Direction.Right,
	Direction.Up,
	Direction.Right,
	Direction.Down,
	Direction.Right,
	Direction.Down,
	Direction.Right,
	Direction.Down,
	Direction.Left,
	Direction.Down,
	Direction.Left,
	Direction.Up,
	Direction.Left,
	Direction.Down,
	Direction.Left,
	Direction.Down,
	Direction.Right,
	Direction.Down,
];
let currentPosX: number = 50;
let currentPosY: number = 50;

const wordHistory: Array<string> = [];

const validCharacters = 'abcdefghijklmnopqrstuvwxyz';

export function pressBackspace(): void {
	if (currentWord.length <= 1) return;

	currentWord = currentWord.slice(0, -1);

	emptyLetterBox(currentPosX, currentPosY);
	switch (currentDirection) {
		case Direction.Up:
			currentPosY ++;
			break;
		case Direction.Down:
			currentPosY --;
			break;
		case Direction.Right:
			currentPosX --;
			break;
		case Direction.Left:
			currentPosX ++;
			break;
	}
	updateCameraPos();

	updateGame();
}

export function pressLetter(key: string): void {
	if (currentWord.length >= targetLength) return;

	currentWord += key;
	switch (currentDirection) {
		case Direction.Up:
			currentPosY --;
			break;
		case Direction.Down:
			currentPosY ++;
			break;
		case Direction.Right:
			currentPosX ++;
			break;
		case Direction.Left:
			currentPosX --;
			break;
	}
	updateCameraPos();
	fillLetterBox(currentPosX, currentPosY, key);

	updateGame();
}

async function updateGame() {
	const isBack = isGoingBack();
	const wordToCheck = currentWord;
	const wordOriented = isBack ? reverseString(currentWord) : currentWord;
	if (currentWord.length === targetLength) {

		let validWord: string | null = null;
		if (isBack) {
			if (await verifyWord(wordToCheck)) {
				validWord = wordToCheck;
			} else if (await verifyWord(reverseString(wordToCheck))) {
				validWord = reverseString(wordToCheck);
			}
		} else {
			if (await verifyWord(wordToCheck)) {
				validWord = wordToCheck;
			}
		}

		if (validWord === null) {

			alert(`Not a valid word!`);

		} else {

			if (wordHistory.includes(validWord)) {

				alert(`${validWord} has already been used!`);

			} else {
				markCurrentWordAsCorrect();

				wordHistory.push(validWord);
				score += countPoints(validWord);
				updateStats();
				
				currentDirection = nextDirections[wordHistory.length % nextDirections.length];
				
				// Keep last letter
				currentWord = currentWord.slice(-1);
				
				// Change target length to 5 - 10
				targetLength = Math.floor(Math.random() * 6) + 5;
	
				spawnLetterBoxSnake(currentPosX, currentPosY, targetLength, currentDirection);

			}

		}
	}

	// const hint = await getHint(wordOriented, targetLength, isGoingBack());
	// if (hint !== undefined) {
	// 	console.log(`Hint: ${hint}`);
	// }
}

document.body.addEventListener('keydown', (e) => {
	if (e.key === 'Backspace') {
		pressBackspace();
	}
	else if (validCharacters.includes(e.key)) {
		pressLetter(e.key);
	}
});

const game = document.getElementById('game') as HTMLDivElement;

const letterBoxSize = 50;

function getBoxName(x: number, y: number): string {
	return `letterBox-${x}-${y}`;
}

function spawnEmptyLetterBox(x: number, y: number): void {
	const existingLetterBox = document.getElementById(getBoxName(x, y));
	if (existingLetterBox) {
		return;
	}
	const letterBox = document.createElement('div');
	letterBox.classList.add('letterBox', `word-${wordHistory.length}`);
	letterBox.id = getBoxName(x, y);
	letterBox.style.left = `${x * letterBoxSize}px`;
	letterBox.style.top = `${y * letterBoxSize}px`;
	letterBox.style.zIndex = `${x + y}`;
	game.appendChild(letterBox);
}

function fillLetterBox(x: number, y: number, letter: string): void {
	const letterBox = document.getElementById(getBoxName(x, y));
	if (!letterBox) {
		return;
	}
	letterBox.innerText = letter;
}

function emptyLetterBox(x: number, y: number): void {
	const letterBox = document.getElementById(getBoxName(x, y));
	if (!letterBox) {
		return;
	}
	letterBox.innerText = '';
}

function spawnLetterBoxSnake(x: number, y: number, length: number, direction: Direction): void {
	for (let i = 0; i < length; i++) {
		switch (direction) {
			case Direction.Up:
				spawnEmptyLetterBox(x, y - i);
				break;
			case Direction.Down:
				spawnEmptyLetterBox(x, y + i);
				break;
			case Direction.Right:
				spawnEmptyLetterBox(x + i, y);
				break;
			case Direction.Left:
				spawnEmptyLetterBox(x - i, y);
				break;
		}
	}
}

// function setCurrentPos(x: number, y: number): void {
// 	currentPosX = x;
// 	currentPosY = y;
// 	updateCameraPos();
// }

function updateCameraPos(): void {
	game.style.transform = `translate(-${currentPosX * letterBoxSize}px, -${currentPosY * letterBoxSize}px)`;
}

function reverseString(str: string): string {
	return str.split('').reverse().join('');
}

function isGoingBack(): boolean {
	return currentDirection === Direction.Left || currentDirection === Direction.Up;
}

spawnLetterBoxSnake(currentPosX + 1, currentPosY, targetLength, nextDirections[0]);
updateCameraPos();

function markCurrentWordAsCorrect(): void {
	document.querySelectorAll(`.word-${wordHistory.length}`).forEach(letterBox => {
		letterBox.classList.add('correct');
	});
}

function updateStats(): void {
	const scoreNum = document.getElementById('scoreNum') as HTMLSpanElement;
	const wordsNum = document.getElementById('wordsNum') as HTMLSpanElement;
	const lenNum = document.getElementById('lenNum') as HTMLSpanElement;
	
	scoreNum.innerText = score.toString();
	wordsNum.innerText = wordHistory.length.toString();
	lenNum.innerText = targetLength.toString();
}

const pointMap: Record<string, number> = {
	'a': 1,
	'b': 3,
	'c': 3,
	'd': 2,
	'e': 1,
	'f': 4,
	'g': 2,
	'h': 4,
	'i': 1,
	'j': 8,
	'k': 5,
	'l': 1,
	'm': 3,
	'n': 1,
	'o': 1,
	'p': 3,
	'q': 10,
	'r': 1,
	's': 1,
	't': 1,
	'u': 1,
	'v': 4,
	'w': 4,
	'x': 8,
	'y': 4,
	'z': 10,
}

function countPoints(word: string): number {
	let points = 0;
	for (const letter of word) {
		points += pointMap[letter.toLowerCase()];
	}
	return points;
}

const isMobile = 'ontouchstart' in document.documentElement;

if (!isMobile) {
	const onScreenKeyboard = document.getElementById('onScreenKeyboard') as HTMLDivElement;
	onScreenKeyboard.style.display = 'none';
}
