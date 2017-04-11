var db = require('./pghelper');

exports.getFeed = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	var https = require('https');
	
	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  port: '443',
	  method: 'GET',
	  headers: { 'authorization': head }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			try { str += chunk; }
			catch(ex) { res.send("Invalid access token"); }
		});
		results.on('end', function() {
			console.log(str);
			var obj = JSON.parse(str);
			 db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
			.then(function(results) {
					var query = "SELECT sfid, name, 'case' as type, 'Due Date:'||due_date__c||', amount:'||total_amount__c FROM salesforce.Case where accountid='" + results[0].sfid + "'";
					query += " UNION ALL ";
					query += "SELECT sfid, name, 'announcement' as type, image_path__c as detail FROM salesforce.Announcement__c";
					if(!isNaN(limit))
					{
						query += " limit " + limit;
					}
					if(!isNaN(start) && start != 0)
					{
						query += " OFFSET  " + start;
					}
					console.log(query);
					db.select(query)
					.then(function(results2) {	
						res.json(results2)
					})
				    .catch(next);
			})
		    .catch(next);
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}