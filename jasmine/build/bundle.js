(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Index = require ("../../src/inverted-index.js");
const indexInstance = new Index();

describe('Book Indexer', () => {
  const filename = "books.json";
  const books = [
    {
      title: 'Alice in Wonderland',
      text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
    },

    {
      title: 'The Lord of the Rings: The Fellowship of the Ring.',
      text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
    }
  ];

  let refinedName = filename.replace(/\.json/g, '').replace(/\s/g, '');

  indexInstance.files[refinedName] = {};
  indexInstance.files[refinedName]['name'] = filename;
  indexInstance.files[refinedName]['books'] = books;
  indexInstance.createIndex(refinedName);
  describe('Read Book data', () => {
    it('should be valid JSON', () => {
      expect(indexInstance.isValidJSON('[{"hello":"false"}]')).toBe(false);
      expect(indexInstance.isValidJSON(JSON.stringify(books))).toEqual(books);
    });
    it('should not be empty', () => {
      expect(indexInstance.isValidJSON(JSON.stringify(books)).length).not.toBe(0);
      expect(indexInstance.isValidJSON(JSON.stringify(books)).length).toBe(2);
    });
  });

  describe('Populate Index', () => {
    it('should create index once JSON file has been read', () => {
      expect(indexInstance.getIndex(refinedName)).not.toBeUndefined();
      expect(indexInstance.getIndex(refinedName).length).not.toBe(0);
      expect(indexInstance.getIndex(refinedName)).toBeDefined();
    });

    it('should be correct index', () => {
      expect(indexInstance.getIndex(refinedName)).toEqual({ a: [0, 1], alice: [0], alliance: [1], an: [1], and: [0, 1], destroy: [1], dwarf: [1], elf: [1], enters: [0], falls: [0], full: [0], hobbit: [1], hole: [0], imagination: [0], into: [0], man: [1], of: [0, 1], powerful: [1], rabbit: [0], ring: [1], seek: [1], to: [1], unusual: [1], wizard: [1], world: [0] });
      expect(indexInstance.getIndex(refinedName).length).not.toEqual(0);
      expect(indexInstance.getIndex(refinedName)).toBeDefined();
    });
  });

  describe('Search index', () => {
    it('should return the correct results of the search', () => {
      expect(indexInstance.searchIndex('Alice', refinedName)).toEqual({ alice: [0] });
      expect(indexInstance.searchIndex('a')).toEqual({ a: [0, 1] });
      expect(indexInstance.searchIndex('alliance')).toEqual({ alliance: [1] });
    });

    it('should handle a varied number of search terms as arguments', () => {
      expect(indexInstance.searchIndex('lord rabbit man dwarf')).toEqual({ lord: [], rabbit: [0], man: [1], dwarf: [1] });
      expect(indexInstance.searchIndex('a of elf')).toEqual({ a: [0, 1], of: [0, 1], elf: [1] });
    });
  });
});

},{"../../src/inverted-index.js":2}],2:[function(require,module,exports){
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
  static removePunctuation(data) {
    return data.replace(new RegExp("\\s+|[`~!@#$%^&*()_|+-=?;:'\",\\.<>{}\\[\\]\\/\\\\]", 'g'), " ").toLowerCase();
  }
  static deleteDuplicate(file) {
    let bookString = "";
    let books = file.allBooks ? file.allBooks : file.books;
    for (let i = 0; i < books.length; i++) {
      bookString += ` ${books[i].text}`;
    }
    bookString = Index.removePunctuation(bookString).split(" ");

    return bookString.filter((item, index, arr) => arr.indexOf(item) === index
			// test to check for duplicate. If Index of current object is equals to index
  );
  }

  createIndex(filename, files) {
    let file = filename ? this.files[filename] : files;
    let books = filename ? this.files[filename].books : files.allBooks;
    const indexObject = {};
    let wordList = Index.deleteDuplicate(file).sort().join(' ').toLowerCase()
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
    let termsArr = Index.removePunctuation(terms).split(' ');
    let subResult = {};
    if (filepath) {
      for (let index in termsArr) {
        if (this.files[filepath].index[termsArr[index]]) {
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
    let termsArr = Index.removePunctuation(terms).split(" ");
    !this.files.index ? this.collateBooks() : null;
    let allIndex = this.files.index;
    let subResult = {};
    for (let index in termsArr) {
      for (let indexedWord in allIndex) {
        if (termsArr[index] === indexedWord) {
          subResult[termsArr[index]] = allIndex[indexedWord];
        }
      }
      if (!subResult[termsArr[index]]) {
        subResult[termsArr[index]] = [];
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

/** Get all Index
	 *
	 * returns index of all books in all files
	 * @returns {Object}
	 *
	 *
	 */
  getAllIndex() {
    return this.files.index;
  }

/** Get all Index
	 *
	 * Checks if contents of file uploaded is in the correct JSON
	 * format with a title and text property returns true or false
	 *
	 * @param uploadedFile
	 * @returns {bool}
	 *
	 *
	 */
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

},{}]},{},[1])