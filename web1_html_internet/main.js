var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body){
  return `
  <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${body}
    </body>
    </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';
        var i = 0;
        while(i<filelist.length){
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i += 1;
        }
        list += '</ul>';
        return list;
}

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log(_url);
    var title = queryData.id;

    console.log(url.parse(_url, true));
    console.log(__dirname + _url);

    if(pathname === '/'){
      // 루트라면 기존 코드를 실행
      if(queryData.id === undefined){
        // 파일목록 불러오기
        fs.readdir('../web1_html_internet/data', function(error, filelist){
          console.log(filelist);

        // 홈 요청일 때 (= 쿼리스트링이 없을 때)
        var title = 'Welcome';
        var description = 'Hello, Node.js';

        var list = templateList(filelist);
        var template = templateHTML(title, list , `<h2>${title}</h2><p>${description}</p>`);
       
        response.writeHead(200);
        response.end(template);
        })
   
    } else {
      // 홈 요청이 아닐때
      // 파일 목록 불러오기
      fs.readdir('../web1_html_internet/data', function(error, filelist){
        console.log(filelist);

      // 파일데이터 읽어오기
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(title, list , `<h2>${title}</h2><p>${description}</p>`);

        response.writeHead(200);
        response.end(template);
      });
    });
    } 
    } else {
      // 루트가 아니라면 새로운 코드를 실행
      response.writeHead(404);
      response.end('Not Found');
    }
});

app.listen(3000);