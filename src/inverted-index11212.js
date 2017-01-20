/*jshint esversion: 6 */
"use strict";
let duplicateFound;

var output = [];

var fileUploadedLists = {};
//watch for change on the
function readFiles() {
	var fileInput = document.getElementById('fileInput');
	var textType = /.json/;
	var files = fileInput.files;

	for (var i = 0, f; f = files[i]; i++) {
		var reader = new FileReader();

		reader.onload = function(es) {
			console.log(typeof JSON.parse(es.target.result));
		};

		if(!fileUploadedLists[f.name]) {
			reader.readAsText(f);
			fileUploadedLists[f.name] = true;
			output.push('<li>' + f.name + '   <button onclick="this.createIndex()" class="btn createindexbtn">Create Index</button></li>');
		}

	}

	console.log(fileUploadedLists);
	document.getElementById('fileDisplayArea').innerHTML = '<ul>' + output.join('') + '</ul>';

}

//Remove Duplicate words from Index
function deleteDuplicate(array) {
	let uniqueList = [];
	duplicateFound = false;
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < uniqueList.length; j++) {
			if (array[i] != uniqueList[j]) {

			} else {
				duplicateFound = true;
			}
		}

		if (!duplicateFound) {
			uniqueList.push(array[i]);

		}

		duplicateFound = false;
	}

	return uniqueList;

}

//Check if JSON object is empty
function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

//Index Object
function index() {
	this.indexArray = {};
	let indexArray = this.indexArray;
	let wordlist = "";

	//List of common english words with no particular meaning
	let stopWords = [''
		//'a',
		//    'about',
		//    'above',
		//    'after',
		//    'again',
		//    'against',
		//    'all',
		//    'am',
		//    'an',
		//    'and',
		//    'any',
		//    'are',
		//    "aren't",
		//    'as',
		//    'at',
		//    'be',
		//    'because',
		//    'been',
		//    'before',
		//    'being',
		//    'below',
		//    'between',
		//    'both',
		//    'but',
		//    'by',
		//    "can't",
		//    'cannot',
		//    'could',
		//    "couldn't",
		//    'did',
		//    "didn't",
		//    'do',
		//    'does',
		//    "doesn't",
		//    'doing',
		//    "don't",
		//    'down',
		//    'during',
		//    'each',
		//    'few',
		//    'for',
		//    'from',
		//    'further',
		//    'had',
		//    "hadn't",
		//    'has',
		//    "hasn't",
		//    'have',
		//    "haven't",
		//    'having',
		//    'he',
		//    "he'd",
		//    "he'll",
		//    "he's",
		//    'her',
		//    'here',
		//    "here's",
		//    'hers',
		//    'herself',
		//    'him',
		//    'himself',
		//    'his',
		//    'how',
		//    "how's",
		//    'i',
		//    "i'd",
		//    "i'll",
		//    "i'm",
		//    "i've",
		//    'if',
		//    'in',
		//    'into',
		//    'is',
		//    "isn't",
		//    'it',
		//    "it's",
		//    'its',
		//    'itself',
		//    "let's",
		//    'me',
		//    'more',
		//    'most',
		//    "mustn't",
		//    'my',
		//    'myself',
		//    'no',
		//    'nor',
		//    'not',
		//    'of',
		//    'off',
		//    'on',
		//    'once',
		//    'only',
		//    'or',
		//    'other',
		//    'ought',
		//    'our',
		//    'ours',
		//    'ourselves',
		//    'out',
		//    'over',
		//    'own',
		//    'same',
		//    "shan't",
		//    'she',
		//    "she'd",
		//    "she'll",
		//    "she's",
		//    'should',
		//    "shouldn't",
		//    'so',
		//    'some',
		//    'such',
		//    'than',
		//    'that',
		//    "that's",
		//    'the',
		//    'their',
		//    'theirs',
		//    'them',
		//    'themselves',
		//    'then',
		//    'there',
		//    "there's",
		//    'these',
		//    'they',
		//    "they'd",
		//    "they'll",
		//    "they're",
		//    "they've",
		//    'this',
		//    'those',
		//    'through',
		//    'to',
		//    'too',
		//    'under',
		//    'until',
		//    'up',
		//    'very',
		//    'was',
		//    "wasn't",
		//    'we',
		//    "we'd",
		//    "we'll",
		//    "we're",
		//    "we've",
		//    'were',
		//    "weren't",
		//    'what',
		//    "what's",
		//    'when',
		//    "when's",
		//    'where',
		//    "where's",
		//    'which',
		//    'while',
		//    'who',
		//    "who's",
		//    'whom',
		//    'why',
		//    "why's",
		//    'with',
		//    "won't",
		//    'would',
		//    "wouldn't",
		//    'you',
		//    "you'd",
		//    "you'll",
		//    "you're",
		//    "you've",
		//    'your',
		//    'yours',
		//    'yourself',
		//    'yourselves'
	];

	// Function to create list of all unique words in JSON file
	this.createIndex = function (filePath) {

		let doclist = [];

		if (isEmpty(data)) {
			throw "Error: Empty JSON Object";
			return;
		}

		if (IsValidJson(data)) {
			let dataText = JSON.parse(data);
			data = '';

			for (var i = 0; i < dataText.length; i++) {
				data += dataText[i].text;
			}

			data = data.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, " ");
			data = data.replace(/\s+/g, ' ');
			data = data.toLowerCase();
			wordlist = data.split(' ');

			wordlist = deleteDuplicate(wordlist);


			wordlist = wordlist.sort();

			duplicateFound = false;

			//Remove List of common english words without particular meaning

			for (i = 0; i < wordlist.length; i++) {

				for (let j = 0; j < stopWords.length; j++) {

					if (wordlist[i] == stopWords[j]) {
						wordlist.splice(i, 1);
					}
				}
			}

			for (i = 0; i < wordlist.length; i++) {
				for (let j = 0; j < dataText.length; j++) {


					if (dataText[j].text.toLowerCase().includes(wordlist[i])) {


						for (let k = 0; k < doclist.length; k++) {
							if (j == doclist[k]) {
								duplicateFound = true;
							}

						}

						if (!duplicateFound) {
							doclist.push(j);

						}
						duplicateFound = false;
					}


				}

				if (doclist.length >= 0) {

					indexArray[wordlist[i]] = doclist;

				}
				doclist = [];

			}
		} else {
			throw "ERROR! Invalid JSON file"
		}

	};

	// Function to get Index and display to User
	this.getIndex = function (document) {
		this.createIndex(document);
		if (wordlist == -1) {
			return "Error: Empty JSON Object";
		} else if (wordlist == -2) {
			return "ERROR! Invalid JSON file";
		} else {
			return this.indexArray;
		}
	};

	//search Index
	this.searchIndex = function (terms) {
		terms = terms.split(" ");
		let results = [];

		for (let i = 0; i < terms.length; i++) {

			if (indexArray.hasOwnProperty(terms[i])) {
				results.push(indexArray[terms[i]]);

			}

		}
		return results;
	};

}
