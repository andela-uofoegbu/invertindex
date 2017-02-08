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
module.exports = Index;
