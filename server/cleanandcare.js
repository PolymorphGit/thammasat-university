var db = require('./pghelper');

exports.getCleanRate = function(req, res, next) {
	var head = req.headers['authorization'];
	var https = require('https');
	
	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  //host: 'thammasat-university.herokuapp.com',
	  //path: '/',
	  port: '443',
	  method: 'GET',
	  headers: { 'authorization': head }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			try
			{
				console.log(JSON.parse(chunk));	
			    str += chunk;
			}
			catch(ex)
			{
				res.send("Invalid access token");
			}
		});
		results.on('end', function() {
		    var obj = JSON.parse(str);
		    //res.send(obj.identities[0].user_id);
		    db.select("UPDATE salesforce.Account SET Status__c='Checkout' WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
			.then(function(results) {
				db.select("SELECT * FROM salesforce.Product2 WHERE SFID='" + results.room + "'")
				.then(function(results) {
					db.select("SELECT * FROM salesforce.Master_Clean_Rate__c where type__c='" + results.room_type__c + "'")
					.then(function(results) {
						console.log(results);	
						res.json(results);
					})
				    .catch(next);
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