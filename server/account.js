var db = require('./pghelper');

exports.UserInfo = (req, res, next) => {
	let id = req.params.id;
	db.query("SELECT * FROM salesforce.account WHERE SFID='" + id + "'");
	res.json(db);
};