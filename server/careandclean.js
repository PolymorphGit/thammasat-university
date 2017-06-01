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
						db.select("SELECT * FROM salesforce.Master_Clean_Rate__c where type__c='" + results2[0].room_type__c + "' order by quantity__c asc")
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
	var date;
	var time;
	var detail;
	db.select("SELECT * FROM salesforce.WorkOrder WHERE sfid='" + id + "'")
	.then(function(results0) {
	db.select("SELECT * FROM salesforce.case WHERE sfid='" + results0[0].caseid + "' and type='Care and Clean'")
	.then(function(results) {
		console.log(results);	
		//output = JSON.stringify(results);
		date = results[0].createddate;
		time = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + ("0" + date.getFullYear()).slice(-2);	
		output = '[{"id":"' + results[0].sfid;
		output += '", "name":"' + results[0].subject + " (" + results[0].casenumber + ")";
		output += '", "type":"clean';
		detail = results[0].description == null ? '' : results[0].description;
		detail = detail.replace(/(\r\n|\n|\r)/gm, " ");
		output += '", "detail":"' + detail;	
		output += '", "allow_access":"' + results[0].allow_to_access_room__c;
		output += '", "agrre_to_payment":"' + results[0].agree_to_pay__c;
		output += '", "quantity":"' + results[0].package_number__c;
		output += '", "total_amount":"' + results[0].amount__c;
		output += '", "created_date":"' + date;
		output += '", "created_time":"' + time + '"}]';
		
		db.select("SELECT * FROM salesforce.WorkOrder WHERE caseid='" + results[0].sfid + "'")
		.then(function(results2) {	
			//console.log(results2);
			if(results2.length > 0)
			{
				output = output.substr(0, output.length - 2) + ', "Clean":[';
				//output += JSON.stringify(results2);
				for(var i = 0 ; i <results2.length ; i++)
				{
					date = results2[0].working_date__c;
					date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + ("0" + date.getFullYear()).slice(-2);
					output += '{"clean_id":"' + results2[i].sfid;
					output += '", "working_date":"' + date;
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
					
					
					var query = "SELECT * FROM salesforce.WorkOrder where accountid='" + results[0].sfid + "' and subject='Care and Clean'";
					if(!isNaN(limit))
					{
						query += " limit " + limit;
					}
					//console.log(query);
					db.select(query)
					.then(function(results3) {	
						//Build Output
						var output = '[';
						var createdate;
						var date;
						var time;
						for(var i = 0 ; i <results3.length ; i++)
						{
							createdate = results3[i].createddate;
							date = createdate.getDate() + '/' + createdate.getMonth() + '/' + createdate.getFullYear();
							time = ("0" + createdate.getHours()).slice(-2) + ':' + ("0" + createdate.getMinutes()).slice(-2);
							output += '{"id":"' + results3[i].sfid;
							output += '", "name":"' + results3[i].subject + ' (' + results3[i].workordernumber + ')';
							output += '", "type":"clean';
							output += '", "detail":"วันที่: ' + date + ' ช่วงเวลา: ' + results3[i].cleaning_period__c;
							output += '", "status":"' + results3[i].status;
							output += '", "created_date":"' + date;
							output += '", "created_time":"' + time + '"},';
						}
						if(results3.length)
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
	var postBody = JSON.stringify(req.body);
	
	var options = {
	  host: 'thammasat-university.herokuapp.com',
	  path: '/checkclean',
	  port: '443',
	  method: 'POST',
	  headers: { 'authorization': head, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postBody) }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
		    str += chunk;
		});
		results.on('end', function() {
			console.log(str);
			var obj = JSON.parse(str);
			if(obj.status == 'Invalid access token')
			{
				res.status(887).send("{ status: \"Invalid access token\" }");
			}
			else if(obj.status == 'fail')
			{
				//res.json(obj);
				res.send('{ status: "fail", message: "' + obj.message + ' เต็ม" }');
			}
			else if(obj.status__c != 'Checkin')
			{
				res.send('{ status: "fail", message: "คุณยังไม่ได้ทำการ Check in" }');
			}
			else
			{
				//Open Case 
				db.select("SELECT * FROM salesforce.RecordType WHERE name='Care and Clean'")
				.then(function(results2) {
					
					var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, origin, subject, description";
					query += ", amount__c, allow_to_access_room__c, agree_to_pay__c, priority, package_number__c) ";
					query += "VALUES ('" + results2[0].sfid + "', '" + obj.sfid + "', 'Mobile Application', 'Care and Clean', '";
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
									db.select("SELECT * FROM salesforce.Asset WHERE accountid='" + obj.sfid + "' and active__c=true")
									.then(function(results6) {
										var query2 = "INSERT INTO salesforce.WorkOrder (caseid, working_date__c, cleaning_period__c, recordtypeid, assetid, subject, accountid) VALUES ";
										for(var i = 0 ; i < req.body.schedule.length; i++)
										{
											query2 += "('" + results4[0].sfid + "', '" + req.body.schedule[i].date + "', '" + req.body.schedule[i].time;
											query2 += "', '" + results5[0].sfid + "', '" + results6[0].sfid +"', 'Care and Clean', '" + obj.sfid + "'), ";
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
			}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.write(postBody);
	httprequest.end();
}

exports.checkCap = function(req, res, next) {
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
				.then(function(results2) {
					db.select("SELECT * FROM salesforce.clean_capacity__c WHERE zone__c='" + results2[0].zone__c + "'")
					.then(function(results3) {
						//Build Query 
						console.log(results3);
						var listDate = '';
						for(var i = 0 ; i < req.body.schedule.length; i++)
						{
							listDate += "'" + req.body.schedule[i].date + "', ";
						}
						listDate = listDate.substr(0, listDate.length - 2);
						
						var query = "SELECT count(Id) as count, to_char(working_date__c, 'MM/DD/YYYY') as date, cleaning_period__c FROM salesforce.workorder as order";
						query += "INNER JOIN salesforce.account as acc on order.accountid = acc.sfid "
						query += "where acc.zone__c='" + results2[0].zone__c + "' and working_date__c IN (" + listDate +") group by working_date__c, cleaning_period__c";
						db.select(query)
						.then(function(results4) {
							//Loop check count with capacity
							console.log(results4);
							var message = '';
							for(var i = 0 ; i < results4.length; i++)
							{
								console.log('date: ' + results4[i].date + ', period: ' + results4[i].cleaning_period__c);
								for(var j = 0 ; j < req.body.schedule.length; j++)
								{
									console.log('>> date: ' + req.body.schedule[j].date + ', period: ' + req.body.schedule[j].time);
									if(results4[i].cleaning_period__c == req.body.schedule[j].time && results4[i].date == req.body.schedule[j].date)
									{
										console.log("---check---")
										if((results4[i].cleaning_period__c == 'Morning' && results4[i].count >= results3[0].morning__c) || 
										   (results4[i].cleaning_period__c == 'Afternoon' && results4[i].count >= results3[0].afternoon__c))
										{
											message += ' วันที่ ' + results4[i].date + ' ช่วง ' + results4[i].cleaning_period__c + '/';
										}
									}
								}
							}
							if(message != '')
							{
								res.send('{ "status": "fail", "message": "' + message + ' เต็ม" }');
							}
							else
							{
								//res.send('{ "status": "success" }');
								res.json(results2[0]);
							}
						})
					    .catch(next);
					})
				    .catch(next);
				})
			    .catch(next);
			}
		    catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}