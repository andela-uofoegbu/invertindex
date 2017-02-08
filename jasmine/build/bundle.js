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
const Index = require('../../src/inverted-index.js');

const books = require('../../books.json');

const indexInstance = new Index();

describe('Book Indexer', () => {
  const filename = 'books.json';
  const refinedName = filename.replace(/\.json/g, '').replace(/\s/g, '');
  indexInstance.addFiles(books, filename);

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
      expect(Index.isValidJson('[{"hello":"false"}]')).toBe(false);
      expect(Index.isValidJson(JSON.stringify(books))).toEqual(books);
    });

    it('should not be empty', () => {
      expect(Index.isValidJson(JSON.stringify(books)).length).not.toBe(0);
      expect(Index.isValidJson(JSON.stringify(books)).length).toBe(2);
    });
  });

  describe('Populate Index', () => {
    it('should confirm that index is created once JSON file has been read',
    () => {
      indexInstance.createIndex(refinedName, indexInstance
      .files[refinedName].books);

      expect(indexInstance.getIndex(refinedName)).toBeDefined();
      expect(typeof indexInstance.getIndex(refinedName)).toEqual('object');
      expect(indexInstance.getIndex(refinedName).length).not.toBe(0);
    });

    it('should be correct index', () => {
      expect(indexInstance.getIndex(refinedName).alice).toEqual([0]);
      expect(Object.keys(indexInstance.getIndex(refinedName)).length)
      .toBeGreaterThan(0);
      expect(indexInstance.getIndex(refinedName).length).not.toEqual(0);
      expect(indexInstance.getIndex(refinedName)).toBeDefined();
    });
  });

  describe('Search index', () => {
    it('should return the correct results of the search', () => {
      expect(indexInstance.searchIndex('Alice', refinedName))
      .toEqual({ books: { alice: [0] } });
      expect(indexInstance.searchIndex('a'))
      .toEqual({ books: { a: [0, 1] }, });
      expect(indexInstance.searchIndex('alliance'))
      .toEqual({ books: { alliance: [1] } });
    });

    it('should handle a varied number of search terms as arguments', () => {
      expect(indexInstance.searchIndex('lord rabbit man dwarf', refinedName))
      .toEqual({ books: { lord: [], rabbit: [0], man: [1], dwarf: [1] } });
      expect(indexInstance.searchIndex('a of elf', refinedName))
      .toEqual({ books: { a: [0, 1], of: [0, 1], elf: [1] } });
    });

    it('should handle array of words as search terms', () => {
      expect(indexInstance
      .searchIndex(['lord', [['rabbit']], ['man', 'dwarf']], refinedName))
      .toEqual({ books: { lord: [], rabbit: [0], man: [1], dwarf: [1] } });
    });

    it('should handle empty values as search terms', () => {
      expect(indexInstance.searchIndex([])).toEqual(false);
      expect(indexInstance.searchIndex(' ')).toEqual(false);
    });
  });
});

},{"../../books.json":1,"../../src/inverted-index.js":3}],3:[function(require,module,exports){
/**
 * Creates a new Index.
 * @class
 */
class Index {
  /**
   * class constructor
   * @constructor
   */
  constructor() {
    this.files = {};
  }

  /** Tokenize
  * Splits string to a sorted array of words
  *
  * @param {String} sentence
  * @returns {Array} containing unique words
  */
  static tokenize(sentence) {
    const wordString = this.removePunctuation(sentence);
    const wordList = wordString.toLowerCase().split(' ').sort();
    return this.filterWords(wordList);
  }

  /** Remove Punctuation
  * Removes non-alphanumeric characters from string
  *
  * @param {String} sentence
  * @returns {String} containing only alphanumeric characters
  */
  static removePunctuation(sentence) {
    return sentence.replace(/[^\w+\s+]/gi, ' ');
  }

  /** Filter Words
  *
  * Removes duplicate array elements and empty arrays
  *
  * @param {Array} words
  * @returns {Array} containing unique words
  */
  static filterWords(words) {
    return words.filter((item, index, list) => list
      .indexOf(item) === index && item.length > 0);
  }

  /** Get Book Text
    *
    * Concatenates text of all books
    *
    * @param {Object} books
    * @returns {String} containing text of all books
    */
  static getBookText(books) {
    return books.map(book => book.text).join(' ');
  }

  /** Create Index
  *
  * Creates Indices for files
  *
  * @param {String} fileName
  * @param {Object} books
  * @returns {null} stores index of file
  */
  createIndex(fileName, books) {
    const fileIndex = {};
    const bookText = Index.getBookText(books);
    const wordList = Index.tokenize(bookText);

  // loops through each book to check for existence of word(s)
    wordList.forEach((word) => {
      books.forEach((book, index) => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(book.text)) {
          if (fileIndex[word]) {
            fileIndex[word].push(index);
          } else {
            fileIndex[word] = [index];
          }
        }
      });
    });
    this.files[fileName].index = fileIndex;
  }

  /** Search Index
  *
  *  Searches index of file(s) for given terms
  *
  * @param {String} terms
  * @param {String} filePath
  * @returns {Object} SearchResult
  */
  searchIndex(terms, filePath) {
    const searchResult = {};
    terms = terms.toString();
    if (Index.removePunctuation(terms).match('^\\s*$')) {
      return false;
    }
    const wordList = Index.tokenize(terms);
    const fileKeys = this.files[filePath] ?
    [filePath] : Object.keys(this.files);
    fileKeys.forEach((filename) => {
      if (this.files[filename].index) {
        const fileIndex = this.files[filename].index;
        searchResult[filename] = {};
        wordList.forEach((word) => {
          searchResult[filename][word] = fileIndex[word] ? fileIndex[word] : [];
        });
      }
    });
    return searchResult;
  }

  /** Get index
  *
  * Returns index of file(s)
  *
  * @param {String} fileName
  * @returns {Object} containing index of file
  */
  getIndex(fileName) {
    return this.files[fileName].index;
  }

  /** Is Valid JSON
     *
     * Checks if contents of file is a correct JSON object
     *
     * @param {Object} uploadedFiles
     * @returns {Boolean} file contents if valid, returns false if invalid
     */
  static isValidJson(uploadedFiles) {
    try {
      const file = JSON.parse(uploadedFiles);
      file.forEach((item) => {
        if (!Object.prototype.hasOwnProperty.call(item, 'title')
          && !Object.prototype.hasOwnProperty.call(item, 'text')) {
          throw Error;
        }
      });
      return file;
    } catch (error) {
      return false;
    }
  }

  /** Add files
  *
  * Adds new file(s) to class
  *
  * @param {Object} fileContents
  * @param {String} fileName
  * @returns {null} sets Class files
  */
  addFiles(fileContents, fileName) {
    const refinedName = fileName.replace(/\.json/g, '').replace(/\s+/g, '');
    if (fileContents) {
      this.files[refinedName] = {};
      this.files[refinedName].name = fileName;
      if (Array.isArray(fileContents) && fileContents.length !== 0) {
          // check if content is an array of books
        this.files[refinedName].books = fileContents;
      } else {F
        this.files[refinedName].books = [fileContents];
      }
    }
  }
}
module.exports = Index;

},{}]},{},[2])