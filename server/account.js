var db = require('./pghelper');

exports.UserInfo = function(req, res, next) {
	var id = req.params.id;
	var results = db.select("SELECT * FROM salesforce.Account WHERE SFID='" + id + "'");
	console.log(results);	
	res.json(results);
};