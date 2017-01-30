const IndexObj = new Index();

// function to readfiles
readFiles = (files) => {
  document.getElementById('errorMsg').innerHTML = "";
  document.getElementById('fileDisplayArea').innerHTML = "";
  const select = $('#dropdown');
  if (!$("#dropdown option[value='']").length > 0) {
    select.append("<option value='' selected >All files</option>");
  }

  for (let i = 0; i < files.length; i++) {
    const f = files[i];

    const reader = new FileReader();
    const refinedName = f.name.replace(/\.json\s/g, '');
    let contents;
    reader.onload = (es) => {
      try {
        contents = IndexObj.isValidJSON(es.target.result);
      } catch (e) {
        document.getElementById('myModal').style.display = "block";
        document.getElementById('myModal').style.fontWeight = "bold";
        document.getElementById('errorMsg').innerHTML += `${f.name} failed to upload. Reason? Invalid JSON format<br>`;
      }

      if (contents) {
        IndexObj.files[refinedName] = {};
        IndexObj.files[refinedName]['name'] = f.name;
        if (Array.isArray(contents) && contents.length !== 0) {
        // check if content is an array of objects
          IndexObj.files[refinedName]['books'] = contents;
        }
        else {
         // do this if content has just one object
          IndexObj.files[refinedName]['books'] = [contents];
        }

        IndexObj.createIndex(refinedName);


        select.append(`<option value='${refinedName}'>${IndexObj
        .files[refinedName]['name']}</option>`);
      }
    };
    if (!IndexObj.files[refinedName]) {
      reader.readAsText(f);
    }
  }
};

buildTable = (books, indices, keys) => {
  if (Object.keys(IndexObj.files).length > 2) {
    $('#indexTableDiv').append($("<table id='indexTable' class='table' />"));
    const table = $('#indexTable');
    let tableHeader = '<thead><th>Words</th>';
    for (const index in books) {
      tableHeader += `<th>${books[index].title.substring(0, 20)}</th>`;
    }
    tableHeader += "</thead><tbody>";
    table.append(tableHeader);
    for (const index in keys) {
      let row = "<tr>";
      row += `<td>${keys[index]}</td>`;
      for (let i = 0; i < books.length; i++) {
        let td = "";
        const whereWordsExist = indices[keys[index]];
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
  const documentkey = document.getElementById('dropdown').value;
  let books;
  $('#indexTableDiv').empty();
  let indices;
  if (documentkey) {
    indices = IndexObj.getIndex(documentkey);
    books = IndexObj.files[documentkey].books;
  }
  else {
    IndexObj.createIndex(null, IndexObj.files);
    indices = IndexObj.files.index;
    books = IndexObj.files.allBooks;
  }
  const keys = Object.keys(indices);
  buildTable(books, indices, keys);
};

searchIndex = (terms) => {
  const documentkey = document.getElementById('dropdown').value;
  let books = [];
  let searchResult;
  $('#indexTableDiv').empty();
  if (documentkey) {
    searchResult = IndexObj.searchIndex(terms, documentkey);
    books = IndexObj.files[documentkey].books;
  } else {
    searchResult = IndexObj.searchIndex(terms);
    books = IndexObj.files.allBooks;
  }
  if (searchResult) {
    const keys = Object.keys(searchResult);
    buildTable(books, searchResult, keys);
  }
};

reset = () => {
  document.getElementById('indexTableDiv').innerHTML = "";
  document.getElementById('fileInput').value = "";
  document.getElementById('fileDisplayArea').innerHTML = "";
  document.getElementById('query').innerHTML = "";
  document.getElementById('dropdown').innerHTML = "";
  IndexObj.files = {};
};

