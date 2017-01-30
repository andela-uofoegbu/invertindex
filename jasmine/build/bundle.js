(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=[
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
]

},{}],2:[function(require,module,exports){
const Index = require("../../src/inverted-index.js");

const books = require("../../books.json");

const indexInstance = new Index();

describe('Book Indexer', () => {
  const filename = "books.json";
  const refinedName = filename.replace(/\.json/g, '').replace(/\s/g, '');

  indexInstance.files[refinedName] = {};
  indexInstance.files[refinedName]['name'] = filename;
  indexInstance.files[refinedName]['books'] = books;
  indexInstance.createIndex(refinedName);
  indexInstance.createIndex(null, indexInstance.files);

  describe('Inverted Index class', () => {
    it('should check that Index class has a createIndex method', () => {
      expect(typeof Index.prototype.createIndex).toBe('function');
    });

    it('should check that Index class has a getIndex method', () => {
      expect(typeof Index.prototype.getIndex).toBe('function');
    });

    it('should check that Index class has a searchIndex method', () => {
      expect(typeof Index.prototype.searchIndex).toBe('function');
    });
  });


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
    it('should confirm that index is created once JSON file has been read', () => {
      expect(indexInstance.getIndex(refinedName)).not.toBeUndefined();
      expect(indexInstance.getIndex(refinedName).length).not.toBe(0);
      expect(indexInstance.getIndex(refinedName)).toBeDefined();
    });

    it('should be correct index', () => {
      expect(indexInstance.getIndex(refinedName).alice).toEqual([0]);
      expect(Object.keys(indexInstance.getIndex(refinedName)).length).toBeGreaterThan(0);
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
    it('should handle array of words as search terms', () => {
      expect(indexInstance.searchIndex(["lord", "rabbit", "man", "dwarf"])).toEqual({ lord: [], rabbit: [0], man: [1], dwarf: [1] });
    });
    it('should handle empty values as search terms', () => {
      expect(indexInstance.searchIndex([])).toEqual(false);
      expect(indexInstance.searchIndex(" ")).toEqual(false);
    });
  });
});

},{"../../books.json":1,"../../src/inverted-index.js":3}],3:[function(require,module,exports){
/**
 * Creates a new Index.
 * @class
 */

class Index {

  constructor() {
    this.files = {};
  }

  static convertToArray(data) {
    return data.toLowerCase().split(' ').sort();
  }

	/** Remove Punctuation
	 * removes punctuation from string and converts to lowercase
	 *
	 * @param {String} data
	 * @returns {String}
	 */

  static removePunctuation(data) {
    let data1 = data.replace(new RegExp("[^A-Z0-9\\s+]", 'gi'), " ");

    // remove empty array elements
    data1 = Index.convertToArray(data1);
    return data1.filter((item) => {
      if (item !== " ") return item;
    }).join(" ");
  }

	/** Delete Dupicate
	 * joins all the strings in all books in a particular file,
	 * splits into array and removes duplicates
	 *
	 * @param {Object} file
	 * @returns {Array} bookString
	 */

  static deleteDuplicate(bookArray) {
    // test to check for duplicate element
    return bookArray.filter((item, index, arr) => arr.indexOf(item) === index);
  }

  static collateBooks(files) {
    let booksall = [];
    for (const filename in files) {
      if (filename !== 'allBooks' && filename !== 'index') {
        booksall = booksall.concat(files[filename].books);
      }
    }
    return booksall;
  }
	/** Create Index
	 * Creates an index from file(s) uploaded
	 *
	 * @param {String} filename
	 * @param {Object} files
   * @returns none
	 */

  createIndex(filename, files) {
    let file, books;
    if (filename) {
      file = this.files[filename];
      books = this.files[filename].books;
    }
    else {
      this.files['allBooks'] = Index.collateBooks(files);
      file = files;
      books = files.allBooks;
    }
    const indexObject = {};

    let bookString = "";

    // concatenates all book texts
    if (books !== undefined && books !== null)
    { for (let i = 0; i < books.length; i++) {
      bookString += ` ${books[i].text}`;
    } }
    bookString = Index.removePunctuation(bookString);
    let wordList = Index.convertToArray(bookString);

    // assigns all unique words in file to wordlist as array
    wordList = Index.deleteDuplicate(wordList);
    // checks all books for existence of each word

    for (const i in wordList) {
      for (let j = 0; j < books.length; j++) {
        const re = new RegExp(`\\b${wordList[i]}\\b`, 'i');
        books[j].text = books[j].text.toLowerCase();
        if (re.test(books[j].text)) {
          if (indexObject[wordList[i]]) {
            indexObject[wordList[i]].push(j);
          } else {
            indexObject[wordList[i]] = [j];
          }
        }
      }
    }
    // create index key in file object and set value to indexObject
    file['index'] = indexObject;
  }

	/** Search Index
	 *
	 *  takes a string and returns an object with the book position of the terms
	 *
	 * @param {String} terms
	 * @param {String} filepath
	 * @returns {Object}
	 *
	 *
	 */

  searchIndex(terms, filepath) {
    if (Array.isArray(terms)) {
      terms = terms.join(" ");
    }
    let termsArr = Index.removePunctuation(terms);
    console.log(termsArr);
    if (termsArr.match('^\\s*$')) {
      return false;
    }
    termsArr = Index.convertToArray(termsArr);
    const subResult = {};
    const fileIndex = filepath ? this.files[filepath].index : this.files.index;
    for (const index in termsArr) {
      if (fileIndex[termsArr[index]]) {
        subResult[termsArr[index]] = fileIndex[termsArr[index]];
      }
      else {
        subResult[termsArr[index]] = [];
      }
    }
    return subResult;
  }

	/** Get index
	 *
	 * takes filename and returns index for a file or all files
	 *
	 * @param {String} filename
	 * @returns {Object}
	 *
	 *
	 */

  getIndex(filename) {
    if (filename) {
      return this.files[filename].index;
    }
    return this.files.index;
  }

  /** Is Valid JSON
     *
     * Checks if contents of file uploaded is in the correct JSON
     * format with a title and text property returns true or false
     *
     * @param {String} uploadedFile
     * @returns {bool} isValid
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
          if (!item.hasOwnProperty('title') && !item.hasOwnProperty('text')) {
            isValid = false;
          }
        });
      }
      else if (!file.hasOwnProperty('title') && !file.hasOwnProperty('text')) {
        isValid = false;
      }
    } catch (error) {
      throw new Error("JSON file invalid");
    }
    return isValid ? file : isValid;
  }
}

module.exports = Index;

},{}]},{},[2])