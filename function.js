var assert = require('assert');
var fs = require('fs');
var haversine = require('haversine');

module.exports ={
/*********************************************************************/
	loginUser : function(db, user,status){
		var doc = {"Name" : user};
		db.collection('user').update(doc,
			{$set:{"Active" : status}},
			function(err,result) {
				assert.equal(err,null);
			}//end function(err,result) {
		)//end find
	},
/*********************************************************************/
	getUserInfo : function(res,db,criteria) {
		db.collection('user').findOne(criteria,{"Password": 0},
			function(err,result) {
				assert.equal(err,null);
				res.send(result);
				res.end();
			}//end function(err,result) {
		)//end findOne
	},
/*********************************************************************/
	updateUserInfo : function(db,criteria,doc,callback) {
console.log(criteria);
console.log(doc);
		db.collection('user').update(criteria,{$set:{"info" : doc}},
			function(err,result) {
				assert.equal(err,null);
				callback("Update Success");
			}//end function(err,result) {
		)//end findOne
	},
/*********************************************************************/
	updateUserpasword : function(db,criteria,doc,callback) {
console.log(criteria);
console.log(doc);
		db.collection('user').update(criteria,{$set:doc},
			function(err,result) {
				assert.equal(err,null);
				callback("Update Success");
			}//end function(err,result) {
		)//end findOne
	},
/*********************************************************************/
	createUser : function(db,doc,callback){
		db.collection('user').insertOne(doc,
			function(err,result) {
				assert.equal(err,null);
				callback();
			}//end function(err,result) {
		)//end insertOnce
	},
/*********************************************************************/
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
/*********************************************************************/
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
/*********************************************************************/
	addDistrict : function(db,doc,callback){
		db.collection('district').insertOne(doc,
			function(err,result) {
				assert.equal(err,null);
				callback(result);
			}
		);
	},
/*********************************************************************/
	addDistrictComment : function(db,criteria,doc,callback){
		db.collection('district').update(criteria,{$push: doc},
			function(err,result) {
				if (err) {
					result = err;
					console.log("update: " + JSON.stringify(err));
				}
				callback(result.result);
			}
		);
	},
/*********************************************************************/
	addSchedule : function(db,criteria,doc,callback){
		db.collection('user').update(criteria,{$push: {"schedule" : doc}},
			function(err,result) {
				if (err) {
					result = err;
					console.log("update: " + JSON.stringify(err));
				}
				callback(result);
			}
		);
	},

	updateSchedule : function(db,criteria,doc,callback){
		db.collection('user').update(criteria,{$set: doc},
			function(err,result) {
				if (err) {
					result = err;
					console.log("update: " + JSON.stringify(err));
				}
				callback(result);
			}
		);
	},

	deleteSchedule : function(db,criteria, id, callback){
		db.collection('user').update(criteria, { $pull: { "schedule" : {"id" : id} }   },{ multi: false },
			function(err,result) {

				if (err) {
					result = err;
					console.log("remove: " + JSON.stringify(err));
				}
				console.log(result.result);
				callback(result);
			}
		);
	},
/*********************************************************************/
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
/*********************************************************************/
 findUser : function(db,criteria,callback) {
	db.collection('user').findOne(criteria,
		function(err,result) {
			assert.equal(err,null);
			callback(result);
		}//end function(err,result) {
	)//end find
},
/*********************************************************************/
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
/*********************************************************************/
	buyCoupon : function (db, user, point, callback){
		var criteria = {"name" : user};
		var newPoint =0;
			db.collection('user').findOne(criteria,{"Password": 0},
				function(err,result) {
						newPoint = result.point - point;

						if(newPoint <0){
							callback("error");
						}
						else{
							db.collection('user').update(criteria,{$set : {"point" : newPoint}},
								function(result){
									db.collection('user').findOne(criteria,{"point": 1},
										function(err,result) {
											callback(result);
										}
									)
								}//end update Callback
							)//end update
						}
						
				}//end function(err,result) {
			)//end findOne

	},

	getFreeCoupon : function (db, user,  callback){
		var criteria = {"name" : user};
		var newPoint =0;
			db.collection('user').findOne(criteria,{"Password": 0},
				function(err,result) {
						if(result.freeCoupon == false){
							db.collection('user').update(criteria,{$set : {"freeCoupon" : true}},
								function(result){
									callback("valid");
								}
							)
						}
						else{
							callback("error");
						}
						
				}//end function(err,result) {
			)//end findOne

	},

	addPoint : function(db, user,callback){
		var criteria = {"name" : user};
		var newPoint =0;
			db.collection('user').findOne(criteria,{"Password": 0},
				function(err,result) {
					db.collection('user').update(criteria,{$set : {"point" : result.point +1}},
						function(result){
							callback("valid");
						}
					)
						
				}//end function(err,result) {
			)//end findOne
	},

/*********************************************************************/
	addWeather : function(db,jsonDoc,callback){
		db.collection('weather').insert(jsonDoc,
			function(err,result){
				callback(err,result);
		})
	},
/*********************************************************************/
	addHot : function(db,criteria,callback){
		db.collection('district').update(criteria,{$set : {"promotion" : "hot"}},
			function(result,err){
				callback(result);
		})
	},
/*********************************************************************/
	rmHot : function(db,callback){
		db.collection('district').updateMany({"promotion" : "hot"},{$set : {"promotion" : null}},{ multi: true },
			function(result,err){
				callback(result);
		})
	},
/*********************************************************************/
	getweather : function(db,callback){
		var weather = [];
		var cursor = db.collection('weather').find().sort({"Date" : 1});
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
/*********************************************************************/
	sortWeather : function(data,callback){
		var out =[];
		var i=0,c=1,dc=1;
		var index=0;
		var d,td,m,tm,s,ts;
		var compared =0;

		s= data[i].Date;
		m = s.charAt(s.indexOf("/")+1);
		d = s.substring(0,s.indexOf("/")-1);

		for(c=1;c<data.length;c++){

			ts = data[c].Date;
			tm = ts.charAt(ts.indexOf("/")+1);

			if(compared == 0 && m > tm){compared == 1;break;}
		
			if(compared == 0 && c == data.length -1){	
				for(dc=1;dc<data.length;dc++){
					ts = data[dc].Date;
					td = s.substring(0,ts.indexOf("/")-1);
					
					if(d>td){index = dc;break;}
				}
			}
		}
		for (i=index;i<data.length;i++){out.push(data[i]);}
		for (i=0;i<index;i++){out.push(data[i]);}
		callback(out);
	},
/*********************************************************************/
	absoluteValue : function(num){
		if (num < 0)
			return num - 2*num;
		else
			return num;
	},
/*********************************************************************/
	findObject : function(siteName, data, callback){
		var siteArray = [];

		for(eachSite of data[0]){	
			if(eachSite.title == siteName[0]){
				siteArray.push(eachSite);
			}
			else if(eachSite.title == siteName[1]){
				siteArray.push(eachSite);
			} 
			else if(eachSite.title == siteName[2]){
				siteArray.push(eachSite);
			} 
			else if(eachSite.title == siteName[3]){
				siteArray.push(eachSite);
			} 
		}//end for
		callback(siteArray);
	},

/*********************************************************************/
	calculateEachDistance : function(siteArray, callback){
		var start, end = {};
		var eachDistance = {};
		var distanceList =[];

		for(a of siteArray){
			for(b of siteArray){
				start ={	"latitude" : a.location.lat, 
									"longitude": a.location.lon
								};
				end ={	"latitude" : b.location.lat, 
								"longitude": b.location.lon
							};
				eachDistance= {	"from" : a.title , 
												"to" : b.title, 
												"distance" : haversine(start,end)
											};

				distanceList.push(eachDistance);
			}
		}
		callback(distanceList);
	},

	/*notice : function (weatherArray){
		var functionDate = Date();
		var date = functionDate.substring();
	}*/

	rank : function(db, criteria, doc, callback){
		db.collection('district').update(criteria,{$set : doc},
			function(result){
				console.log(result);
				callback(result);
		})
	},

	blockrank : function(db,criteria,username,callback){
				db.collection('district').update(criteria , {$push : {ranked : username}},
					function(result){
						console.log(result);
						callback(result);	
			})
	},

	checkDayofWeek :function(endmon,endday,callback){
	var startmon = 1, startday = 1; 
	var count = 0; 
	while (1) { 
		if (startmon == endmon && startday == endday) 
			break; 
		startday++; 
		count++; 
		switch (startmon) { 
			case 1: case 3: case 5: case 7: case 8: case 10: case 12: 
			if (startday == 32) { 
				startmon++; 
				startday = 1; 
			} 
			break; 
		case 4: case 6: case 9: case 11: 
			if (startday == 31) { 
				startmon++; 
				startday = 1; 
			} 
		break; 
		case 2: 
			if (startday == 30) { 
				startmon++; 
				startday = 1; 
			} 
		break; 
		} 
	} 
	switch (count % 7) { 
		case 0: callback("Sunday"); 
		break; 
		case 1: callback("Monday"); 
		break; 
		case 2: callback("Tuesday"); 
		break; 
		case 3: callback("Wednesday"); 
		break; 
		case 4: callback("Thursday"); 
		break; 
		case 5: callback("Friday"); 
		break; 
		case 6: callback("Saturday"); 
		break; 
	} 
}


}//module.export
