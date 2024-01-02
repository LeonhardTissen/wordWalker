export async function verifyWord(word: string): Promise<boolean> {
	const response = await fetch(`https://wild-erin-harp-seal-vest.cyclic.app/ww/check?word=${word}`);
	const text = await response.text();
	return text === 'true';
}

export async function getHint(wordStart: string, totalLength: number, isReverse: boolean = false): Promise<string | undefined> {
	const response = await fetch(`https://wild-erin-harp-seal-vest.cyclic.app/ww/match?word=${wordStart}&length=${totalLength}&reverse=${isReverse}`);
	const text = await response.text();
	return text === 'No matching word found' ? undefined : text;
}
