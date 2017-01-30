/**
 * Creates a new Index.
 * @class
 */

class Index {

  constructor() {
    this.files = {};
  }


/** convert to Array
	 * converts string to array
	 *
	 * @param {String} data
	 * @returns {Array} data
	 */
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
	 *
	 * deletes duplicate array elements
	 *
	 * @param {Array} bookArray
	 * @returns {Array} bookArray
	 */

  static deleteDuplicate(bookArray) {
    // test to check for duplicate element
    return bookArray.filter((item, index, arr) => arr.indexOf(item) === index);
  }

/** collateBooks
	 *
	 * collates all books in all files into one array
	 *
	 * @param {Object} files
	 * @returns {Array} booksall
	 */
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
	 *  takes a string and returns an object with an array value
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
