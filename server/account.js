var db = require('./pghelper');

exports.UserInfo = function(req, res, next) {
	var id = req.params.id;
	db.query("SELECT * FROM salesforce.account WHERE SFID='" + id + "'");
	res.json(db);
};