var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	
}

exports.getList = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
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
			try
			{
				//console.log(JSON.parse(chunk));	
			    str += chunk;
			}
			catch(ex)
			{
				res.send("Invalid access token");
			}
		});
		results.on('end', function() {
		    var obj = JSON.parse(str);
		    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
			.then(function(results) {
				var query = "SELECT * FROM salesforce.Mailing__c where Stundent_Name__c='" + results[0].sfid + "'";
				if(!isNaN(limit))
				{
					query += " limit " + limit;
				}
				console.log(query);
				db.select(query)
				.then(function(results2) {
					console.log(results2);	
					//Build Output
					var output = '[{';
					output += '"Mailing Number":"' + results2[0].name;
					output += ', "Student Name":"' + results[0].name;
					output += ', "Mailing Type":"' + results2[0].Mailing_Type__c;
					output+= '}]';
					res.json(JSON.Parse(output));
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