var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	
	res.json(getDetails(limit, start));
}

function getDetails(limit, start)
{
	var query = "SELECT * FROM salesforce.Announcement__c";
	if(!isNaN(limit))
	{
		query += " limit " + limit;
	}
	if(!isNaN(start) && start != 0)
	{
		query += " OFFET  " + limit;
	}
	db.select(query)
	.then(function(results) {
		return results;
	})
    .catch(next);
}