var testFolder = '../web1_html_internet/data';
var fs = require('fs');

fs.readdir(testFolder, function(err, filelist){
    console.log(filelist);
})