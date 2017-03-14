var db = require('./pghelper');

exports.UserInfo = function(req, res, next) {
	var id = req.params.id;
	const results = db.select("SELECT * FROM salesforce.Account WHERE SFID='" + id + "'");
	res.json(results);
};