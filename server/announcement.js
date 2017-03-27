var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['Limit'];
	var https = require('https');

	res.send(limit);
}