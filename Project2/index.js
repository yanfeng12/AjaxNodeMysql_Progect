var  http = require('http');
var  url = require('url');
var  fs = require('fs');
var  querystring = require('querystring');
//引入数据库
var mysql = require('mysql');
//创建一个连接的到一个对象
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'X1s4j7f2y5zs',
  database: 'ajaxdemo'
});
//连接数据库
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});
var app = http.createServer(function  (req,res) {
	//设置返回内容的格式和编码
	// res.setHeader('content-type', 'text/html;charset=utf-8');
	//返回内容包括html,css 
	//把字符串解析为对象
	var url_obj = url.parse(req.url);
	
	
	// 默认页面
	if(url_obj.pathname === "/"){
		//注意路径 
		render("./template/index.html", res);
		//直接返回 不会去执行后面的代码
		return;
	}
	
	
	//注册
	 if(url_obj.pathname === '/user_register' &&req.method === "POST"){
	 	var post_data = "";
	 	//要获取post方式发送过来的数据要监听两个事件
	 	//data事件作用：当浏览器有数据发送过来时就会触发data事件
	 	req.on('data',function (chunk) {
	 		//chunk:表示数据块，浏览器把数据切块分块发送
	 		post_data += chunk;
	 		// console.log(post_data);
	 	});
	 	req.on('end',function (err) {
			if (!err) {
				//数据接收完成后触发
				console.log(post_data);
				console.log("数据接收完成")
				var  post_obj = querystring.parse(post_data)
				//判断是否为空
				if(post_obj.username === '' || post_obj.password === ''){
					res.write('{"status":1, "message":"用户名和密码不能为空"}', 'utf-8');
					res.end();
					return;
				}
				console.log(post_obj);
				//表名admin 
				// 
				var sql = 'INSERT INTO admin(username, password) VALUE("'+post_obj.username+'", "'+post_obj.password+'")';
				connection.query(sql,function (error, result) {
						//如果没有错误 并且result长度不为0 返回注册成功
						// console.log("error:", error);
						// console.log("result:", result);
					// 如果没有出错 error 是null--false， result 是一个数组
					// 如果出错  error有东西对象  ！就变成false  result --undifined
					if(!error && result && result.length !== 0){
						console.log("注册成功");
						res.write('{"status":0, "message":"注册成功"}', 'utf-8');
						res.end();
						return;
					}
				})
			}
			
	 	})
		return;
	 }
	 
	 
	 //登陆
	 if (url_obj.pathname === "/user_login" &&req.method === "POST") {
	 	var post_data = "";
	 	//要获取post方式发送过来的数据要监听两个事件
	 	//data事件作用：当浏览器有数据发送过来时就会触发data事件
	 	req.on('data',function (chunk) {
	 		//chunk:表示数据块，浏览器把数据切块分块发送
	 		post_data += chunk;
	 		// console.log(post_data);
	 	});
	 	req.on('end',function (err) {
	 		if (!err) {
	 			//数据接收完成后触发
	 			console.log(post_data);
	 			console.log("数据接收完成")
	 			var  post_obj = querystring.parse(post_data)
	 			//判断是否为空
	 			if(post_obj.username === '' || post_obj.password === ''){
	 				res.write('{"status":1, "message":"用户名和密码不能为空"}', 'utf-8');
	 				res.end();
	 				return;
	 			}
	 			console.log(post_obj);
	 			//表名admin 
	 			var sql = "SELECT * FROM admin WHERE username='"+post_obj.username+"' AND password='"+post_obj.password+"'";
	 			connection.query(sql, function (error, result) {
					if (!error && result && result.length !== 0) {
						console.log("登陆成功");
						res.write('{"status":0, "message":"登陆成功"}', 'utf-8');
						res.end();
						return;
					} else {
						res.write('{"status":1, "message":"用户名或者密码错误"}', 'utf-8');
						res.end();
					}

	 			})
	 		}
	 		
	 	})
	 	return;
	 }
	//render("./template"+"/css/index-bak.css", res);
	//render("./template"+"/images/bg.png", res);
	render("./template"+url_obj.pathname, res);
	
})
app.listen(4000,function  (err) {
	if (!err) {
		console.log("APP Running!!!!");
	}
});
function render(path, res) {
  //binary 二进制
  fs.readFile(path, 'binary', function (err, data) {
    if(!err){
      res.write(data, 'binary');
      res.end();
    }
  })
}