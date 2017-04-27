var db = require('./pghelper');

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
				console.log(results);	
				res.json(results);
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
	query += "request_zone__c='" + req.body.request_zone__c + "', ";
	query += "billingstreet='" + req.body.billingstreet + "', ";
	query += "billingcity='" + req.body.billingcity + "', ";
	query += "billingstate='" + req.body.billingstate + "', ";
	query += "billingpostalcode='" + req.body.billingpostalcode + "', ";
	query += "billingcountry='" + req.body.billingcountry + "', ";
	query += "parent_name__c='" + req.body.parent_name__c + "', ";
	query += "parent_phone__c='" + req.body.parent_phone__c + "', ";
	query += "parent_name_2__c='" + req.body.parent_name_2__c + "', ";
	query += "parent_phone_2__c='" + req.body.parent_phone_2__c + "' ";
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
	res.send("Success");
};

exports.checkinDetail = function(req, res, next){
	var head = req.headers['authorization'];
	var output = '[{"URL":[';
	db.select("SELECT * FROM salesforce.Master_Checklist__c")
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
		    db.select("UPDATE salesforce.Account SET Status__c='Checkin', allow_check_out__c=false WHERE Mobile_Id__c='" + obj.identities[0].user_id + "' RETURNING *")
			.then(function(results2) {
				console.log(results2);
				//TODO: Query Room__c on account and Create Asset
				db.select("SELECT * FROM salesforce.Account WHERE SFID='" + results2[0].sfid + "'")
				.then(function(results3) {
					console.log(results3);	
					if(results3.length > 0)
					{
						var enddate = '';
						var today = new Date();
						var startDate = new Date(today.getFullYear(), 1, 1);
						var endDate = new Date(today.getFullYear(), 5, 31);
						var startDate2 = new Date(today.getFullYear(), 8, 1);
						var endDate2 = new Date(today.getFullYear(), 12, 31);
						if((startDate < today && today < endDate) || (startDate2 < today && today < endDate2))
						{
							enddate = today.getFullYear() + '-5-31';
						}
						else
						{
							enddate = today.getFullYear() + '-7-31';
						}
						db.select("INSERT INTO salesforce.Asset (Name, accountId, product2id, UsageEndDate, contract_end__c, active__c) VALUES ('Room', '" + results2[0].sfid + "', '" + results3[0].room__c + "', '" + enddate + "', '" + enddate + "', true)")
						.then(function(results4) {
							console.log(results4);	
							res.send("Success");
						})
					    .catch(next);
					}
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
};

exports.RequestCheckout = function(req, res, next) {
	var body = '';
	req.on('data', function(chunk) 
	{
		try { body += chunk; }
		catch(ex) { res.send("Request is invalid format."); }
	});
	req.on('end', function() 
	{
		console.log(body);
		body = JSON.parse(body);
		//Open Case type checkout
		res.json(body);
	});
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
		    db.select("UPDATE salesforce.Account SET Status__c='Checkout' WHERE Mobile_Id__c='" + obj.identities[0].user_id + "' RETURNING *")
			.then(function(results2) {
				console.log(results2);
				//TODO: Query Active Asset and Update to deactive and Usage end date to TODAY
				db.select("SELECT * FROM salesforce.Asset WHERE accountId='" + results2[0].sfid + "' and active__c=true")
				.then(function(results3) {
					console.log(results3);	
					var today = new Date();
					var todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
					db.select("UPDATE salesforce.Asset SET active__c=false, usageenddate='" + todayDate + "' WHERE SFID='" + results3[0].sfid + "' RETURNING *")
					.then(function(results4) {
						console.log(results4);	
						//res.json(results);
						res.send("Success");
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
};