var  http = require('http');
var  url = require('url');
var  fs = require('fs');
//引入cookie
var cookie = require('cookie');
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
				// console.log(post_data);
				// console.log("数据接收完成")
				var  post_obj = querystring.parse(post_data)
				//判断是否为空
				if(post_obj.username === '' || post_obj.password === ''){
					res.write('{"status":1, "message":"用户名和密码不能为空"}', 'utf-8');
					res.end();
					return;
				}
				// console.log(post_obj);
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
				//登陆成功返回cookie 
	 			var sql = "SELECT * FROM admin WHERE username='"+post_obj.username+"' AND password='"+post_obj.password+"'";
	 			connection.query(sql, function (error, result) {
					if (!error && result && result.length !== 0) {
						console.log("登陆成功");
						res.setHeader('Set-Cookie',	cookie.serialize('isLogin',	"true"));
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
	 
	 
	 //获取数据
	 if (url_obj.pathname === "/getData") {
		 var sql = "SELECT * FROM user";
		 connection.query(sql,function  (error,result) {
		 	if (!error && result && result.length !== 0) {
		 		// console.log("数据请求成功");
				// console.log(result);
				//转换成Json字符串 
				var resultJsonStr = JSON.stringify(result);
		 		res.write('{"status":0, "message":"数据请求成功", "data":'+resultJsonStr+'}', 'utf-8');
		 		res.end();
		 		return;
		 	} else {
		 		res.write('{"status":1, "message":"请求错误"}', 'utf-8');
		 		res.end();
		 	}
		 })
		 return;
	 }
	 
	 
	//添加用户
	if (url_obj.pathname === "/user_add" &&req.method === "POST") {
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
				if(post_obj.username === '' || post_obj.email === '' || post_obj.phone === '' || post_obj.qq === ''){
					res.write('{"status":1, "message":"内容不能为空"}', 'utf-8');
					res.end();
					return;
				}
				console.log(post_obj);
				//表名admin 
				// 
				var sql = 'INSERT INTO user(username, email, phone, qq) VALUE("'+post_obj.username+'", "'+post_obj.email+'", "'+post_obj.phone+'", "'+post_obj.qq+'")';
				connection.query(sql,function (error, result) {
						//如果没有错误 并且result长度不为0 返回注册成功
						// console.log("error:", error);
						// console.log("result:", result);
					// 如果没有出错 error 是null--false， result 是一个数组
					// 如果出错  error有东西对象  ！就变成false  result --undifined
					if(!error && result && result.length !== 0){
						console.log("添加用户成功！");
						res.write('{"status":0, "message":"添加用户成功！"}', 'utf-8');
						res.end();
						return;
					}
				})
			}
			
		})
		return;
	}
	
	
	//修改用户
	if (url_obj.pathname === "/user_edit" &&req.method === "POST") {
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
				if(post_obj.username === '' || post_obj.email === '' || post_obj.phone === '' || post_obj.qq === ''){
					res.write('{"status":1, "message":"内容不能为空"}', 'utf-8');
					res.end();
					return;
				}
				console.log(post_obj);
				//表名admin 
				// 
				//UPDATE	user	SET	name	=	'zhangsan'	WHERE	id=2
				var sql = 'UPDATE	user	SET	username="'+post_obj.username+'", email="'+post_obj.email+'", phone="'+post_obj.phone+'", qq="'+post_obj.qq+'"	WHERE	id="'+post_obj.id+'"'
				connection.query(sql,function (error, result) {
						//如果没有错误 并且result长度不为0 返回注册成功
						// console.log("error:", error);
						// console.log("result:", result);
					// 如果没有出错 error 是null--false， result 是一个数组
					// 如果出错  error有东西对象  ！就变成false  result --undifined
					if(!error && result && result.length !== 0){
						console.log("修改用户成功！");
						res.write('{"status":0, "message":"修改用户成功！"}', 'utf-8');
						res.end();
						return;
					}
				})
			}
			
		})
		return;
	}
	
	
	//删除用户
	if (url_obj.pathname === "/user_delete" && req.method === "POST") {
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
				console.log("数据接收完成");
				var  post_obj = querystring.parse(post_data);
				console.log(post_obj);
				//表名admin 
				// 
				var sql = 'DELETE	FROM	user	WHERE	id="'+post_obj.id+'"';
				connection.query(sql,function (error, result) {
						//如果没有错误 并且result长度不为0 返回注册成功
						// console.log("error:", error);
						// console.log("result:", result);
					// 如果没有出错 error 是null--false， result 是一个数组
					// 如果出错  error有东西对象  ！就变成false  result --undifined
					if(!error && result && result.length !== 0){
						console.log("删除用户成功！");
						res.write('{"status":0, "message":"删除用户成功！"}', 'utf-8');
						res.end();
						return;
					}else {
			      res.write('{"status":1, "message":"删除用户错误"}', 'utf-8');
			      res.end();
		      }
				})
			}
			
		})
		return;
	}
	
	
	
	//登陆成功进入admin.html时验证
	if (url_obj.pathname === "/admin.html") {
		// cookie.parse只能处理字符串
		// 清除cookie后，req.headers.cookie不是个字符串
		var	cookie_obj	=	cookie.parse(req.headers.cookie	||	'')
		if (cookie_obj.isLogin	===	"true") {
			render("./template/admin.html",res);
		} else{
			render("./template/error.html",res);
		}
		return;
	}
	
	
	//推出登陆
	if (url_obj.pathname === "/logout") {
			//修改cookie中登录的标识
			res.setHeader('Set-Cookie',	cookie.serialize('isLogin',	""));
			render("./template/index.html",	res);	
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