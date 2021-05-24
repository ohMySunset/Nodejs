// 파일 생성 후 파일목록을 불러오기
var testFolder = '../web1_html_internet/data';
var fs = require('fs');

fs.readdir(testFolder, function(err, filelist){
    console.log(filelist);
})