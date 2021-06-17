var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host:'localhost',
  user:'aia',
  password:'aia',
  database:'opentutorials'
});
db.connect


var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/'){
      // 루트라면 기존 코드를 실행
      if(queryData.id === undefined){
        
        db.query('SELECT * FROM topic', function(error, topics){
          //console.log(topics);
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(topics);
          var html = template.HTML(title, list ,
             `<h2>${title}</h2><p>${description}</p>`,
              `<a href="/create">create</a>`
              );
          response.writeHead(200);
          response.end(html);

        })
   
    } else {
      // 홈 요청이 아닐때
      db.query('SELECT * FROM topic', function(error, topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          //console.log(topic);
        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.list(topics);
        var html = template.HTML(title, list ,
           `<h2>${title}</h2><p>${description}</p><p>by ${topic[0].name}</p>`,
            `<a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
            );
        response.writeHead(200);
        response.end(html);
      });
    });
    } 
    } else if(pathname === '/create'){
      // 파일목록 불러오기
      db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error2, authors){
          //console.log(authors);         
          var title = 'Create';
          var list = template.list(topics);
          var html = template.HTML(title, list , `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                  <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <p>
                  <input type="submit"> 
              </p>
            </form>`,
            `<a href="/create">create</a>`);
         
          response.writeHead(200);
          response.end(html);

        });
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
        db.query(`
        INSERT INTO topic (title, description, created, author_id)
          VALUES(?,?, NOW(), ?)`,
          [post.title, post.description, post.author],
          function(error, result){
            if(error){
              throw error;
            }
            // 새로 추가한 데이터의 ID값 가져와서 페이지로 응답
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();
          }
        );
      });
    } else if (pathname === '/update'){
      // 글 수정처리 코드
            // 파일 목록 불러오기
            db.query('SELECT * FROM topic', function(error, topics){
              if(error){
                throw error;
              }
              db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic){
                if(error2){
                  throw error2;
                }             
              
                  var list = template.list(topics);
                  var html = template.HTML(topic[0].title, list , `
                  <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}"
                    <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                    <p>
                        <textarea name="description" placeholder="description" >${topic[0].description}</textarea>
                    </p>
                    <p>
                        <input type="submit"> 
                    </p>
                  </form>
                `, `<a href="/create">create</a><a href="/update?id=${topic[0].id}">update</a>`);
          
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
        db.query(`UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?`,
        [post.title, post.description, post.id], function(error, result){
          response.writeHead(302, {Location: `/?id=${post.id}`});
          response.end();
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
        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
        });
    });
  } else {
      // 루트가 아니라면 새로운 코드를 실행
      response.writeHead(404);
      response.end('Not Found');
    }
});

app.listen(3000);