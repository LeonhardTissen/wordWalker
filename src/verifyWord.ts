const api = 'https://wild-erin-harp-seal-vest.cyclic.app/ww';

export async function verifyWord(word: string): Promise<boolean> {
	const response = await fetch(`${api}/check?word=${word}`);
	const responseObject = await response.json();
	return responseObject.result;
}

export async function getHint(wordStart: string, totalLength: number, isReverse: boolean = false): Promise<string | undefined> {
	const response = await fetch(`${api}/match?word=${wordStart}&length=${totalLength}&reverse=${isReverse}`);
	const responseObject = await response.json();
	return responseObject.matching_word || responseObject.message;
}
