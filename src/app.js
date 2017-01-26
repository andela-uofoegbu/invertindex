let IndexObj = new Index();

// function to readfiles
readFiles = (files) => {
  document.getElementById('fileDisplayArea').innerHTML = ``;
  let errors = []; // stores errors while uploading files
  let select = $('#dropdown');
  if (!$("#dropdown option[value='']").length > 0) {
    console.log(Object.keys(IndexObj.files).length);
    if (Object.keys(IndexObj.files).length > 0) {
      select.append("<option value='' selected >All files</option>");
    }
  }

  for (let i = 0; i < files.length; i++)
  {
     // reads files one at a time
    let f = files[i];

    let reader = new FileReader();
    let refinedName = f.name.replace(/\.json/g, '').replace(/\s/g, '');
    let contents;
    reader.onload = (es) => {
      try {
        contents = IndexObj.isValidJSON(es.target.result);
      } catch (e) {
        document.getElementById('fileDisplayArea').innerHTML += `<li>${f.name} is invalid</li>`;
        return e;
      }

      if (!contents) {
        document.getElementById('fileDisplayArea').innerHTML += `<li>${f.name} is invalid</li>`;
        throw "Some error occurred!!!";
      }

      IndexObj.files[refinedName] = {};
      IndexObj.files[refinedName]['name'] = f.name;
      if (Array.isArray(contents) && contents.length !== 0) {
        // check if content is an array of objects
        IndexObj.files[refinedName]['books'] = contents;
      }
      else { // do this if content has just one object
        IndexObj.files[refinedName]['books'] = [contents];
      }

      IndexObj.createIndex(refinedName);
      document.getElementById('fileDisplayArea').innerHTML += errors;


      select.append(`<option value='${refinedName}'>${IndexObj.files[refinedName]['name']}</option>`);


      document.getElementById('fileDisplayArea').innerHTML += errors;
    };
    if (!IndexObj.files[refinedName]) {
      reader.readAsText(f);
    }
  }
};

buildTable = (books, indices, keys) => {
  if (!jQuery.isEmptyObject(IndexObj.files)) {
    $('#indexTableDiv').append($("<table id='indexTable' class='table' />"));
    let table = $('#indexTable');
    let tableHeader = '<thead><th>Words</th>';
    for (let index in books) {
      tableHeader += `<th>${books[index].title.substring(0, 20)}</th>`;
    }
    tableHeader += "</thead><tbody>";
    table.append(tableHeader);
    for (let index in keys) {
      let row = "<tr>";
      row += `<td>${keys[index]}</td>`;
      for (let i = 0; i < books.length; i++) {
        let td = "";
        let whereWordsExist = indices[keys[index]];
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
};

createIndex = () => {
  // IndexObj.collateBooks();
  let documentkey = document.getElementById('dropdown').value;
  let books;
  document.getElementById('indexTableDiv').innerHTML = "";
  let indices;
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
  let keys = Object.keys(indices);
  buildTable(books, indices, keys);
};

searchIndex = (terms) => {
  let documentkey = document.getElementById('dropdown').value;
  let books = [];
  document.getElementById('indexTableDiv').innerHTML = "";
  let searchResult;
  if (documentkey) {
    searchResult = IndexObj.searchIndex(terms, documentkey);
    books = IndexObj.files[documentkey].books;
  } else {
    searchResult = IndexObj.searchAll(terms);
    books = IndexObj.files.allBooks;
  }

  let keys = Object.keys(searchResult);
  buildTable(books, searchResult, keys);
};

reset = () => {
  document.getElementById('indexTableDiv').innerHTML = '';
  document.getElementById('fileInput').value = '';
  $('#dropdown').empty();
  document.getElementById('fileDisplayArea').innerHTML = '';
  document.getElementById('query').value = '';
  IndexObj.files = {};
};
