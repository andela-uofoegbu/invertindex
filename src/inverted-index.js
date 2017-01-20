/*jshint esversion: 6 */
"use strict";

//Index Object
function Index() {
	let wordlist = "";
	this.allBooks = [];
	this.indexArrayObject = {};
	let books = this.allBooks;
	let indexObject = this.indexArrayObject;


	// Function to create list of all unique words in JSON file
	this.createIndex = () => {
		if(books.length>0){

		document.getElementById('indexTableDiv').innerHTML = '';
		wordlist = deleteDuplicate();

		wordlist = wordlist.sort();

		for (let i = 0; i < wordlist.length; i++) {
			if (wordlist[i] == '') {
				wordlist.splice(i, 1);
			}
		}

		let docsPresent = [];

		for (let i = 0; i < wordlist.length; i++) {
			for (let j = 0; j < books.length; j++) {
				try{
				if (books[j].text.toLowerCase().indexOf(wordlist[i]) > -1) {
					docsPresent.push(j);
				}
			}
			catch(e)
			{
				document.getElementById('fileDisplayArea').innerHTML = '<ul>This JSON file is not in the correct book format</ul>';
			}
			}
			let obj = {};
			indexObject[wordlist[i]] = docsPresent;

		}

		// When compiling with es6 this is not needed, use for(let key of this.indexArrayObject) {} instead
if(books){
			let keys = Object.keys(this.indexArrayObject);
		let container = $('#indexTableDiv').append($("<table id='indexTable' class='table' />"));
		let table = $('#indexTable');
		let tableHeader = '<thead><th>Words</th>';
		for(let index in books) {
			tableHeader += '<th>book_' + books[index].prettyIndex + "</th>";
		}
		tableHeader += "</thead><tbody>";
		table.append(tableHeader);
		for(let index in keys) {
			let row = "<tr>";
			row += '<td>' + keys[index] + '</td>';
			for(let i = 0; i < books.length; i++) {
				let td = "<td>";
				let whereWordsExist = this.indexArrayObject[keys[index]];
				if(whereWordsExist.includes(i)) {
					td += "Yes";
				} else {
					td += "No";
				}
				td += "</td>";
				row += td;
			}

			row += "</tr>";

			table.append(row);
		}
		table.append("</tbody>");
		}
	}
	};

	function removePunctuation(data) {
		return data.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, " ").replace(/\s+/g, ' ').toLowerCase();
	};

	function deleteDuplicate() {
		var bookString = "";
		for (let i = 0; i < books.length; i++) {
			bookString += books[i].text;
		}

		bookString = removePunctuation(bookString).split(" ");
		// for (var i = 0; i < books.length; i++) {
		// 	if (bookString[i]==' ') {
		// 		bookString.splice(i, 1);
		// 	}
		// }

		return bookString.filter((item, index, arr) => {
			return arr.indexOf(item) == index;
		});
	}


	// Function to get Index and display to User
	this.getIndex = (document) => {
		this.createIndex(document);
		if (wordlist == -1) {
			return "Error: Empty JSON Object";
		} else if (wordlist == -2) {
			return "ERROR! Invalid JSON file";
		} else {
			return this.indexArray;
		}
	};

	//search Index
	this.searchIndex = (terms) => {
		document.getElementById('indexTableDiv').innerHTML = "";
		terms = terms.split(" ");
		let results = {};

		for (let i = 0; i < terms.length; i++) {

			if (this.indexArrayObject.hasOwnProperty(terms[i])) {
				results[terms[i]]=this.indexArrayObject[terms[i]];
			}
		}

		// When compiling with es6 this is not needed, use for(let key of this.indexArrayObject) {} instead
		let keys = Object.keys(results);
		let container = $('#indexTableDiv').append($("<table id='indexTable' class='table' />"));
		let table = $('#indexTable');
		let tableHeader = '<thead><th>Words</th>';
		for(let index in books) {
			tableHeader += '<th>book_' + books[index].prettyIndex + "</th>";
		}
		tableHeader += "</thead><tbody>";
		table.append(tableHeader);
		for(let index in keys) {
			let row = "<tr>";
			row += '<td>' + keys[index] + '</td>';
			for(let i = 0; i < books.length; i++) {
				let td = "<td>";
				let whereWordsExist = this.indexArrayObject[keys[index]];
				if(whereWordsExist.includes(i)) {
					td += "Yes";
				} else {
					td += "No";
				}
				td += "</td>";
				row += td;
			}

			row += "</tr>";

			table.append(row);
		}
		table.append("</tbody>");


	};
	this.reset= () => {
  location.reload();

}

}


