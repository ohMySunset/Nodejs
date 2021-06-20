  // 외부에서 모듈을 사용할 수 있도록 exports
module.exports = {
    HTML:function(title, list, body, control){
     return `
     <!doctype html>
       <html>
       <head>
         <title>WEB1 - ${title}</title>
         <meta charset="utf-8">
       </head>
       <body>
         <h1><a href="/">WEB1</a></h1>
         <a href="/author">author</a>
         ${list}
         ${control}
         ${body}
       </body>
       </html>
     `;

   },list:function(topics){
     var list = '<ul>';
           var i = 0;
           while(i<topics.length){
             list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
             i += 1;
           }
           list += '</ul>';
           return list;

   },authorSelect:function(authors, author_id){
    var tag = '';
    var i = 0;
    while(i <authors.length){
      var selected = '';
      if(authors[i].id == author_id){
        // 기존 작성자 표시해주기
        selected = ' selected';
      }
      tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
    <select name="author">
      ${tag}
    </select>`;

  },authorTable:function(authors){
      var tag = '<table>';
      var i = 0;
      while(i<authors.length){
        tag += `
          <tr>
            <td>${authors[i].name}</td>
            <td>${authors[i].profile}</td>
            <td>update</td>
            <td>delete</td>
          </tr>
        `;
        i++;
      }
    tag += '</table>'
    return tag;
   }
}
