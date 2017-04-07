var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		//console.log(results);	
		res.json(results);
	})
    .catch(next);
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
				var query = "SELECT * FROM salesforce.Case where accountid='" + results[0].sfid + "'";
				if(!isNaN(limit))
				{
					query += " limit " + limit;
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
						output += '", "Sub Type":"' + results2[i].sub_type__c;
						output += '", "Room Problem Type":"' + results2[i].room_problem_type__c;
						output += '", "Priority":"' + results2[i].Priority;
						output += '", "Subject":"' + results2[i].subject;
						output += '", "Due Date":"' + results2[i].due_date__c;
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
	var body = '';
	/*
	req.on('data', function(chunk) 
	{
		try { body += chunk; console.log('**' + chunk); }
		catch(ex) { res.send("Request is invalid format."); }
	});
	req.on('end', function() 
	{
		//console.log(body);
		//body = JSON.parse(body);
		//Update Case
		//console.log("Comment: " + body[0].Comment + ", Access:" + body[0].Access + ", Payment:" + body[0].Payment);
		res.json(body);
	});
	*/
	if (!req.body) return res.sendStatus(400)
	  res.send('welcome, ' + res.body)
}