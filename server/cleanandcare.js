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
		    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
			.then(function(results) {
				var acc = JSON.parse({
				    name: "L Kung",
				    first_name_th__c: "แอล",
				    mobile_id__c: "58d0a8c06983e422876e9e6f",
				    firstname: "L",
				    identification_number__c: "1004000012345",
				    createddate: "2017-03-20T08:27:50.000Z",
				    systemmodstamp: "2017-03-24T08:54:25.000Z",
				    last_name_th__c: "คุง",
				    isdeleted: false,
				    id: 24,
				    faculty__c: "อื่นๆ 99/10",
				    congenital_disease__c: null,
				    _hc_lastop: "SYNCED",
				    _hc_err: null,
				    sfid: "001O0000018HJQ3IAO",
				    status__c: "Checkin",
				    allow_check_out__c: false,
				    room__c: null
				  });
				db.select("SELECT * FROM salesforce.Product2 WHERE SFID='" + acc.room__c + "'")
				.then(function(results2) {
					//var room = JSON.parse(results2);
					db.select("SELECT * FROM salesforce.Master_Clean_Rate__c where type__c='" + results2.room_type__c + "'")
					.then(function(results2) {
						console.log(results2);	
						res.json(results2);
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