var http = require('http');
var fs = require('fs');
var url = require('url');

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
        fs.readdir('../web1_html_internet/data', function(error, filelist){
          console.log(filelist);
          
          var template = `
        <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ul>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ul>
      <h2>${title}</h2>
      <p>${description}</p>
    </body>
    </html>
    `;   
        response.writeHead(200);
        response.end(template);
        })
      // 홈 요청일 때 (= 쿼리스트링이 없을 때)
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        
   
    } else {
      // 홈 요청이 아닐때
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var title = queryData.id;
        var template = `
        <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ul>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ul>
      <h2>${title}</h2>
      <p>${description}</p>
    </body>
    </html>
    `;   
        response.writeHead(200);
        response.end(template);
      });
    } 
    } else {
      // 루트가 아니라면 새로운 코드를 실행
      response.writeHead(404);
      response.end('Not Found');
    }
});

app.listen(3000);