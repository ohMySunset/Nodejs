// 배열의 생성과 사용
var members = ['egoing', 'k8805', 'hoya'];
//onsole.log(members[1]);

var i = 0;
while(i < members.length){
    console.log('array-loop', members[i]);
    i += 1;
}

// 객체의 생성과 사용
var roles={
    'programmer' : 'egoing',
    'designer' : 'k8805',
    'manager' : 'hoya'
}
console.log(roles.designer);
console.log(roles['designer']);

for(var n in roles){
    console.log('objects => ', n, ', value => ', roles[n]);
}