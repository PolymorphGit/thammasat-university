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
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
			    var obj = JSON.parse(str);
			    //res.send(obj.identities[0].user_id);
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					db.select("SELECT * FROM salesforce.Product2 WHERE SFID='" + results[0].room__c + "'")
					.then(function(results2) {
						db.select("SELECT * FROM salesforce.Master_Clean_Rate__c where type__c='" + results2[0].room_type__c + "'")
						.then(function(results2) {
							console.log(results2);
							var output = '[';
							for(var i = 0 ; i <results2.length ; i++)
							{
								output += '{"sfid":"' + results2[i].sfid;
								output += '", "quantity":"' + results2[i].quantity__c;
								output += '", "rate":"' + results2[i].rate__c + '"},';
							}
							if(results.length)
							{
								output = output.substr(0, output.length - 1);
							}
							output+= ']';
							res.json(JSON.parse(output));
						})
					    .catch(next);
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

exports.getDetail = function(req, res, next) {
	var id = req.params.id;
	var output = '';
	db.select("SELECT * FROM salesforce.case WHERE sfid='" + id + "' and type='Care and Clean'")
	.then(function(results) {
		//console.log(results);	
		//output = JSON.stringify(results);
		output = '[{"order_id":"' + results[0].sfid;
		output += '", "allow_access":"' + results[0].allow_to_access_room__c;
		output += '", "agrre_to_payment":"' + results[0].agree_to_pay__c;
		output += '", "remark":"' + results[0].Description;
		output += '", "total_amount":"' + results[0].amount__c;
		output += '", "create_date":"' + results[0].createddate + '"}]';
		
		db.select("SELECT * FROM salesforce.WorkOrder WHERE caseid='" + results[0].sfid + "'")
		.then(function(results2) {	
			//console.log(results2);
			if(results2.length > 0)
			{
				output = output.substr(0, output.length - 2) + ', "Clean":[';
				//output += JSON.stringify(results2);
				for(var i = 0 ; i <results2.length ; i++)
				{
					output += '{"clean_id":"' + results2[i].sfid;
					output += '", "working_date":"' + results2[i].working_date__c;
					output += '", "period":"' + results2[i].cleaning_period__c;
					output += '", "status":"' + results2[i].status + '"},';
				}
				output = output.substr(0, output.length - 1);
				output += ']}]';
			}
			console.log(output);
			output = JSON.parse(output);
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
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
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
						var createdate;
						var date;
						var time;
						for(var i = 0 ; i <results2.length ; i++)
						{
							createdate = results2[i].createddate;
							date = createdate.getDate() + '/' + createdate.getMonth() + '/' + createdate.getFullYear();
							time = createdate.getHours() + ':' + createdate.getMinutes();
							output += '{"id":"' + results2[i].sfid;
							output += '", "name":"' + results2[i].subject + ' (' + results2[i].workordernumber + ')';
							output += '", "type":"clean"'; 
							output += '", "detail":"วันที่: ' + date + ' ช่วงเวลา: ' + results2[i].cleaning_period__c;
							output += '", "created_date":"' + date;
							output += '", "created_time":"' + time + '"},';
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

exports.openClean = function(req, res, next) {
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
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
			    var obj = JSON.parse(str);
				db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					db.select("SELECT * FROM salesforce.RecordType WHERE name='Care and Clean'")
					.then(function(results2) {
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, origin, subject, description";
						query += ", amount__c, allow_to_access_room__c, agree_to_pay__c, priority, package_number__c) ";
						query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', 'Mobile Application', 'Care and Clean', '";
						query += req.body.comment + "', '" + req.body.amount + "', '" + req.body.access + "', '";
						query += req.body.payment + "', 'Medium', " + req.body.schedule.length + ") RETURNING *";
						//console.log(query);
						db.select(query)
						.then(function(results3) {
							setTimeout(function () {
								//console.log(results3);
								db.select("SELECT * FROM salesforce.Case WHERE id='" + results3[0].id + "'")
								.then(function(results4) {
									db.select("SELECT * FROM salesforce.RecordType WHERE name='Maid'")
									.then(function(results5) {
										db.select("SELECT * FROM salesforce.Asset WHERE accountid='" + results[0].sfid + "' and active__c=true")
										.then(function(results6) {
											var query2 = "INSERT INTO salesforce.WorkOrder (caseid, working_date__c, cleaning_period__c, recordtypeid, assetid, subject, accountid) VALUES ";
											for(var i = 0 ; i < req.body.schedule.length; i++)
											{
												query2 += "('" + results4[0].sfid + "', '" + req.body.schedule[i].date + "', '" + req.body.schedule[i].time;
												query2 += "', '" + results5[0].sfid + "', '" + results6[0].sfid +"', 'Care and Clean', '" + results[0].sfid + "'), ";
											}
											if(req.body.schedule.length > 0)
											{
												query2 = query2.substr(0, query2.length - 2);
											}
											db.select(query2)
											.then(function(results7) {
												res.send('{ status: "success" }');
											})
										    .catch(next);
										})
									    .catch(next);
									})
								    .catch(next);
								})
							    .catch(next);
							}, 5000) 
						})
					    .catch(next);
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
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}