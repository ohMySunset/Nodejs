var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/'){
      // 루트라면 기존 코드를 실행
      if(queryData.id === undefined){
        // 파일목록 불러오기
        fs.readdir('../web1_html_internet/data', function(error, filelist){
          console.log(filelist);

        // 홈 요청일 때 (= 쿼리스트링이 없을 때)
        var title = 'Welcome';
        var description = 'Hello, Node.js';

        var list = template.list(filelist);
        var html = template.HTML(title, list , `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a>`);
       
        response.writeHead(200);
        response.end(html);
        })
   
    } else {
      // 홈 요청이 아닐때
      // 파일 목록 불러오기
      fs.readdir('../web1_html_internet/data', function(error, filelist){
        // 보안문제를 위해 사용자로부터 경로 요청을 가져오는 모든 곳을 수정
        var filteredId = path.parse(queryData.id).base;

          // 파일데이터 읽어오기
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            // sanitize-html 외부모듈을 사용하여 필터링 처리하기
            var sanitizeTitle = sanitizeHtml(title);
            var sanitizeDescription = sanitizeHtml(description, {
              //  h1태그 입력 허용
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizeTitle, list , 
              `<h2>${sanitizeTitle}</h2><p>${sanitizeDescription}</p>`, 
              `<a href="/create">create</a>
              <a href="/update?id=${sanitizeTitle}">update</a>
            <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizeTitle}">
            <input type="submit" value="delete">
            </form>`);
        

            response.writeHead(200);
            response.end(html);
      });
    });
    } 
    } else if(pathname === '/create'){
      // 파일목록 불러오기
      fs.readdir('../web1_html_internet/data', function(error, filelist){

      var title = 'WEB - Create';
      var list = template.list(filelist);
      var html = template.HTML(title, list , `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
              <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
              <input type="submit"> 
          </p>
        </form>
      `, '');
     
      response.writeHead(200);
      response.end(html);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      // 데이터를 수신할 때 마다 호출되는 콜백함수
      request.on('data', function(data){
        body = body + data;
      });
      // 더이상 수신할 데이터가 없는 경우 호출되는 콜백함수
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          // 리다이렉션 301 : 영구이동, 302 : 임시이동
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    } else if (pathname === '/update'){
      // 글 수정처리 코드
            // 파일 목록 불러오기
            fs.readdir('../web1_html_internet/data', function(error, filelist){
              
              var filteredId = path.parse(queryData.id).base;
                // 파일데이터 읽어오기
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                  var title = queryData.id;
                  var list = template.list(filelist);
                  var html = template.HTML(title, list , `
                  <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}"
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description" >${description}</textarea>
                    </p>
                    <p>
                        <input type="submit"> 
                    </p>
                  </form>
                `, `<a href="/create">create</a><a href="/update?id=${title}">update</a>`);
          
                  response.writeHead(200);
                  response.end(html);
              });
            });
      
    } else if(pathname === '/update_process'){
      // 수정 내용을 저장하는 코드
      var body = '';
      // 데이터를 수신할 때 마다 호출되는 콜백함수
      request.on('data', function(data){
        body = body + data;
      });
      // 더이상 수신할 데이터가 없는 경우 호출되는 콜백함수
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(err){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });         
        });
      });
    } else if (pathname === '/delete_process'){
      // 삭제를 수행하는 코드
      var body = '';
      // 데이터를 수신할 때 마다 호출되는 콜백함수
      request.on('data', function(data){
        body = body + data;
      });
      // 더이상 수신할 데이터가 없는 경우 호출되는 콜백함수
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(err){
          response.writeHead(302, {Location: `/`});
          response.end();
        })
      });
    }
    else {
      // 루트가 아니라면 새로운 코드를 실행
      response.writeHead(404);
      response.end('Not Found');
    }
});

app.listen(3000);