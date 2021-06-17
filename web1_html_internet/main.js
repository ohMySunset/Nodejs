var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var db = require('./lib/db.js');
var topic = require('./lib/topic.js')

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/'){
      // 루트라면 기존 코드를 실행
      if(queryData.id === undefined){
        
      topic.home(request, response);
   
    } else {
    // 홈 요청이 아닐때
      topic.page(request, response);
    } 
    } else if(pathname === '/create'){
      // 글 생성화면
      topic.create(request, response);
      
    } else if(pathname === '/create_process'){
      // 글 생성을 처리하는 코드
      topic.create_process(request, response);

    } else if (pathname === '/update'){
      // 글 수정화면
      topic.update(request, response);      
      
    } else if(pathname === '/update_process'){
      // 수정 내용을 저장하는 코드
      topic.update_process(request, response);

    } else if (pathname === '/delete_process'){
      // 삭제를 수행하는 코드
      topic.delete_process(request, response);
  } else {
    
      // 루트가 아니라면 새로운 코드를 실행
      response.writeHead(404);
      response.end('Not Found');
    }
});

app.listen(3000);