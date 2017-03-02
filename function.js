var assert = require('assert');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
module.exports ={
	loginUser : function(db, user,status){
		var doc = {"Name" : user};
		db.collection('user').update(doc,
			{$set:{"Active" : status}},
			function(err,result) {
				assert.equal(err,null);
			}//end function(err,result) {
		)//end find
	},

	getUserInfo : function(res,db,criteria) {
		db.collection('user').findOne(criteria,{"Password": 0},
			function(err,result) {
				assert.equal(err,null);
				res.send(result);
				res.end();
			}//end function(err,result) {
		)//end findOne
	},

	updateUserInfo : function(db,criteria,doc) {
		db.collection('user').update(criteria,{$set:doc},
			function(err,result) {
				assert.equal(err,null);
				res.end("Update Success");
			}//end function(err,result) {
		)//end findOne
	},

	createUser : function(db,doc,callback){
		db.collection('user').insertOne(doc,
			function(err,result) {
				assert.equal(err,null);
				callback();
			}//end function(err,result) {
		)//end insertOnce
	},

	getDistrictList : function(db,callback){
		var output = [];
		var cursor = db.collection('district').find({},{'district':1,_id:1});
			cursor.each(function(err,doc){
				if(doc!= null){
					output.push(doc);
				}
				else{
					callback(output);
				}
			});
	},

	getUserList : function(db,callback){
		var output = [];
		var cursor = db.collection('user').find({},{'name':1,_id:0});
			cursor.each(function(err,doc){
				if(doc!= null){
					output.push(doc);
				}
				else{
					callback(output);
				}
			});
	},

	addDistrict : function(db,doc,callback){
		db.collection('district').insertOne(doc,
			function(err,result) {
				assert.equal(err,null);
				callback();
			}
		);
	},

	addDistrictComment : function(db,criteria,doc,callback){
		db.collection('district').update(criteria,{$push: doc},
			function(err,result) {
				if (err) {
					result = err;
					console.log("update: " + JSON.stringify(err));
				}
				callback(result);
			}
		);
	},

	getDistrictInfo : function(db,name,callback){
		var output = [];
		var cursor = db.collection('district').aggregate([
			{$match: {"site": { $elemMatch :{"title" :name} } } },
			{$unwind : "$site"},
			]);
			cursor.each(function(err,doc){
				if(doc!= null){
					output.push(doc);
				}
				else{
					callback(outputs);
				}
			});
	},

 findUser : function(db,criteria,callback) {
	db.collection('user').findOne(criteria,
		function(err,result) {
			assert.equal(err,null);
			callback(result);
		}//end function(err,result) {
	)//end find
},



	getweather : function(db,callback){
		var weather = [];
		var cursor = db.collection('weather').find().sort({"Date" : 1}).limit(9);
			cursor.each(function(err,doc){
				if(doc!= null){
					weather.push(doc);
				}
				else
				{
					callback(weather);
				}
			});
},
	getDistrict : function(db,callback){
		var district = [];
		var cursor = db.collection('district').find();
			cursor.each(function(err,doc){
				if(doc!= null){
					district.push(doc);
				}
				else
				{
					callback(district);
				}
		});
	},

	addWeather : function(db,jsonDoc,callback){
		db.collection('weather').insert(jsonDoc,
			function(err,result){
				callback(err,result);
		})
	},

	addHot : function(db,criteria,callback){
		db.collection('district').update(criteria,{$set : {"promotion" : "hot"}},
			function(result,err){
				callback(result);
		})
	},

	rmHot : function(db,callback){
		db.collection('district').updateMany({"promotion" : "hot"},{$set : {"promotion" : null}},{ multi: true },
			function(result,err){
				callback(result);
		})
	},

	sortWeather : function(data,callback){
		var out =[];
		var i=0;
		var c =1,dc=1;
		var index;
		var d,td;
		var m,tm;
		var p1,p2;
		var s,ts;
		var compared =0;

		s= data[i].Date;
		m = s.charAt(s.indexOf("/")+1);
		d = s.substring(0,s.indexOf("/")-1);
//console.log(s + " m:" +m+ " d:" +d);

		for(c=1;c<data.length;c++){

			ts = data[c].Date;
			tm = ts.charAt(ts.indexOf("/")+1);
			td = s.substring(0,ts.indexOf("/")-1);
//console.log(ts + " m:" +tm+ " d:" +td);

			if(m > tm){
				compared == 1;
				break;
			}
		
			if(compared == 0 && c == data.length -1){	
//console.log("Check Day");
				for(dc=1;c<data.length;dc++){
					ts = data[dc].Date;
					tm = ts.charAt(ts.indexOf("/")+1);
					td = s.substring(0,ts.indexOf("/")-1);
//console.log(ts + " m:" +tm+ " d:" +td);
					
					if(d>td){
						index = dc;
						break;
					}
				}
			}
		}
//console.log(index);
		for (i=index;i<data.length;i++){
			out.push(data[i]);
		}
		for (i=0;i<index;i++){
			out.push(data[i]);
		}
//console.log(s);
		callback(out);
	}












}
