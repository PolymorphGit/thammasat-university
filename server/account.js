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

exports.UserInfobyId = function(req, res, next) {
	var first = req.params.firstname;
	var last = req.params.lastname;
	db.select("SELECT * FROM salesforce.Account WHERE firstname='" + first + "' and lastname='" + last + "'")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})
    .catch(next);
};