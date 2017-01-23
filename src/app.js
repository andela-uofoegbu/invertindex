var output = []; // stores output to display in file list area
var IndexObj = new Index();

// function to readfiles
function readFiles(files) {
  var errors = []; // stores errors while uploading files
  let select = $('#dropdown');
  let options = '';

  if (!$("#dropdown option[value='']").length > 0) {
    select.append("<option value=''>All files</option>");
  }

  for (let i = 0; i < files.length; i++) { // reads files one at a time

    let f = files[i];

    var reader = new FileReader();
    let refinedName = f.name.replace(/\.json/g, '').replace(/\s/g, '');

    reader.onload = function (es) {

      try {
        var contents = IndexObj.isValidJSON(es.target.result);
      } catch (e) {
        document.getElementById('fileDisplayArea').innerHTML = "<ul>" + f.name + " is invalid</ul>";
        return e;
      }

      if (!contents) throw "Some error occurred!!!";

      IndexObj.files[refinedName] = {};
      IndexObj.files[refinedName]['name'] = f.name;
      if (Array.isArray(contents) && contents.length != 0) { // check if content is an array of objects
        IndexObj.files[refinedName]['books'] = contents;
      }
      else { // do this if content has just one object
        IndexObj.files[refinedName]['books'] = [contents];
      }

      IndexObj.createIndex(refinedName);
      document.getElementById('fileDisplayArea').innerHTML += errors;


      select.append("<option value='" + refinedName + "'>" + IndexObj.files[refinedName]['name'] + "</option>");

    }

    document.getElementById('fileDisplayArea').innerHTML += errors;

    if (!IndexObj.files[refinedName] && f.type == 'application/json') {
      reader.readAsText(f);
    }
    else {
      errors.push("File " + f.name + " is not a valid json file");
    }
  }
}

function createIndex() {
  // IndexObj.collateBooks();
  var documentkey = document.getElementById('dropdown').value;
  var books;
  document.getElementById('indexTableDiv').innerHTML = "";
  var indices;
  if (documentkey) {
    indices = IndexObj.getIndex(documentkey);
    books = IndexObj.files[documentkey].books;
  }
  else {
    // console.log(IndexObj.files);
    IndexObj.collateBooks();
    indices = IndexObj.files.index;
    books = IndexObj.files.allBooks;
  }
  var keys = Object.keys(indices);
  buildTable(books, indices, keys);
}

function searchIndex(terms) {
  var documentkey = document.getElementById('dropdown').value;
  var books = [];
  document.getElementById('indexTableDiv').innerHTML = "";
  var searchResult;
  if (documentkey) {
    searchResult = IndexObj.searchIndex(terms, documentkey);
    books = IndexObj.files[documentkey].books;
  } else {
    searchResult = IndexObj.searchAll(terms);
    books = IndexObj.files.allBooks;
  }

  let keys = Object.keys(searchResult);
  buildTable(books, searchResult, keys);
}

function reset() {
  IndexObj.files = {};
}


function buildTable(books, indices, keys) {
  var container = $('#indexTableDiv').append($("<table id='indexTable' class='table' />"));
  var table = $('#indexTable');
  var tableHeader = '<thead><th>Words</th>';
  for (var index in books) {
    tableHeader += '<th>' + books[index].title.substring(0, 20) + "</th>";
  }
  tableHeader += "</thead><tbody>";
  table.append(tableHeader);
  for (var index in keys) {
    var row = "<tr>";
    row += '<td>' + keys[index] + '</td>';
    for (var i = 0; i < books.length; i++) {
      var td = "";
      var whereWordsExist = indices[keys[index]];
      if (whereWordsExist.indexOf(i) >= 0) {
        td += "<td class='tick'>&#10004;";
      } else {
        td += "<td class='crossout'>&#10006;";
      }
      td += "</td>";
      row += td;
    }

    row += "</tr>";

    table.append(row);
  }
  table.append("</tbody>");
}