var db = require('./pghelper');

exports.UserInfobyId = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.Account WHERE SFID='" + id + "'")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})
    .catch(next);
};

exports.UserInfo2 = function(req, res, next) {
	var name = req.params.name;
	db.select("SELECT * FROM salesforce.Account WHERE name='" + name + "'")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})
    .catch(next);
};

exports.UserInfobyName = function(req, res, next) {
	var first = req.params.firstname;
	var last = req.params.lastname;
	db.select("SELECT * FROM salesforce.Account WHERE firstname='" + first + "' and lastname='" + last + "'")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})
    .catch(next);
};