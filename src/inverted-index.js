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
  * @returns {Array} wordlist
  */
  static tokenize(sentence) {
    let words = this.removePunctuation(sentence);
    words = words.toLowerCase().split(' ').sort();
    return this.filterWords(words);
  }

  /** Remove Punctuation
  * Removes non-alphanumeric characters from string
  *
  * @param {String} sentence
  * @returns {String} containing only alphanumeric characters
  */
  static removePunctuation(sentence) {
    return sentence.replace(/[^\w+\s+]/gi, ' ').replace(/\s+/g, ' ');
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
    * @param {Array} books
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
  * @returns {Object} none
  */
  createIndex(fileName, books) {
    const fileIndex = {};
    const bookText = Index.getBookText(books);
    const wordList = Index.tokenize(bookText);
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
  * @returns {Object} subSearchResult
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
      const fileIndex = this.files[filename].index;
      wordList.forEach((word) => {
        searchResult[word] = fileIndex[word] ? fileIndex[word] : [];
      });
    });
    return searchResult;
  }

  /** Get index
  *
  * Returns index of file(s)
  *
  * @param {String} fileName
  * @returns {Object} containing index
  */
  getIndex(fileName) {
    return this.files[fileName].index;
  }

  /** Is Valid JSON
     *
     * Checks if contents of file is a correct JSON object
     *
     * @param {Object} uploadedFiles
     * @returns {Object} file
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
}
module.exports = Index;
