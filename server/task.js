var db = require('./pghelper');
var announcement = require('./announcement')
var mail = require('./mailing')
var pay = require('./payment')
var case2 = require('./case')
var	clean = require('./careandclean')

exports.getFeed = function(req, res, next) {
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	
	var temp = announcement.getDetail(req, res, next);
	res.json(temp);
}