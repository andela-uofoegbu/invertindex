


let duplicateFound;

var output = [];

var fileUploadedLists = {};
var IndexObj = new Index();
// console.log(new Index());
//watch for change on the

function isValidJsonObject(file){
  if(file.type == 'application/json'){
    return true;
  }
  else{
    return false;
  }
}

function readFiles() {

  var fileInput = document.getElementById('fileInput');
  var textType = /.json/;
  var files = fileInput.files;
  var errors = [];



  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();
    var filename = f.name;

    reader.onload = function (es) {
      try {
        var contents = JSON.parse(es.target.result);
      }
      catch (e) {
        document.getElementById('fileDisplayArea').innerHTML = '<ul>' + e.name + ": " + e.message + '</ul>';
      }

      if (Array.isArray(contents) && contents.length != 0) {
        for (var x = 0; x < contents.length; x++) {
          if (!isEmpty(contents[x])) {
            contents[x].index = x;
            contents[x].prettyIndex = x + 1;
            IndexObj.allBooks.push(contents[x]);
          }
          else {
            // console.log(filename);
            errors.push("File " + filename + " is empty");
          }

        }
      }
      else {

        if (!isEmpty(contents)&& contents.text) {
          contents.index = x;
          contents.prettyIndex = x + 1;
          IndexObj.allBooks.push(contents);
        }
        else {
          errors.push("File " + filename + " is empty");
        }
      }
      document.getElementById('fileDisplayArea').innerHTML +=errors
    };

    if (!fileUploadedLists[f.name] && isValidJsonObject(f)) {
      console.log(f);
      reader.readAsText(f);
      fileUploadedLists[f.name] = true;
      output.push('<li>' + f.name + '</li>');
    }
    else {
      errors.push("File " + f.name + " is not a valid json file");

    }
  }
document.getElementById('fileDisplayArea').innerHTML +=errors
  document.getElementById('fileDisplayArea').innerHTML = '<ul>' + output.join('') + '</ul>';
}



//Remove Duplicate words from Index

//Check if JSON object is empty
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}


function createIndex() {
    document.getElementById('indexTableDiv').innerHTML = "";
    IndexObj.createIndex();
    var indices = IndexObj.getIndex();
    var keys = Object.keys(indices);
    var books = IndexObj.allBooks;
    var container = $('#indexTableDiv').append($("<table id='indexTable' class='table' />"));
    var table = $('#indexTable');
    var tableHeader = '<thead><th>Words</th>';
    for (var index in books) {
      tableHeader += '<th>Book ' + ++index + "</th>";
    }
    tableHeader += "</thead><tbody>";
    table.append(tableHeader);
    for (var index in keys) {
      var row = "<tr>";
      row += '<td>' + keys[index] + '</td>';
      for (var i = 0; i < books.length; i++) {
        var td = "<td>";
        var whereWordsExist = indices[keys[index]];
        if (whereWordsExist.includes(i)) {
          td += "<span class='tick'>&#10004;</span>";
        } else {
          td += "<span class='crossout'>&#10006;</span>";
        }
        td += "</td>";
        row += td;
      }

      row += "</tr>";

      table.append(row);
    }
    table.append("</tbody>");
  }

function searchIndex (terms) {
  if(terms==""){
    return;
  }
  	document.getElementById('indexTableDiv').innerHTML = "";
  var searchResult = IndexObj.searchIndex(terms);
  let books = IndexObj.allBooks;
		let keys = Object.keys(searchResult);
		let container = $('#indexTableDiv').append($("<table id='indexTable' class='table' />"));
		let table = $('#indexTable');
		let tableHeader = '<thead><th>Words</th>';
		for (let index in books) {
			tableHeader += '<th>Book ' + ++index + "</th>";
		}
		tableHeader += "</thead><tbody>";
		table.append(tableHeader);
		for (let index in keys) {
			let row = "<tr>";
			row += '<td>' + keys[index] + '</td>';
			for (let i = 0; i < books.length; i++) {
				let td = "<td>";
				let whereWordsExist = IndexObj.indexObject[keys[index]];
				if (whereWordsExist.includes(i)) {
					td += "<span class='tick'>&#10004;</span>";
				} else {
					td += "<span class='crossout'>&#10006;</span>";
				}
				td += "</td>";
				row += td;
			}

			row += "</tr>";

			table.append(row);
		}
		table.append("</tbody>");


	};


