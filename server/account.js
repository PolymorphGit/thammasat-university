var db = require('./pghelper');

exports.UserInfo = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.Account WHERE SFID='" + id + "'");
	res.json(db);
};