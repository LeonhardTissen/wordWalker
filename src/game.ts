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
let currentPosX: number = 0;
let currentPosY: number = 50;

const wordHistory: Array<string> = [];

const validCharacters = 'abcdefghijklmnopqrstuvwxyz';

document.body.addEventListener('keydown', (e) => {
	if (e.key === 'Backspace' && currentWord.length > 1) {
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
	}
	else if (validCharacters.includes(e.key) && currentWord.length < targetLength) {
		currentWord += e.key;
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
		fillLetterBox(currentPosX, currentPosY, e.key);
	}

	if (currentWord.length === targetLength) {
		const wordToCheck = currentDirection === Direction.Left ? currentWord.split('').reverse().join('') : currentWord;

		const isValidWord = verifyWord(wordToCheck);

		if (!isValidWord) {

			alert(`${wordToCheck} is not a valid word!`);

		} else {

			if (wordHistory.includes(wordToCheck)) {

				alert(`${wordToCheck} has already been used!`);

			} else {
				
				wordHistory.push(wordToCheck);
				currentDirection = nextDirections[wordHistory.length % nextDirections.length];
				
				// Keep last letter
				currentWord = currentWord.slice(-1);
				
				// Change target length to 5 - 10
				targetLength = Math.floor(Math.random() * 6) + 5;
	
				spawnLetterBoxSnake(currentPosX, currentPosY, targetLength, currentDirection);

			}

		}
	}

	const hint = getHint(currentWord, targetLength)
	if (hint !== undefined) {
		console.log(`Hint: ${hint}`);
	}

	if (currentDirection === Direction.Left && !knowsAboutGoingLeft) {
		alert('When going left, you need to type the word backwards and it needs to end with the last letter of the previous word');
		knowsAboutGoingLeft = true;
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
	letterBox.classList.add('letterBox');
	letterBox.id = getBoxName(x, y);
	letterBox.style.left = `${x * letterBoxSize}px`;
	letterBox.style.top = `${y * letterBoxSize}px`;
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

function setCurrentPos(x: number, y: number): void {
	currentPosX = x;
	currentPosY = y;
	updateCameraPos();
}

function updateCameraPos(): void {
	game.style.transform = `translate(-${currentPosX * letterBoxSize}px, -${currentPosY * letterBoxSize}px)`;
}

spawnLetterBoxSnake(currentPosX + 1, currentPosY, targetLength, nextDirections[0]);
updateCameraPos();
