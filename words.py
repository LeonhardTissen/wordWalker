import json
import os

# Load src/wordlists/words_alpha.json
def load_words():
	with open(os.path.join(os.path.dirname(__file__), 'src/wordlists/words_alpha.json')) as word_file:
		valid_words = json.load(word_file)
	return valid_words

# Filter out words based on length
def filter_words(words, charLength):
	return [word for word in words if len(word) == charLength]

# Save it to a new json at src/wordlists/words_alpha_filtered_ending.json
def save_words(words, ending):
	with open(os.path.join(os.path.dirname(__file__), f'src/wordlists/words_alpha_filtered_{ending}.json'), 'w') as outfile:
		json.dump(words, outfile)

if __name__ == '__main__':
	words = load_words()
	save_words(filter_words(words, 5), '5')
	save_words(filter_words(words, 6), '6')
	save_words(filter_words(words, 7), '7')
	save_words(filter_words(words, 8), '8')
	save_words(filter_words(words, 9), '9')
	save_words(filter_words(words, 10), '10')