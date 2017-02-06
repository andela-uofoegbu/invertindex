const IndexObj = new Index();

// function to readfiles
readFiles = (files) => {
  document.getElementById('errorMsg').innerHTML = "";
  const select = $('#dropdown');
  for (let i = 0; i < files.length; i++) {
    const f = files[i];

    const reader = new FileReader();
    const refinedName = f.name.replace(/\.json/g, "").replace(/\s+/g, "");
    let contents;
    reader.onload = (es) => {
      try {
        contents = Index.isValidJson(es.target.result);
        if(!contents){
          throw Error("Invalid JSON format");
        }
      } catch (e) {
        document.getElementById('myModal').style.display = "block";
        document.getElementById('myModal').style.fontWeight = "bold";
        document.getElementById('errorMsg')
        .innerHTML += `${f.name} failed to upload. Reason? ` + e.message;
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
        select.append(`<option selected value='${refinedName}'>${IndexObj
          .files[refinedName]['name']}</option>`);
      }
    };
    if (!IndexObj.files[refinedName]) {
      reader.readAsText(f);
    }
  }
  if (IndexObj.files.length > 1) {
    getIndex();
  }
  else {
    $('#indexTableDiv').empty()
      .append("<h4>Index has not been created for this file.</h4>");
  }

};

buildTable = (books, indices, keys, documentkey, type) => {
  let frame, line;
  if (type === 'create') {
    frame = '#indexList';
    line = "table";
  }
  else {
    frame = '#searchList';
    line = "search";
  }
  refinedkey = documentkey;
  documentkey = documentkey.replace(/\.json/g, "").replace(/\s+/g, "");
  if (type === 'search') {
    documentkey += 'find';
  }
  let contents;
  let divkey = '#' + documentkey;
  $(frame)
    .append(' <button id="toggleindex" data-toggle="collapse"' +
    'data-target="#' + documentkey + '" class="btn"><h5>'
    + refinedkey + '</h5></button>');
  $(frame).append('<div id="' + documentkey + '" class="collapse in">' +
    '</div>');

  $(divkey).append($("<table class='table' id='"
    + documentkey + "" + line + "'/>"));
  let divkey2 = '#' + documentkey + '' + line + '';
  const table = $(divkey2);
  let tableHeader = '<thead><th>Words</th>';
  for (const index in books) {
    tableHeader += `<th>${books[index].title}</th>`;
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
  if (!document.getElementById(documentkey + 'out')) {
    let newdiv = document.createElement('div');
    newdiv.className = "outercontain";
    newdiv.id = documentkey + "out";
    $(".table").wrap(newdiv);
  }
};

createIndex = () => {
  $('.collapse').removeClass('in');
  const documentkey = document.getElementById('dropdown').value;
  let books, indices, name;
  let select = $('#dropdown2');
  if (documentkey && !IndexObj.getIndex(documentkey)) {
    IndexObj.createIndex(documentkey, IndexObj.files[documentkey].books);
    indices = IndexObj.getIndex(documentkey);
    books = IndexObj.files[documentkey].books;
    name = IndexObj.files[documentkey].name;
    select.append(`<option value='${documentkey}'>${IndexObj
      .files[documentkey]['name']}</option>`);
    $('#dropdown').children('option[value="' + documentkey + '"]')
    .attr('disabled', true)
  }
  if ($('#dropdown2 > option').length === 2) {
    select.append("<option value='' selected >All files</option>");
  }
  const keys = Object.keys(indices);
  buildTable(books, indices, keys, name, 'create');
};


searchIndex = (terms) => {
  try {
    $('#searchList').empty();
    const documentkey = document.getElementById('dropdown2').value;
    let books = [];
    let searchResult;
    if (documentkey) {
      searchResult = IndexObj.searchIndex(terms, documentkey);
      console.log(searchResult);
      books = IndexObj.files[documentkey].books;
      name = IndexObj.files[documentkey].name;
      if (searchResult) {
        const keys = Object.keys(searchResult);
        buildTable(books, searchResult, keys, name, "search");
      }
      else{
            throw Error("Search terms must contain letters or numbers");
          }
    } else {
      let files = IndexObj.files;
      for (const documentkey in files) {
          searchResult = IndexObj.searchIndex(terms, documentkey);
          books = IndexObj.files[documentkey].books;
          name = IndexObj.files[documentkey].name;
          if (searchResult) {
            const keys = Object.keys(searchResult);
            buildTable(books, searchResult, keys, name, "search");
          } else {
            throw Error("Search terms must contain letters or numbers");
          }
      }
    }
  }
  catch (e) {
    document.getElementById('myModal').style.display = "block";
    document.getElementById('myModal').style.fontWeight = "bold";
    document.getElementById('errorMsg')
    .innerHTML = e.message;
  }
};

reset = () => {
  document.getElementById('indexList').innerHTML = "";
  document.getElementById('searchList').innerHTML = "";
  document.getElementById('query').value = "";
  document.getElementById('dropdown').innerHTML = "";
  document.getElementById('dropdown2').innerHTML = "";
  IndexObj.files = {};
};

