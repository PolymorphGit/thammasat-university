var db = require('./pghelper');

exports.getCleanRate = function(req, res, next) {
	var head = req.headers['authorization'];
	var https = require('https');
	
	db.select("SELECT * FROM salesforce.Master_Clean_Rate__c")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})
    .catch(next);
	
}