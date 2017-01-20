/*jshint esversion: 6 */
"use strict";

//Index Object
function Index() {
	let wordlist = "";
	this.allBooks = [];
	this.indexObject = {};
	let books = this.allBooks;
	// this.searchResults = {};
	// let indexObject = this.indexObject;


	// Function to create list of all unique words in JSON file
	this.createIndex = () => {
		if (books.length > 0) {

				wordlist = deleteDuplicate().sort();
				wordlist.shift();

				for (let i = 0; i < wordlist.length; i++) {
					for (let j = 0; j < books.length; j++) {
						var re = new RegExp(wordlist[i], 'i');
						if(re.test(books[j].text)) {
							if(this.indexObject[wordlist[i]]) {
								this.indexObject[wordlist[i]].push(j);
							} else {
								this.indexObject[wordlist[i]] = [j]
							}
						}
					}
				}
		}
	}

	function removePunctuation(data) {
		return data.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, " ").replace(/\s+/g, ' ').toLowerCase();
	};

	function deleteDuplicate() {
		var bookString = "";
		for (let i = 0; i < books.length; i++) {
			bookString += " " + books[i].text;
		}

		bookString = removePunctuation(bookString).split(" ");
		// for (var i = 0; i < books.length; i++) {
		// 	if (bookString[i]==' ') {
		// 		bookString.splice(i, 1);
		// 	}
		// }

		return bookString.filter((item, index, arr) => {
			return arr.indexOf(item) == index;
		});
	}


	// Function to get Index and display to User
	this.getIndex = () => {
		return this.indexObject;
	};

	//search Index
	this.searchIndex = (terms) => {
		let result = {};
		terms = terms.toLowerCase().split(" ");
		let keys = Object.keys(this.indexObject);
		let keyString = keys.join(" ");
		for (let i = 0; i < terms.length; i++) {
			let regexp = new RegExp(terms[i], 'i');
			if (regexp.test(keyString)) {
				result[terms[i]] = this.indexObject[terms[i]];
			}
		}
		return result;
	};

	this.reset = () => {
		location.reload();

	}

}


