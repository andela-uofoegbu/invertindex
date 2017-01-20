let duplicateFound;

var output = [];

var fileUploadedLists = {};
var IndexObj = new Index();
// console.log(new Index());
//watch for change on the
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

        if (!isEmpty(contents)) {
          contents.index = x;
          contents.prettyIndex = x + 1;
          IndexObj.allBooks.push(contents);
        }
        else {
          errors.push("File " + filename + " is empty");
        }
      }
      console.log(IndexObj.allBooks);
      console.log(errors);
    };

    if (!fileUploadedLists[f.name] && f.type == 'application/json') {
      console.log(f);
      reader.readAsText(f);
      fileUploadedLists[f.name] = true;
      output.push('<li>' + f.name + '</li>');
    }
    else {
      errors.push("File " + f.name + " is not a valid json file");
      console.log(errors);
    }
  }

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

