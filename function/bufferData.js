var assert = require('assert');
var fs = require('fs');
module.exports ={
	getweather : function(db,callback){
		var weather = [];
		var str="exports.weather = weather;";
		var cursor = db.collection('weather').find().sort({"Date" : 1}).limit(9);
			cursor.each(function(err,doc){
				if(doc!= null){
					weather.push(doc);
				}
				else
				{
					var buffer = "\nvar weather = " + JSON.stringify(weather) + "\n";
					fs.appendFile("data.js",buffer,function(err){
						if(err) {
							console.log(err);
						}
						else {
							fs.appendFile("data.js",str,function(err){
								if(err){
									console.log(err);
								}
								else {
									console.log("Weather Infomration Buffered!");
									callback();
								}
							})//fs.appendFile
						}
						})//fs.writeFile
					}
			});
},
	getDistrict : function(db,callback){
		var district = [];
		var str="exports.dis = dis;";
		var cursor = db.collection('district').find();
			cursor.each(function(err,doc){
				if(doc!= null){
					district.push(doc);
				}
				else
				{
					var buffer = "var dis = " + JSON.stringify(district) + "\n";
					fs.writeFile("data.js",buffer,function(err){
						if(err) {
							console.log(err);
						}
						else {
							fs.appendFile("data.js",str,function(err){
								if(err){
									console.log(err);
								}
								else {
									console.log("District Information Buffered!");
									callback();
								}
							})//fs.appendFile
						}
					})//fs.writeFile
				}
		});
	},

	addWeather : function(db,jsonDoc,callback){
		db.collection('weather').insert(jsonDoc,
			function(err,result){
				callback(err,result);
		})
	}
}
