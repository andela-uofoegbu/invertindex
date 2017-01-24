
let removePunctuation = data => data.replace(new RegExp("\\s+|[`~!@#$%^&*()_|+-=?;:'\",\\.<>{}\\[\\]\\/\\\\]", 'g'), " ").toLowerCase();

let deleteDuplicate = (file) => {
  let bookString = "";
  let books = file.allBooks ? file.allBooks : file.books;
  for (let i = 0; i < books.length; i++) {
    bookString += ` ${books[i].text}`;
  }
  bookString = removePunctuation(bookString).split(" ");

  return bookString.filter((item, index, arr) => arr.indexOf(item) === index
			// test to check for duplicate. If Index of current object is equals to index
  );
};


class Index {
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

  constructor() {
    this.files = {};
  }

	/** Create Index
	 * Creates an index from file(s) uploaded
	 *
	 * @param {String} filename
	 * @param {Object} files
	 */

  createIndex(filename, files) {
    let file = filename ? this.files[filename] : files;
    let books = filename ? this.files[filename].books : files.allBooks;
    const indexObject = {};
    let wordList = deleteDuplicate(file).sort().join(' ').toLowerCase()
		.split(' ');
    wordList.shift();
    for (let i in wordList) {
      for (let j = 0; j < books.length; j++) {
        let re = new RegExp(`\\b${wordList[i]}\\b`, 'i');
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
  }

	/** Search Index
	 *
	 *  takes a string and returns an object with the book position of the string
	 *
	 * @param {String} terms
	 * @param {String} filepath
	 * @returns {Object}
	 *
	 *
	 */

  searchIndex(terms, filepath) {
    let termsArr = removePunctuation(terms).split(' ');
    let subResult = {};
    if (filepath) {
      for (let index in termsArr) {
        if (this.files[filepath].index[termsArr[index]]){
          subResult[termsArr[index]] = this.files[filepath].index[termsArr[index]];
        }
        else {
          subResult[termsArr[index]] = [];
        }
      }
      return subResult;
    }
    return this.searchAll(terms, this.files);
  }

	/**
	 * Search all
	 *
	 * If particular file is not selected, it returns search results from all
	 * files
	 *
	 * @param {String} terms
	 * @returns {Object}
	 *
	 *
	 */

  searchAll(terms) {
    let termsArr = removePunctuation(terms).split(" ");
    !this.files.index ? this.collateBooks() : null;
    let allIndex = this.files.index;
    let subResult = {};
    for (let index in termsArr) {
      for (let indexedWord in allIndex) {
        if (termsArr[index] === indexedWord) {
          subResult[termsArr[index]] = allIndex[indexedWord];
        }
      }
    }
    return subResult;
  }

	/** Get index
	 *
	 * takes filename and returns index for that particular file
	 *
	 * @param {String} filename
	 * @returns {Object}
	 *
	 *
	 */
  getIndex(filename) {
    filename = filename || false;
    if (filename) {
      return this.files[filename].index;
    }
  }

/** Get all Books
	 *
	 * sets key with value containing all the books
	 * @returns {Object}
	 *
	 *
	 */
  getAllBooks() {
    let booksall = [];
    for (let filename in this.files) {
      if (filename !== 'allBooks' && filename !== 'index') {
        booksall = booksall.concat(this.files[filename].books);
      }
    }
    this.files['allBooks'] = booksall;
  }

  collateBooks() {
    this.getAllBooks();
    this.createIndex(null, this.files);
  }

  getAllIndex() {
    return this.files.index;
  }

  isValidJSON(uploadedFile) {
    let isValid = true;
    let file;
    try {
      file = JSON.parse(uploadedFile);
      if (Array.isArray(file)) {
        file.forEach((item) => {
          if (!item.hasOwnProperty('title') || !item.hasOwnProperty('text')) {
            isValid = false;
          }
        });
      } else if (!file.hasOwnProperty('title') || !file.hasOwnProperty('text')) {
        isValid = false;
      }
    } catch (error) {
      throw new Error("JSON file invalid");
    }
    return isValid ? file : isValid;
  }
}

module.exports = Index;
