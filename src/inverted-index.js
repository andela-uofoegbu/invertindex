function Index() {
	/**
	 * {
	 * 	file: {
	 * 		name: 'name of file',
	 * 		books: <all books for this file>,
	 * 		index: <index based on the books in this file>
	 * 	}
	 * }
	 */
	// this.allBooks = [];
	this.files = {};


	this.createIndex = function (filename) {
		let file = this.files[filename];
		const indexObject = {};
		let wordList = deleteDuplicate(file).sort();
		wordList.shift();
		for (let i in wordList) {
			for (let j = 0; j < file.books.length; j++) {
				var re = new RegExp(wordList[i], 'i');
				if (re.test(file.books[j].text)) {
					if (indexObject[wordList[i]]) {
						indexObject[wordList[i]].push(j);
					} else {
						indexObject[wordList[i]] = [j]
					}
				}
			}
		}
		file['index'] = indexObject;
	};

	this.searchIndex = function (terms, filepath) {
		var termsArr = removePunctuation(terms).split(" ");
		var subResult = {};
		if (filepath) {
			for (index in termsArr) {
					subResult[termsArr[index]] = this.files[filepath].index[termsArr[index]];
			}
				return subResult;
		} else {
			return searchAll(terms, this.files); // pass this.files as parameter because private function
		}

	};

	function searchAll(terms, allfiles) {
		console.log(terms);
		var termsArr = removePunctuation(terms).split(" ");
		var subResult = {};
		for (filename in allfiles) {
				for (index in termsArr) {
					subResult[termsArr[index]] = allfiles[filename].index[termsArr[index]];
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
			for(filename in this.files){
				localIndex.push(this.files[filename].index);
			}
			for(index in localIndex){
				mergedIndex = Object.assign(mergedIndex, localIndex[index]); // to merge all indexes
			}
			return mergedIndex;
		}
	}


	function getAllBooks() {
		for (filename in this.files) {
			console.log(this.files[filename].index);;
		}
		// var booksKeys = Object.keys(this.files.index);

	}

	this.indexAllBooks = function () {

	}

	this.isValidJSON = (array) => {
		if (typeof array !== 'object' || array.length === 0) {
			return false;
		}
		try {
			if (array.length > 1) {
				array.forEach((item) => {
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

	function removePunctuation(data) {
		return data.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, " ").replace(/\s+/g, ' ').toLowerCase();
	};

	// Function to concatenate all books text, remove punctuation and extra spaces, split into array and delete duplicate
	function deleteDuplicate(file) {
		var bookString = "";
		let books = file.books;
		for (let i = 0; i < books.length; i++) {
			bookString += " " + books[i].text;
		}

		bookString = removePunctuation(bookString).split(" ");

		return bookString.filter((item, index, arr) => {
			return arr.indexOf(item) == index; //test to check for duplicate. If Index of current object is equals to index
		});
	}
}

module.exports=Index;