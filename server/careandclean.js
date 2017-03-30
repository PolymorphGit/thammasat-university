var db = require('./pghelper');

exports.getCleanRate = function(req, res, next) {
	var head = req.headers['authorization'];
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
		    //res.send(obj.identities[0].user_id);
		    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
			.then(function(results) {
				db.select("SELECT * FROM salesforce.Product2 WHERE SFID='" + results[0].room__c + "'")
				.then(function(results2) {
					db.select("SELECT * FROM salesforce.Master_Clean_Rate__c where type__c='" + results2[0].room_type__c + "'")
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

exports.getDetail = function(req, res, next) {
	var id = req.params.id;
	var output = '';
	db.select("SELECT * FROM salesforce.case WHERE SFID='" + id + "' and type='Care and Clean'")
	.then(function(results) {
		//console.log(results);	
		output = JSON.stringify(results);
		db.select("SELECT * FROM salesforce.WorkOrder WHERE caseid='" + results[0].sfid + "'")
		.then(function(results2) {	
			//console.log(results2);
			if(results2.length > 0)
			{
				output = output.substr(0, output.length - 2) + ', "Clean":';
				output += JSON.stringify(results2);
			}
			output += '}]';
			output = JSON.parse(output);
			//console.log(output);
			res.json(output);
		})
	    .catch(next);
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
				var query = "SELECT * FROM salesforce.WorkOrder where accountid='" + results[0].sfid + "'";
				if(!isNaN(limit))
				{
					query += " limit " + limit;
				}
				console.log(query);
				db.select(query)
				.then(function(results2) {	
					//Build Output
					var output = '[';
					for(var i = 0 ; i <results2.length ; i++)
					{
						output += '{"Clean Id":"' + results2[i].sfid;
						output += '", "Order Id":"' + results2[i].caseid;
						output += '", "Reporter Name":"' + results[0].name + '"},';
					}
					if(results2.length)
					{
						output = output.substr(0, output.length - 1);
					}
					output+= ']';
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

exports.OpenClean = function(req, res, next) {
	var body = '';
	req.on('data', function(chunk) 
	{
		try { body += chunk; }
		catch(ex) { res.send("Request is invalid format."); }
	});
	req.on('end', function() 
	{
		//console.log(body);
		body = JSON.parse(body);
		console.log(body[0].comment);
		console.log(body[0].Approve_Access);
		console.log(body[0].Approve_Payment);
		console.log(body[0].Schedule[0].Date);
		console.log(body[0].Schedule[0].Time);
		console.log(body[0].Schedule[1].Date);
		console.log(body[0].Schedule[1].Time);
		res.json(body);
	});
}