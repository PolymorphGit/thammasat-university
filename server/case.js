var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	var id = req.params.id;
	var output = '';
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		//console.log(results);
		output = '[{"Case Id":"' + results[0].sfid;
		output += '", "casenumber":"' + results[0].name;
		output += '", "Type":"' + results[0].type;
		output += '", "Problem Type":"' + results[0].problem_type__c;
		output += '", "Problem Sub Type":"' + results[0].problem_sub_type__c;
		output += '", "Priority":"' + results[0].priority;
		output += '", "Subject":"' + results[0].subject;
		output += '", "Status":"' + results[0].status;
		output += '", "Amount":"' + results[0].amount__c;
		output += '", "Agree to Pay":"' + results[0].agree_to_pay__c;
		output += '", "Allow to Access":"' + results[0].allow_to_access_room__c;
		output += '", "Remark":"' + results[0].description;
		output += '", "Create Date":"' + results[0].createdate + '"}]';
		output = JSON.parse(output);
		res.json(output);
		//res.json(results);
	})
    .catch(next);
}

exports.getList = function(req, res, next) {
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
				var query = "SELECT * FROM salesforce.Case where accountid='" + results[0].sfid + "'";
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
					//Build Output
					var output = '[';
					for(var i = 0 ; i < results2.length ; i++)
					{
						output += '{"Case id":"' + results2[i].sfid;
						output += '", "Type":"' + results2[i].type;
						output += '", "Sub Type":"' + results2[i].problem_type__c;
						output += '", "Room Problem Type":"' + results2[i].problem_sub_type__c;
						output += '", "Priority":"' + results2[i].priority;
						output += '", "Subject":"' + results2[i].subject;
						output += '", "Status":"' + results2[i].status + '"},';
					}
					if(results2.length > 0)
					{
						output = output.substr(0, output.length - 1);
					}
					output += ']';
					//console.log(output);
					res.json(JSON.parse(output));
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

exports.openCase = function(req, res, next) {
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
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
				var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, type, problem_sub_type__c, problem_type__c"
				query += ", Description, allow_to_access_room__c, agree_to_pay__c, priority, subject) ";
				query += "VALUES ('012O0000000DFcWIAW', '" + results[0].sfid + "', '" + req.body.type + "', '";
				query += req.body.sub_type + "', '" + req.body.topic + "', '" + req.body.other + "', '" + req.body.access + "', '";
				query += req.body.payment + "', 'Medium', '" + req.body.type + "-" + req.body.sub_type + "-" + req.body.topic + "')";
				//console.log(query);
				db.select(query)
				.then(function(results2) {
					
					res.send('success');
				})
			    .catch(next);
			})
		    .catch(next);
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}