var db = require('./pghelper');
var md5 = require('md5');

exports.getInfo = function(req, res, next) {
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
			str += chunk;
		});
		results.on('end', function() {
			try
			{
			    var obj = JSON.parse(str);
			    //res.send(obj.identities[0].user_id);
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					console.log(results);	
					res.json(results);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
};

function buildprofilejson(acc, room, eazy) {
	var output = '';
	var date = acc.birthdate__c;
	date.setHours(date.getHours() + 7);
	date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
	output = '[{"id":"' + acc.sfid;
	output += '", "salutation":"' + acc.salutation;
	output += '", "name":"' + acc.name;
	output += '", "firstname":"' + acc.firstname;
	output += '", "lastname":"' + acc.lastname;
	output += '", "title_th__c":"' + acc.title_th__c;
	output += '", "first_name_th__c":"' + acc.first_name_th__c;		
	output += '", "last_name_th__c":"' + acc.last_name_th__c;
	output += '", "identification_number__c":"' + acc.identification_number__c;
	output += '", "passport_number__c":"' + acc.passport_number__c;
	if(acc.student_id__c != null)
	{
		output += '", "student_id__c":"' + acc.student_id__c;
	}
	else
	{
		output += '", "student_id__c":"';
	}
	output += '", "personemail":"' + acc.personemail;
	output += '", "personmobilephone":"' + acc.personmobilephone;
	output += '", "birthdate__c":"' + date;
	output += '", "faculty__c":"' + acc.faculty__c;
	output += '", "status__c":"' + acc.status__c;
	output += '", "allow_check_out__c":"' + acc.allow_check_out__c;
	if(room != null)
	{
		output += '", "room__c":"' + room.name;
		output += '", "building__c":"' + room.building__c;
	}
	else
	{
		output += '", "room__c":"no room';
		output += '", "building__c":"no building';
	}
	if(eazy != null)
	{
		output += '", "eazy_id":"' + acc.eazy_card__c;
		output += '", "eazy_balance":"' + eazy.resultdata.Account_balance;
		output += '", "eazy_status":"' + eazy.resultdata.Account_status;
		output += '", "eazy_bank":"' + eazy.resultdata.Bank_acc_name;
		output += '", "eazy_bank_account":"' + eazy.resultdata.Bank_acc_no;
	}
	else
	{
		output += '", "eazy_id":"';
		output += '", "balance":"0';
		output += '", "eazy_status":"';
		output += '", "eazy_bank":"';
		output += '", "eazy_bank_account":"';
	}
	output += '", "zone__c":"' + acc.zone__c;
	output += '", "gender__c":"' + acc.gender__c;
	output += '", "billingstreet":"' + acc.billingstreet;
	output += '", "billingcountry":"' + acc.billingcountry;
	output += '", "billingcity":"' + acc.billingcity;
	output += '", "billingpostalcode":"' + acc.billingpostalcode;
	output += '", "billingstate":"' + acc.billingstate;
	output += '", "parent_name__c":"' + acc.parent_name__c;
	output += '", "parent_phone__c":"' + acc.parent_phone__c;
	output += '", "parent_name_2__c":"' + acc.parent_name_2__c;
	output += '", "parent_phone_2__c":"' + acc.parent_phone_2__c;
	output += '", "scholarship__c":"' + acc.scholarship__c;
	output += '", "disabled__c":"' + acc.disabled__c;
	output += '", "renew__c":"' + acc.renew__c;
	output += '", "graduated_from__c":"' + acc.graduated_from__c;
	output += '", "sleep_after_midnight__c":"' + acc.sleep_after_midnight__c;
	output += '", "sleep_soundly__c":"' + acc.sleep_soundly__c;
	output += '", "sleep_with_light_on__c":"' + acc.sleep_with_light_on__c;
	output += '", "love_cleaning__c":"' + acc.love_cleaning__c;
	output += '", "sleep_with_turn_off_air_condition__c":"' + acc.sleep_with_turn_off_air_condition__c;
	output += '", "picture_url__c":"' + acc.picture_url__c + '"}]';
	return output;
}

exports.getInfo2 = function(req, res, next) {
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
			    var output = '';
			    var date;
				var time;
			    //res.send(obj.identities[0].user_id);
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					console.log(results);
					var room = results[0].room__c;
					var enddate = '';
					var today = new Date();
					var startDate = new Date(today.getFullYear(), 5, 1);
					var endDate = new Date(today.getFullYear(), 6, 31);
					if((startDate < today && today < endDate))
					{
						room = results[0].room_summer__c;
					}
					db.select("SELECT * FROM salesforce.Product2 WHERE SFID='" + room + "'")
					.then(function(results2) {
						console.log(results2);	
						if(results[0].eazy_card__c != null)
						{
							//Check Balance
							//var refid = today.valueOf();
							var memid = results[0].eazy_card__c;
							var dateString = today.getFullYear();
							dateString += ("0" + (today.getMonth() + 1)).slice(-2);
							dateString += ("0" + today.getDate()).slice(-2);
							dateString += ("0" + today.getHours()).slice(-2);							
							dateString += ("0" + today.getMinutes()).slice(-2);
							dateString += ("0" + today.getSeconds()).slice(-2);
							var hash = md5('TU_HoUseTu2018EzHn*ZDr^561' + memid + dateString);
							var https2 = require('https');
							/*var options2 = {
							  host: 'easycard.club',
							  path: '/api/TUHOUSE/Checkbalance.php',
							  port: '443',
							  method: 'GET',
							  headers: { 'refid': refid, 'email': results[0].personemail, 
								     'date' : dateString, 'hash' : hash }
							};*/
							var options2 = {
							  host: 'easycard.club',
							  path: '/api/TUHOUSE/customerinfo.php?memberid='+memid+'&requestdate='+dateString+'&hash='+hash,
							  port: '443',
							  method: 'GET',
							  headers: { }
							};

							callback2 = function(results2) {
								var str2 = '';
								results2.on('data', function(chunk) {
									str2 += chunk;
								});
								results2.on('end', function() {
									try
									{
										console.log('--------------Eazy Card----------');
										console.log(str2);
										var obj2 = JSON.parse(str2);
										output = buildprofilejson(results[0], results2[0], obj2);
										res.json(JSON.parse(output));
									}
									catch(ex) {	res.send("{ \"status\": \"Eazy Card Can't connect\" }");	}
								});
							}
							var httprequest2 = https.request(options2, callback2);
							httprequest2.on('error', (e) => {
								//console.log(`problem with request: ${e.message}`);
								res.send('problem with request: ${e.message}');
							});
							httprequest2.end();
						}
						else
						{
							output = buildprofilejson(results[0], results2[0], null);
							res.json(JSON.parse(output));
						}
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
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
};

exports.challengecode = function(req, res, next) {
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
			str += chunk;
		});
		results.on('end', function() {
			try
			{
				var obj = JSON.parse(str);
				var Username = 'tupsm';
				var Password = 'sms1234';
				var phone;
				var msg;
				var Sender = 'PSM.TU';
				
				db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results2) {
					console.log(results2);
					phone = results2[0].personmobilephone;
					msg = 'Your%20verify%20code%20is%20' + results2[0].auth_code__c;
					var valid = results2[0].auth_code_valid__c;
					if(phone != null)
					{
						//Check auth code valid
						var today = new Date();
						if(valid == null || valid < today)
						{
							//Generate new code	
							results2[0].auth_code__c = Math.floor(100000 + Math.random() * 900000);
							console.log('Verify Code ' + results2[0].auth_code__c);
							msg = 'Your%20verify%20code%20is%20' + results2[0].auth_code__c;
							valid = today;
							valid.setMinutes( valid.getMinutes() + 5 );
							console.log('Expired ' + valid);
						}
						
						//console.log('User: ' + Username + ', Password: ' + Password + ', Msnlist: ' + phone + ', Msg: ' + msg + ', Sender :' + Sender);
						var path = '/SMSLink/SendMsg/index.php?User=' + Username + '&Password=' + Password + '&Msnlist=' + phone + '&Msg=' + msg + '&Sender=' + Sender;
						var options2 = {
						  host: 'member.smsmkt.com',
						  path: path,
						  port: '443',
						  method: 'GET'
						  //headers: { 'User': Username, 'Password': Password, 'Msnlist': phone, 'Msg': msg, 'Sender': Sender}
						};
						console.log(options2);
						callback2 = function(results3){
							var str = '';
							results3.on('data', function(chunk) {
								str += chunk;
							});
							results3.on('end', function() {
								console.log(str);
								//res.send(str);
								var send = str.includes('Status=0');
								if(send == true)
								{
									res.send("{ \"status\": \"OK\" }");
									//res.send('OK');
									if(results2[0].auth_code_valid__c == null || results2[0].auth_code_valid__c < today)
									{
										//write new code to DB
										var query = "UPDATE salesforce.Account SET auth_code__c='" + results2[0].auth_code__c + "', "; 
										query += "auth_code_valid__c='" + valid.toLocaleString() + "' ";
										query += " WHERE SFID='" + results2[0].sfid + "'";
										db.select(query)
										.then(function(results4) {
											console.log(results4);	
											//res.json(results4);
										})	
										.catch(next);
									}
								}
								else
								{	
									res.send("{ \"status\": \"Fail\" }");
									//res.send('Fail');	
								}
							});
						}
						var httprequest2 = https.request(options2, callback2);
						httprequest2.on('error', (e) => {
							//console.log(`problem with request: ${e.message}`);
							res.send('problem with request: ${e.message}');
						});
						httprequest2.end();
						/*
						var datetime = valid.toLocaleString();
						var query = "UPDATE salesforce.Account SET auth_code__c='" + results2[0].auth_code__c + "', "; 
						query += "auth_code_valid__c='" + datetime + "' ";
						query += " WHERE SFID='" + results2[0].sfid + "'";
						console.log(query);
						db.select(query)
						.then(function(results4) {
							console.log(results4);	
							res.json(results4);
						})	
						.catch(next);
						*/
					}
					else
					{
						res.send("{ \"status\": \"User no phone number\" }");
						//res.send('User no phone number');
					}
				})
			        .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
};

exports.verifycode = function(req, res, next) {
	var head = req.headers['authorization'];
	var otp = req.headers['otp'];
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
			str += chunk;
		});
		results.on('end', function() {
			try
			{
				var obj = JSON.parse(str);
				db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results2) { 
					console.log(results2);	
					if(results2[0].auth_code__c == otp)
					{
					   	var valid = new Date();
						if(results2[0].auth_code_valid__c > valid)
						{
							var output = '';
							var room = results2[0].room__c;
							var enddate = '';
							var today = new Date();
							var startDate = new Date(today.getFullYear(), 5, 1);
							var endDate = new Date(today.getFullYear(), 6, 31);
							if((startDate < today && today < endDate))
							{
								room = results2[0].room_summer__c;
							}
							db.select("SELECT * FROM salesforce.Product2 WHERE SFID='" + room + "'")
							.then(function(results3) {
								console.log(results3);	
								date = results2[0].birthdate__c;
								date.setHours(date.getHours() + 7);
								date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
								output = '[{"id":"' + results2[0].sfid;
								output += '", "salutation":"' + results2[0].salutation;
								output += '", "name":"' + results2[0].name;
								output += '", "firstname":"' + results2[0].firstname;
								output += '", "lastname":"' + results2[0].lastname;
								output += '", "title_th__c":"' + results2[0].title_th__c;
								output += '", "first_name_th__c":"' + results2[0].first_name_th__c;		
								output += '", "last_name_th__c":"' + results2[0].last_name_th__c;
								output += '", "identification_number__c":"' + results2[0].identification_number__c;
								output += '", "passport_number__c":"' + results2[0].passport_number__c;
								if(results2[0].student_id__c != null)
								{
									output += '", "student_id__c":"' + results2[0].student_id__c;
								}
								else
								{
									output += '", "student_id__c":"';
								}
								output += '", "personemail":"' + results2[0].personemail;
								output += '", "personmobilephone":"' + results2[0].personmobilephone;
								output += '", "birthdate__c":"' + date;
								output += '", "faculty__c":"' + results2[0].faculty__c;
								output += '", "status__c":"' + results2[0].status__c;
								output += '", "allow_check_out__c":"' + results2[0].allow_check_out__c;
								if(results3.length > 0)
								{
									output += '", "room__c":"' + results3[0].name;
									output += '", "building__c":"' + results3[0].building__c;
								}
								else
								{
									output += '", "room__c":"no room';
									output += '", "building__c":"no building';
								}
								output += '", "zone__c":"' + results2[0].zone__c;
								output += '", "gender__c":"' + results2[0].gender__c;
								output += '", "billingstreet":"' + results2[0].billingstreet;
								output += '", "billingcountry":"' + results2[0].billingcountry;
								output += '", "billingcity":"' + results2[0].billingcity;
								output += '", "billingpostalcode":"' + results2[0].billingpostalcode;
								output += '", "billingstate":"' + results2[0].billingstate;
								output += '", "parent_name__c":"' + results2[0].parent_name__c;
								output += '", "parent_phone__c":"' + results2[0].parent_phone__c;
								output += '", "parent_name_2__c":"' + results2[0].parent_name_2__c;
								output += '", "parent_phone_2__c":"' + results2[0].parent_phone_2__c;
								output += '", "scholarship__c":"' + results2[0].scholarship__c;
								output += '", "disabled__c":"' + results2[0].disabled__c;
								output += '", "renew__c":"' + results2[0].renew__c;
								output += '", "graduated_from__c":"' + results2[0].graduated_from__c;
								output += '", "sleep_after_midnight__c":"' + results2[0].sleep_after_midnight__c;
								output += '", "sleep_soundly__c":"' + results2[0].sleep_soundly__c;
								output += '", "sleep_with_light_on__c":"' + results2[0].sleep_with_light_on__c;
								output += '", "love_cleaning__c":"' + results2[0].love_cleaning__c;
								output += '", "sleep_with_turn_off_air_condition__c":"' + results2[0].sleep_with_turn_off_air_condition__c;
								output += '", "check_in_comment__c":"' + results2[0].check_in_comment__c;
								output += '", "picture_url__c":"' + results2[0].picture_url__c + '"}]';
								res.json(JSON.parse(output));
							})
						    .catch(next);
						}
						else
						{
							res.send("[{ \"status\": \"Verify Code Expire\" }]");
							//res.send('Verify Code Expire');
						}
					}
					else
					{
						res.send("[{ \"status\": \"Incorrect Code\" }]");
						//res.send('Incorrect Code');
					}
				})
				.catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
};

exports.checkStatus = function(req, res, next) {
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
			str += chunk;
		});
		results.on('end', function() {
			try
			{
			    var obj = JSON.parse(str);
			    //res.send(obj.identities[0].user_id);
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) { 
					console.log(results);	
					var output = { renew : results[0].allow_renew__c, checkout : results[0].allow_check_out__c};
					res.json(output);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
};

exports.deleteuser = function(req, res, next) {
	var id = req.params.id;
	var https = require('https');

	// Build the post string from an object
	var postBody = JSON.stringify({      
		'client_id':'eXK3gp22Vo0qFEXVgOAnWuSdkYpAdEl3',
		'client_secret':'GjV6PSghfaM2ctf8miKFmO1uHZrPpz51ohFkZlAormf6_ZjF_pB5f17mAcjvKWcO',
		'audience':'https://app64319644.auth0.com/api/v2/',
		'grant_type':'client_credentials'
	});
	
	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/oauth/token',
	  //host: 'thammasat-university.herokuapp.com',
	  //path: '/',
	  port: '443',
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json',
		  		 'Content-Length': Buffer.byteLength(postBody)
	  }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
				//console.log('return:' + str);
				var obj = JSON.parse(str);
				//obj.access_token
				console.log('Id:' + id + ', Token:' + obj.access_token);
				
				var https2 = require('https');
				var options2 = {
				  host: 'app64319644.auth0.com',
				  path: '/api/v2/users/auth0|' + id,
				  port: '443',
				  method: 'DELETE',
				  headers: { 'Authorization': 'Bearer ' + obj.access_token }
				};
				console.log(options2);
				
				callback2 = function(results2) {
					var str2 = '';
					results2.on('data', function(chunk2) {
						str2 += chunk2;
					});
					results2.on('end', function() {
						try
						{
							console.log(str2);				
							if(str2 == '')
							{
								console.log('Delete Success');
								res.send('Delete Success');
							}
							else
							{
								var obj2 = JSON.parse(str2);
								res.json(obj2);
							}
						}
						catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
					});
				}
				
				var httprequest2 = https.request(options2, callback2);
				httprequest2.on('error', (e2) => {
					//console.log(`problem with request: ${e.message}`);
					res.send('problem with request: ${e2.message}');
				});
				httprequest2.end();
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.write(postBody);
	httprequest.end();
};

exports.getmobileid = function(req, res, next) {
	var id = req.params.id;
	var https = require('https');
	
	// Build the post string from an object
	var postBody = JSON.stringify({      
		'client_id':'AtH1L7wf0qZ4VsjnbNKDe8hoLaRp7YxQ',
		'client_secret':'8rYAWEc1RbtZ4RoEBWDqIV-8vZjq4-iXBpPYe7AdSViAkoy3jRKk-98JQFEuXnbc',
		'audience':'https://app64319644.auth0.com/api/v2/',
		'grant_type':'client_credentials'
	});
	
	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/oauth/token',
	  //host: 'thammasat-university.herokuapp.com',
	  //path: '/',
	  port: '443',
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json',
		  		 'Content-Length': Buffer.byteLength(postBody)
	  }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
				//console.log('return:' + str);
				var obj = JSON.parse(str);
				//obj.access_token
				console.log('Id:' + id + ', Token:' + obj.access_token);
				
				var https2 = require('https');
				var options2 = {
				  host: 'app64319644.auth0.com',
				  path: '/api/v2/users?q="' + id + '"',
				  port: '443',
				  method: 'GET',
				  headers: { 'Authorization': 'Bearer ' + obj.access_token }
				};
				console.log(options2);
				
				callback2 = function(results2) {
					var str2 = '';
					results2.on('data', function(chunk2) {
						str2 += chunk2;
					});
					results2.on('end', function() {
						try
						{
							str2 = str2.substr(1, str2.length - 2);
							console.log(str2);	
							var obj2 = JSON.parse(str2);
							console.log('Mobile Id : ' + obj2.identities[0].user_id);
							res.send(obj2.identities[0].user_id);
						}
						catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
					});
				}
				
				var httprequest2 = https.request(options2, callback2);
				httprequest2.on('error', (e2) => {
					//console.log(`problem with request: ${e.message}`);
					res.send('problem with request: ${e2.message}');
				});
				httprequest2.end();
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.write(postBody);
	httprequest.end();
};

exports.UserInfobyId = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.Account WHERE SFID='" + id + "'")
	.then(function(results) {
		//console.log(results);	
		res.json(results);
	})
    .catch(next);
};

exports.UserInfobyMobileId = function(req, res, next) {
	var id = req.params.mobileid;
	db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + id + "'")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})	
    .catch(next);
};

exports.update = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
	//console.log(req.body);
	var query = "UPDATE salesforce.Account SET identification_number__c='" + req.body.identification_number__c + "', "; 
	query += "passport_number__c='" + req.body.passport_number__c + "', ";
	query += "gender__c='" + req.body.gender__c + "', ";
	query += "title_th__c='" + req.body.title_th__c + "', ";
	query += "first_name_th__c='" + req.body.first_name_th__c + "', ";
	query += "last_name_th__c='" + req.body.last_name_th__c + "', ";
	query += "salutation='" + req.body.salutation + "', ";
	query += "firstname='" + req.body.firstname + "', ";
	query += "lastname='" + req.body.lastname + "', ";
	query += "personmobilephone='" + req.body.personmobilephone + "', ";
	query += "personemail='" + req.body.personemail + "', ";
	query += "congenital_disease__c='" + req.body.congenital_disease__c + "', ";
	query += "student_id__c='" + req.body.student_id__c + "', ";
	query += "faculty__c='" + req.body.faculty__c + "', ";
	query += "zone__c='" + req.body.zone__c + "', ";
	query += "billingstreet='" + req.body.billingstreet + "', ";
	query += "billingcity='" + req.body.billingcity + "', ";
	query += "billingstate='" + req.body.billingstate + "', ";
	query += "billingpostalcode='" + req.body.billingpostalcode + "', ";
	query += "billingcountry='" + req.body.billingcountry + "', ";
	query += "parent_name__c='" + req.body.parent_name__c + "', ";
	query += "parent_phone__c='" + req.body.parent_phone__c + "', ";
	query += "parent_name_2__c='" + req.body.parent_name_2__c + "', ";
	query += "parent_phone_2__c='" + req.body.parent_phone_2__c + "', ";
	
	query += "sleeping_time__c='" + req.body.sleeping_time__c + "', ";
	query += "sleeping_behavior__c='" + req.body.sleeping_behavior__c + "', ";
	query += "using_air_conditioner__c='" + req.body.using_air_conditioner__c + "', ";
	
	//New Field
	var Scholarship = (req.body.scholarship__c ? req.body.scholarship__c : 'false');
	console.log(Scholarship);
	console.log(req.body.scholarship__c);
	query += "scholarship__c=" + Scholarship + ", ";
	if(req.body.scholarship_name__c)
	{
		query += "scholarship_name__c='" + req.body.scholarship_name__c + "', ";
	}
	var Disable = (req.body.disabled__c ? req.body.disabled__c : 'false');
	query += "disabled__c=" + Disable + ", ";
	var Birthday = '1990-7-2';
	//query += "birthdate__c='" + req.body.birthdate__c + "', ";
	query += "parent_income__c='" + req.body.parent_income__c + "' ";
	if(req.body.year__c)
	{
		query += ", year__c=" + req.body.year__c + ", ";
	}
	if(req.body.term__c)
	{
		query += "term__c='" + req.body.term__c + "' ";
	}
	query += " WHERE SFID='" + id + "'";
	db.select(query)
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})	
    	.catch(next);
};

exports.getRoommate = function(req, res, next) {
	//if (!req.body) return res.sendStatus(400);
	db.select("SELECT * FROM salesforce.Account WHERE room__c is null and secondary__c = false")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})	
    .catch(next);
};

exports.logout = function(req, res, next) {
	var head = req.headers['authorization'];
	res.send("{ \"status\": \"Success\" }");
};

exports.getZone = function(req, res, next) {
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
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
			    var obj = JSON.parse(str);
			    //res.send(obj.identities[0].user_id);
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results2) {
					console.log(results2);
					if(results2.length > 0)
					{
						var zone = {};
						var isLampang = results2[0].zone__c.includes('Lampang ');
						var isMale = results2[0].gender__c.includes('Male');
						var isScholarShip = results2[0].scholarship__c;
						if(isLampang)
						{
							if(isMale)
							{
								zone = {zone:["TU Lampang Dome 2 with Air Conditioner (4 students)", "TU Lampang Dome 2 with Fan (4 students)"]};
							}
							else
							{
								zone = {zone:["TU Lampang Dome 1 with Air Conditioner (4 students)", "TU Lampang Dome 1 with Fan (4 students)",
										      "TU Lampang Dome 2 with Air Conditioner (4 students)", "TU Lampang Dome 2 with Fan (4 students)"]};
							}
						}
						else
						{
							if(isScholarShip)
							{
								if(isMale)
								{
									zone = {zone:["Zone M (4-person room | air-condition | share WC)", "Zone M (4-person room | air-condition | private WC)",
										          "Zone M (4-person room | fan | share WC)", "Zone M (4-person room | fan | private WC)"]};
								}
								else
								{
									zone = {zone:["Zone F (4-person room | air-condition | share WC)", "Zone F (4-person room | air-condition | private WC)",
										  		  "Zone F (4-person room | fan | share WC)", "Zone F (4-person room | fan | private WC)"]};
								}
							}
							else
							{
								if(isMale)
								{
									zone = {zone:["Zone B (4-person room)", "Zone C and E (2-person room)", "Zone C Plus (2-person room)", 
												  "Zone M (4-person room | air-condition | share WC)", "Zone M (4-person room | air-condition | private WC)",
												  "Zone M (4-person room | fan | share WC)", "Zone M (4-person room | fan | private WC)"]};
								}
								else
								{
									zone = {zone:["Zone B (4-person room)", "Zone B8 (4-person room)", "Zone C and E (2-person room)", "Zone C Plus (2-person room)", 
										  "Zone F (4-person room | air-condition | share WC)", "Zone F (4-person room | air-condition | private WC)",
										  "Zone F (4-person room | fan | share WC)", "Zone F (4-person room | fan | private WC)"]};
								}
							}
						}
						console.log(zone);	
						res.json(zone);
					}
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.checkinDetail = function(req, res, next){
	var head = req.headers['authorization'];
	var output = '[{"URL":[';
	db.select("SELECT * FROM salesforce.FYI__c where type__c='Checkin'")
	.then(function(results) {
		//console.log(results.length);	
		for(var i = 0 ; i < results.length; i++)
		{
			output += '"' + results[0].image_path__c + '", ';
		}
		output = output.substr(0, output.length - 2);
		output += ']}]';
		console.log(output);
		//res.json(results);
		res.json(JSON.parse(output));
	})	
    .catch(next);
}

exports.checkin = function(req, res, next){
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
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
			    var obj = JSON.parse(str);
			    //res.send(obj.identities[0].user_id);
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results2) {
					console.log(results2);
					//TODO: Update account and Create Asset
					if(results2.length > 0)
					{
						var enddate = '';
						var today = new Date();
						var startDate = new Date(today.getFullYear(), 5, 1);
						var endDate = new Date(today.getFullYear(), 6, 31);
						var room = results2[0].room__c;
						console.log("Today: " + today + ", Start: " + startDate + ", End: " + endDate);
						if((startDate < today && today < endDate))
						{
							console.log("Summer Term");
							enddate = today.getFullYear() + '-7-31';
							room = results2[0].room_summer__c;
						}
						else
						{
							console.log("Normal Term");
							enddate = today.getFullYear() + '-5-31';
						}
						
						if (room != null)
						{
							db.select("UPDATE salesforce.Account SET Status__c='Checkin', allow_check_out__c=false, renew__c=false, check_in_comment__c='" + req.body.comment + "' WHERE SFID='" + results2[0].sfid + "' RETURNING *")
							.then(function(results3) {
								console.log(results3);	
								if(results3.length > 0)
								{
									db.select("SELECT * FROM salesforce.product2 where sfid='" + room + "'")
									.then(function(result4) {
										db.select("INSERT INTO salesforce.Asset (Name, accountId, product2id, UsageEndDate, contract_end__c, active__c) VALUES ('" + result4[0].name + "', '" + results2[0].sfid + "', '" + room + "', '" + enddate + "', '" + enddate + "', true)")
										.then(function(results5) {
											console.log(results5);	
											res.send("{ \"status\": \"Success\"}");
										})
									    .catch(next);
									})
								    .catch(next);
								}
							})
						    .catch(next);
						}
						else
						{
							console.log("No Room Assign");
							res.send("{ \"status\": \"fail\", detail: \"No room assign, Please contact staff.\"}");
						}
					}
					else
					{
						res.send("{ \"status\": \"fail\", detail: \"User can't Login. Please contact staff.\"}");
						
					}
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();	
};

exports.RequestCheckout = function(req, res, next) {
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);
	//console.log(req.body);
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
				//TODO: Open Case
				var obj = JSON.parse(str);
				db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					db.select("SELECT * FROM salesforce.RecordType WHERE name='Checkout'")
					.then(function(results2) {
						var date = req.body.date;
						date = date.substring(3, 5) + "/" + date.substring(0, 2) + "/" + date.substring(6, 10);
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, checkout_date__c, type, problem_type__c, subject, description, reason_to_check_out__c) ";
							query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', '" + date + "', '";
							query += "Request', 'Checkout', 'Checkout', '" + req.body.comment + "', '" + req.body.reason +"')";
							//console.log(query);
							db.select(query)
							.then(function(results3) {
								
								res.send('{ \"status\": \"success\" }');
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

exports.checkout = function(req, res, next){
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
			str += chunk;
		});
		results.on('end', function() {
			try
			{
				var obj = JSON.parse(str);
				db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results2) {
					if(results2.length > 0)
					{
					    var obj = JSON.parse(str);
					    //res.send(obj.identities[0].user_id);
					    var query = "UPDATE salesforce.Account SET Status__c='Checkout', room__c='' WHERE SFID='" + results2[0].sfid + "' RETURNING *";
					    if(results2[0].renew__c == true)
				    	{
					    	query = "UPDATE salesforce.Account SET Status__c='Checkout' WHERE SFID='" + results2[0].sfid + "' RETURNING *";
				    	}
					    var today = new Date();
						var startDate = new Date(today.getFullYear(), 5, 1);
						var endDate = new Date(today.getFullYear(), 6, 31);
						if((startDate < today && today < endDate))
						{
							enddate = today.getFullYear() + '-5-31';
							query = "UPDATE salesforce.Account SET Status__c='Checkout', room_summer__c='' WHERE SFID='" + results2[0].sfid + "' RETURNING *";
						}
					    db.select(query)
						.then(function(results3) {
							console.log(results3);
							//TODO: Query Active Asset and Update to deactive and Usage end date to TODAY
							db.select("SELECT * FROM salesforce.Asset WHERE accountId='" + results3[0].sfid + "' and active__c=true")
							.then(function(results4) {
								console.log(results4);	
								var today = new Date();
								var todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
								db.select("UPDATE salesforce.Asset SET active__c=false, usageenddate='" + todayDate + "' WHERE SFID='" + results4[0].sfid + "' RETURNING *")
								.then(function(results5) {
									console.log(results5);	
									//res.json(results);
									res.send("{ \"status\": \"Success\" }");
								})
							    .catch(next);
							})
						    .catch(next);
						})
					    .catch(next);
					}
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.renew = function(req, res, next) {
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
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
			    var obj = JSON.parse(str);
			    //TODO: Open Case Renew
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results2) {
					if(results2.length > 0)
					{
					    var query = "UPDATE salesforce.Account SET renew__c=true WHERE SFID='" + results2[0].sfid + "'";
					    if(req.body.summer == 'true')
				    	{
					    	query = "UPDATE salesforce.Account SET renew__c=true, room_summer__c='" + results2[0].room__c + "' WHERE SFID='" + results2[0].sfid + "'";
				    	}
					    db.select(query)
						.then(function(results3) {
							console.log(results3);
							res.send("{ \"status\": \"Success\", message:\"หากต้องการเปลี่ยนห้องให้ดำเนินการภายใน 1 เดือน\" }");
						})
					    .catch(next);
					}
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
};

exports.getprimary = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.roommate__c WHERE co_roommate__c='" + id + "'")
	.then(function(results) {
		console.log(results);	
		if(results.length > 0)
		{
			db.select("SELECT * FROM salesforce.Account WHERE sfid='" + results[0].primary_roommate__c + "'")
			.then(function(results2) {
				res.json(results2);
			})
		    .catch(next);
		}
		else
		{
			res.send("This student didn't have primary roommate.");
		}
	})
    .catch(next);
}

exports.getroommate = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.roommate__c WHERE co_roommate__c='" + id + "'")
	.then(function(results) {
		console.log(results);	
		if(results.length > 0)
		{
			db.select("SELECT * FROM salesforce.roommate__c WHERE primary_roommate__c='" + results[0].primary_roommate__c + "'")
			.then(function(results2) {
				var listacc = '(\'' + results[0].primary_roommate__c + '\', ';
				for(var i = 0 ; i < results2.length ; i++)
				{
					listacc += '\'' + results2[i].co_roommate__c + '\', ';
				}
				
				if(results2.length > 0)
				{
					listacc = listacc.substr(0, listacc.length - 2) + ')';
					db.select("SELECT * FROM salesforce.Account WHERE SFID IN " + listacc)
					.then(function(results3) {
						res.json(results3);
					})
					.catch(function(e){console.log(e);});
				}
			})
		    .catch(next);
		}
		else
		{
			res.send("This student didn't have primary roommate.");
		}
	})
    .catch(next);
}

