var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var https = require('https');
	
	var query = "SELECT * FROM salesforce.Announcement__c";
	if(!isNaN(limit))
	{
		query += " limit " + limit;
	}
	db.select(query)
	.then(function(results) {
		//console.log(results);	
		res.json(results);
	})
    .catch(next);
	//res.send(isNaN(limit));
}