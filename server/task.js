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
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
				console.log(str);
				var obj = JSON.parse(str);
				 db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
						var query = "SELECT sfid, casenumber as name, 'case' as type, subject||', Status:'||status||', Amount:'||coalesce(amount__c, 0)  as detail, createddate FROM salesforce.Case WHERE accountid='" + results[0].sfid + "'";
						query += " UNION ALL ";
						query += "SELECT sfid, name, 'announcement' as type, image_path__c as detail, createddate FROM salesforce.Announcement__c";
						query += " UNION ALL ";
						query += "SELECT sfid, name, 'mailling' as type, mailing_type__c as detail, createddate FROM salesforce.Mailing__c WHERE Student_Name__c='" + results[0].sfid + "'";
						query += " UNION ALL ";
						query += "SELECT sfid, name, 'billing' as type, 'Status:'||due_date__c||', Amount:'||coalesce(total_amount__c, 0) as detail, createddate FROM salesforce.Invoice__c WHERE Student_Name__c='" + results[0].sfid + "'";
						query += " UNION ALL ";
					    query += "SELECT sfid, caseid as name, 'clean' as type, to_char(working_date__c, 'DD/MM/YYYY') as detail, createddate FROM salesforce.WorkOrder WHERE accountid='" + results[0].sfid + "' and status='Completed'";
						query += " Order by createddate desc"
						if(!isNaN(limit))
						{
							query += " limit " + limit;
						}
						if(!isNaN(start) && start != 0)
						{
							query += " OFFSET  " + start;
						}
						//console.log(query);
						db.select(query)
						.then(function(results2) {	
							res.json(results2)
						})
					    .catch(next);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ status: \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}