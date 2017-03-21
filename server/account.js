var db = require('./pghelper');

exports.getInfo = function(req, res, next) {
	var head = req.headers['authorization'];
	var http = require('http');

	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  port: '443',
	  method: 'GET',
	  //This is the only line that is new. `headers` is an object with the headers to request
	  Authorization: {'custom': head}
	};
	
	callback = function(results) {
		console.log(results);	
		res.json(results);
	}
	
	var httprequest = http.request(options, callback);
	//httprequest.end();
	//res.json({ header: head })
};

exports.UserInfobyId = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.Account WHERE SFID='" + id + "'")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})
    .catch(next);
};

exports.UserInfobyMobileId = function(req, res, next) {
	var id = req.params.mobileid;
	db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + id + "'")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})
    .catch(next);
};

exports.logout = function(req, res, next) {
	var head = req.headers['authorization'];
	
};