var output = []; // stores output to display in file list area
var allFiles = {};
var allFileNames = [];

// function to readfiles
function readFiles(files) {
  var errors = []; // stores errors while uploading files

  for (let i = 0; i < files.length; i++) { // reads files one at a time

    let f = files[i];

    var reader = new FileReader();
    let refinedName = f.name.replace(/\.json/g, '').replace(/\s/g, ''); // replaces extension with space to enable store as key
    reader.onload = function (es) {
      var IndexObj = new Index(); // create new index for each file being read
      try {
        var contents = JSON.parse(es.target.result); // store content of file as json
        if (!IndexObj.isValidJSON(contents)) { // throw exception if content does not have title and text keys
          throw "Invalid JSON format";
        }
        else {
          var filename = f.name;
          if (Array.isArray(contents) && contents.length != 0) { // check if content is an array of objects
            for (let x in contents) {
              if (!isEmpty(contents[x])) {
                contents[x].index = x;
                contents[x].prettyIndex = parseInt(x) + 1;
                contents[x].filename = filename;
                IndexObj.allBooks.push(contents[x]);
              }
              else {
                errors.push("File " + filename + " is empty");
              }

            }
          }
          else { // do this if content has just one object

            if (!isEmpty(contents) && contents.text) {
              contents.index = x;
              contents.prettyIndex = parseInt(x) + 1;
              contents.filename = filename;
              IndexObj.allBooks.push(contents[x]);
            }
            else {
              errors.push("File " + filename + " is empty");
            }
          }

          document.getElementById('fileDisplayArea').innerHTML += errors;


        }

        document.getElementById('fileDisplayArea').innerHTML += errors;
      }
      catch (e) {
        document.getElementById('fileDisplayArea').innerHTML = "<ul>" + filename + "is invalid</ul>";
        return e;
      }

      IndexObj.createIndex();

      allFiles[refinedName] = {};
      allFiles[refinedName]['index'] = IndexObj;
      allFiles[refinedName]['originalName'] = f.name;

      let select = $('#dropdown');
      let options = '';
      select.append("<option value='"+ refinedName +"'>"+allFiles[refinedName]['originalName'] +"</option>")
    }

    if (!allFiles[refinedName] && f.type == 'application/json') {
      reader.readAsText(f);
    }
    else {
      errors.push("File " + f.name + " is not a valid json file");

    }
  }

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
  var documentkey = document.getElementById('dropdown').value;
  document.getElementById('indexTableDiv').innerHTML = "";
  var indices = allFiles[documentkey].index.getIndex();
  var keys = Object.keys(indices);
  var books = allFiles[documentkey].index.allBooks;
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
        td += "&#10004;";
      } else {
        td += "&#10006;";
      }
      td += "</td>";
      row += td;
    }

    row += "</tr>";

    table.append(row);
  }
  table.append("</tbody>");
}

function searchIndex(terms) {
  var documentkey = document.getElementById('dropdown').value;

  document.getElementById('indexTableDiv').innerHTML = "";
  var searchResult = allFiles[documentkey].index.searchIndex(terms);
  let books = allFiles[documentkey].index.allBooks;
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
      let whereWordsExist = allFiles[documentkey].index.indexObject[keys[index]];
      if (whereWordsExist.includes(i)) {
        td += "&#10004;";
      } else {
        td += "&#10006;";
      }
      td += "</td>";
      row += td;
    }

    row += "</tr>";

    table.append(row);
  }
  table.append("</tbody>");


};

function reset () {
  var output = [];
var allFiles = {};
var allFileNames = [];
document.getElementById('fileDisplayArea').innerHTML = "";
  document.getElementById('indexTableDiv').innerHTML = "";

}