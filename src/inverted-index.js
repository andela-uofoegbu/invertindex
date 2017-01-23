function Index() {
	/**
	 * {
	 * 	file: {
	 * 		name: 'name of file',
	 * 		books: <all books for this file>,
	 * 		index: <index based on the books in this file>
	 * 	},
	 * 	allBooks: [],
	 * 	index: {}
	 * }
	 */
	// this.allBooks = [];
	this.files = {};


	this.createIndex = function (filename, files) {
		let file = filename ? this.files[filename] : files;
		let books = filename ? this.files[filename].books : files.allBooks;
		const indexObject = {};
		let wordList = deleteDuplicate(file).sort().join(' ').toLowerCase().split(' ');
		wordList.shift();
		for (let i in wordList) {
			for (let j = 0; j < books.length; j++) {
				var re = new RegExp("\\b"+wordList[i]+"\\b", 'i');
				if (re.test(books[j].text)) {
					if (indexObject[wordList[i]]) {
						indexObject[wordList[i]].push(j);
					} else {
						indexObject[wordList[i]] = [j];
					}
				}
			}
		}
		file['index'] = indexObject;
	};

	this.searchIndex = function (terms, filepath) {
		var termsArr = removePunctuation(terms).split(" ")
		var subResult = {};
		if (filepath) {
			for (index in termsArr) {
					subResult[termsArr[index]] = this.files[filepath].index[termsArr[index]];
			}
				return subResult;
		} else {
			return this.searchAll(terms, this.files);
		}

	};

	this.searchAll=(terms) => {
		var termsArr = removePunctuation(terms).split(" ");
		!this.files.index ? this.collateBooks() : null;
		let allIndex = this.files.index;
		var subResult = {};
		for (index in termsArr) {
				for (indexedWord in allIndex) {
					if(termsArr[index] == indexedWord) {
						subResult[termsArr[index]] = allIndex[indexedWord];
					}
				}
			}
			return subResult;
	}

	this.getIndex = function (filename) {
		filename = filename || false;
		let localIndex = [];
		let mergedIndex = {};
		if(filename){
			return this.files[filename].index;
		}
		else{

		}
	}


	this.getAllBooks = () => {
		var booksall = [];
		for (var filename in this.files) {
			booksall = booksall.concat(this.files[filename].books);
		}
		this.files['allBooks'] = booksall;
	}

	this.collateBooks = () => {
		 this.getAllBooks();
		 this.createIndex(null, this.files);
	}

	this.getAllIndex = function () {
		return this.files.index;
	}

	this.isValidJSON = (uploadedFile) => {
		let isValid = true;
		try {
			var file = JSON.parse(uploadedFile);
			if(Array.isArray(file)) {
				file.forEach((item) => {
					if (!item.hasOwnProperty('title') || !item.hasOwnProperty('text')) {
						isValid = false;
					}
				});
			} else {
				if (!file.hasOwnProperty('title') || !file.hasOwnProperty('text')) {
						isValid = false
					}
			}
		} catch (error) {
			throw new Error("JSON file invalid");
		}

		return isValid ? file : isValid;
	}

	this.isEmpty=(obj) =>{
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

	function removePunctuation(data) {
		return data.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, " ").replace(/\s+/g, ' ').toLowerCase();
	};

	// Function to concatenate all books text, remove punctuation and extra spaces, split into array and delete duplicate
	function deleteDuplicate(file) {
		var bookString = "";
		let books = file.allBooks ? file.allBooks : file.books;
		for (let i = 0; i < books.length; i++) {
			bookString += " " + books[i].text;
		}
		bookString = removePunctuation(bookString).split(" ");

		return bookString.filter((item, index, arr) => {
			return arr.indexOf(item) == index; //test to check for duplicate. If Index of current object is equals to index
		});
	}
}

module.exports = Index;