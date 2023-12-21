import { pressBackspace, pressLetter } from "./game";

const onScreenKeyboard = document.getElementById('onScreenKeyboard') as HTMLDivElement;

const keyboard = [
	['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
	[ 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'    ],
	[   'z', 'x', 'c', 'v', 'b', 'n', 'm', '<'       ],
]

export function fillKeyboard(): void {
	for (let i = 0; i < keyboard.length; i++) {
		const keyRow = document.createElement('div');
		keyRow.classList.add('keyRow');
		onScreenKeyboard.appendChild(keyRow);

		for (let j = 0; j < keyboard[i].length; j++) {
			const key = document.createElement('div');
			key.classList.add('key');
			key.innerText = keyboard[i][j];

			if (keyboard[i][j] === '<') {
				key.classList.add('backspace');

				key.addEventListener('click', () => {
					pressBackspace();
				});
			} else {
				key.addEventListener('click', () => {
					pressLetter(key.innerText);
				});
			}
			keyRow.appendChild(key);
		}
	}
}
