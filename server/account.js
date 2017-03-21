var db = require('./pghelper');

exports.getInfo = function(req, res, next) {
	var head = req.headers['authorization'];
	var https = require('https');

	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  //host: 'thammasat-university.herokuapp.com',
	  //path: '/',
	  port: '443',
	  method: 'GET',
	  headers: { 'authorization': head }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			console.log(JSON.parse(chunk));	
		    str += chunk;
		});
		results.on('end', function() {
		    var jsonobj = JSON.parse(str);
		    res.send(jsonobj.identities.user_id);
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.end();
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