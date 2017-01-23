/*************************************************************************
**	Author			: 	Ho Kin Fai														**
**	Last Modified	:	28-11-2016 11:50												**
**	Version			:	0.1.3/sam														**
**	Changes			:	apiCreate														**
*************************************************************************/
var http = require('http');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var mongourl = 'mongodb://user:123@ds159998.mlab.com:59998/fyp';
var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var bodyParser = require('body-parser');

//customized function
var func = require('./function.js');

//on-trail function


// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

//login
//api: -d'name="abc"&pw="123"'
app.post('/login',function(req,res) {
	var name = req.body.name;
	var pw = req.body.pw;	
	var criteria = {"Name" : name};
	MongoClient.connect(mongourl,function(err,db) {
		assert.equal(err,null);
		func.findUser(db,criteria,function(result){
			if(result == null){
				res.end("Invalid User Name!");
			}//no user
			else if(result.Name == user && result.Password == pw && !result.Active){
				res.end('valid');
				func.loginUser(db,result.ID,true);
			}else{
				res.end('Invalid Request');
			}
		db.close();
		});
	});
});

//logout
app.post('/login',function(req,res) {
	var user = req.body.name;
	var criteria = {"Name" : user};
	MongoClient.connect(mongourl,function(err,db) {
		assert.equal(err,null);
		func.findUser(db,criteria,function(result){
			if(result == null){
				res.end("Invalid User Name!");
			}//no user
			else if(!result.Active){
				res.end('Invalid Request');
			}
			else{		
				res.end('valid');
				func.loginUser(db,result.ID,false);
			}
		db.close();
		});
	});
});
/*******************user*********************/
//createUser
app.post('/create/user',function(req,res){
	var doc = req.body.doc;
	var criteria = {"Name" : doc.Name};
	MongoClient.connect(mongourl,function(err,db) {
		assert.equal(err,null);
		func.findUser(db,criteria,function(result){
			if(result == null){
				func.createUser(db,doc);
			}
			else{
				res.end("User Name is alerady Exisit");
			}
			db.close();
		});
	});
});
//get user information
app.post('/read/user/info',function(req,res){
	var doc = req.body.doc;
	var criteria = {"Name" : doc.name};
	console.log(criteria);
	MongoClient.connect(mongourl,function(err,db) {
		assert.equal(err,null);
		func.findUser(db,criteria,function(result){
			if(!result.Active){
				res.end("Invalud Request");
			}
			else{
				func.getUserInfo(res,db,criteria,doc);
			}
			db.close();
		});
	});
})
//update user information
app.post('/update/user/info',function(req,res){
	var doc = req.body.doc;
	var criteria = {"Name" : doc.name};
	MongoClient.connect(mongourl,function(err,db) {
		assert.equal(err,null);
		func.findUser(db,criteria,function(result){
			if(!result.Active){
				res.end("Invalud Request");
			}
			else{
				func.updateUserInfo(db,name,function(updateResult){
					res.end(updateResult);
				})
			}
			db.close();
		});
	});
})



/*******************district*********************/
app.get('/admin/create/attrication',function(req,res){
	MongoClient.connect(mongourl,function(err,db) {
		assert.equal(err,null);
		func.getDistrictList(db,function(result){
			console.log(result);
			res.render('createAttraction.ejs',{result:result});
			
		});
		db.close();
	});//end db
})


/*******************weather API*********************/
app.get('/read/weatherAPI',function(res,req){
	MongoClient.connect(mongourl,function(err,db) {
		assert.equal(err,null);
		func.getWeatherAPI(res,db,7);
		db.close();
	});//end db
})
app.listen(process.env.PORT ||8099, function() {
  console.log('Server is on.');
});
