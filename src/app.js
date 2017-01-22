var output = []; // stores output to display in file list area
var IndexObj = new Index();

// function to readfiles
function readFiles(files) {
  var errors = []; // stores errors while uploading files
let select = $('#dropdown');
      let options = '';
      if(!$("#dropdown option[value='']").length > 0){
        select.append("<option value=''>All files</option>");
      }

  for (let i = 0; i < files.length; i++) { // reads files one at a time

    let f = files[i];

    var reader = new FileReader();
    let refinedName = f.name.replace(/\.json/g, '').replace(/\s/g, '');

    reader.onload = function (es) {
      try {
        var contents = JSON.parse(es.target.result); // store content of file as json
        if (!IndexObj.isValidJSON(contents)) { // throw exception if content does not have title and text keys
          throw "Invalid JSON format";
        }
        else {
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


        }

        document.getElementById('fileDisplayArea').innerHTML += errors;
      }
      catch (e) {
        document.getElementById('fileDisplayArea').innerHTML = "<ul>" + f.name + "is invalid</ul>";
        return e;
      }


      select.append("<option value='"+ refinedName +"'>"+IndexObj.files[refinedName]['name'] +"</option>");
    }

    if (!IndexObj.files[refinedName] && f.type == 'application/json') {
      reader.readAsText(f);
    }
    else {
      errors.push("File " + f.name + " is not a valid json file");

    }
  }
console.log(IndexObj);
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
  var books = [];
  document.getElementById('indexTableDiv').innerHTML = "";
  var indices;
  if(documentkey){
    indices = IndexObj.getIndex(documentkey);
    books = IndexObj.files[documentkey].books;
  }
  else{
    indices = IndexObj.getIndex();

    for (index in IndexObj.files){
      books = books.concat(IndexObj.files[index].books);
    }
  }
  var keys = Object.keys(indices);

  buildTable(books, indices, keys);

}

function searchIndex(terms) {
  var documentkey = document.getElementById('dropdown').value;
  var books = [];
  document.getElementById('indexTableDiv').innerHTML = "";
  var searchResult;
  if(documentkey){
    console.log(documentkey);
    searchResult = IndexObj.searchIndex(terms, documentkey);
  books = IndexObj.files[documentkey].books;

  }
  else{
    searchResult = IndexObj.searchIndex(terms);

    for (index in IndexObj.files){
      books = books.concat(IndexObj.files[index].books);
    }
  }

  let keys = Object.keys(searchResult);
  buildTable(books, searchResult, keys);
}

function reset () {
  var output = [];
var allFiles = {};
var allFileNames = [];
document.getElementById('fileDisplayArea').innerHTML = "";
  document.getElementById('indexTableDiv').innerHTML = "";
location.reload;
}


function buildTable(books, indices, keys) {
  var container = $('#indexTableDiv').append($("<table id='indexTable' class='table' />"));
  var table = $('#indexTable');
  var tableHeader = '<thead><th>Words</th>';
  for (var index in books) {
    tableHeader += '<th>'+ books[index].title.substring(0, 20) + "</th>";
  }
  tableHeader += "</thead><tbody>";
  table.append(tableHeader);
  for (var index in keys) {
    var row = "<tr>";
    row += '<td>' + keys[index] + '</td>';
    for (var i = 0; i < books.length; i++) {
      var td = "";
      var whereWordsExist = indices[keys[index]];
      console.log(whereWordsExist);
      if (whereWordsExist.includes(i)) {
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