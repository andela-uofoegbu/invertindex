
//Index Object
function Index() {
	let wordlist = "";
	this.allBooks = []; //array to store all uploaded books
	this.indexObject = {};
	let books = this.allBooks;

	// Function to create list of all unique words in JSON file
	this.createIndex = () => {
		if (books.length > 0) {
			wordlist = deleteDuplicate().sort();
			wordlist.shift(); // to eliminate first empty array object

			for (let i = 0; i < wordlist.length; i++) {
				for (let j = 0; j < books.length; j++) {
					var re = new RegExp(wordlist[i], 'i');
					if (re.test(books[j].text)) {
						if (this.indexObject[wordlist[i]]) {
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

// Function to concatenate all books text, remove punctuation and extra spaces, split into array and delete duplicate
	function deleteDuplicate() {
		var bookString = "";
		for (let i = 0; i < books.length; i++) {
			bookString += " " + books[i].text;
		}

		bookString = removePunctuation(bookString).split(" ");

		return bookString.filter((item, index, arr) => {
			return arr.indexOf(item) == index; //test to check for duplicate. If Index of current object is equals to index
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


	this.isValidJSON = (array) => {
		if (typeof array !== 'object' || array.length === 0) {
			return false;
		}
		try {
			if (array.length > 1) {
				array.forEach((item) => {
					// console.log(array);
					if (!(item.hasOwnProperty('title') && item.hasOwnProperty('text'))) {
						return false;
					}
				});
			}
			else {

				if (!(array.hasOwnProperty('title') && item.hasOwnProperty('text'))) {
					return false;
				}
			}

			return true;
		} catch (e) {
			return false;
		}
	}
}