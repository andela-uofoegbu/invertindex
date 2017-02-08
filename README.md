
[![Build Status](https://travis-ci.org/andela-uofoegbu/invertindex.svg?branch=develop)](https://travis-ci.org/andela-uofoegbu/invertindex)
[![Coverage Status](https://coveralls.io/repos/github/andela-uofoegbu/invertindex/badge.svg?branch=develop)](https://coveralls.io/github/andela-uofoegbu/invertindex?branch=restructuring)
[![Code Climate](https://codeclimate.com/github/andela-uofoegbu/invertindex/badges/gpa.svg)](https://codeclimate.com/github/andela-uofoegbu/invertindex)

# Inverted-index
Inverted index object that takes a JSON array of text objects and creates an index from the array. The index allows a user to search for word(s).

## Features

* Upload a JSON file in the format
```
[
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
]
```
* Application allow for multiple file uploads
* Create index of the words in the json file
* Search indexed words

## Usage

* Clone the repository git clone https://github.com/andela-uofoegbu/invertindex.git
* Run 'npm install' in terminal to install all the dependencies
* To run the test, run 'npm test'
* To use inverted index, run gulp and go to localhost://3000
* An inverted index consists of a list of all the unique words that appear in any document, and for each word, a list of the documents in which it appears.

Inverted index object that takes a JSON array of text objects and creates an index from the array. The index allows a user to search for text blocks in the array that contain a specified collection of words.

## Technologies and Services

### Written in Javascript es6 syntax and nodejs on the backend, with the following:

* Jasmine
* Gulp
* Karma
* Jquery
* Travic CI
* Coveralls
* Hound CI
* HTML/CSS

## Limitations

Only files with .json extension can be indexed

## Contributions

* Clone the repository.
* Install dependencies
* Create a new branch for included feature(s) using the keyword feature/ example feature/new-feature.
* Raise a pull request.
