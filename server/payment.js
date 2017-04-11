var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	var id = req.params.id;
	var output = '';
	db.select("SELECT * FROM salesforce.Invoice__c WHERE SFID='" + id + "'")
	.then(function(results) {
		//console.log(results);	
		output = JSON.stringify(results);
		db.select("SELECT * FROM salesforce.Invoice_Line_Item__c WHERE Invoice__c='" + results[0].sfid + "'")
		.then(function(results2) {	
			//console.log(results2);
			if(results2.length > 0)
			{
				output = output.substr(0, output.length - 2) + ', "Item":';
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
				var query = "SELECT * FROM salesforce.Invoice__c where Student_Name__c='" + results[0].sfid + "'";
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
					for(var i = 0 ; i <results2.length ; i++)
					{
						output += '{"Payment id":"' + results2[i].sfid;
						output += '", "Payment Number":"' + results2[i].name;
						output += '", "Student Name":"' + results[0].name;
						output += '", "Due Date":"' + results2[i].due_date__c;
						output += '", "Amount":"' + results2[i].total_amount__c + '"},';
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