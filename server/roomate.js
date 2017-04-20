var db = require('./pghelper');

exports.getAccountRoomate = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.roommate__c WHERE primary_roommate__c='" + id + "'")
	.then(function(results) {
		//console.log(results);
		var listAcc = "";
		for(var i = 0 ; i < results.length ; i++)
		{
			listAcc += "'" + results[i].co_roommate__c + "', ";
		}
		if(results.length > 0)
		{	
			listAcc = listAcc.substr(0, listAcc.length - 2);
		}
		db.select("SELECT * FROM salesforce.Account WHERE SFID IN (" + listAcc + ")")
		.then(function(results2) {
			res.json(results2);
		})
		.catch(next);
	})
    .catch(next);
}

exports.createRoomate = function(req, res, next) {
	var p = req.headers['primary'];
	var c = req.headers['co'];
	db.select("SELECT * FROM salesforce.Account WHERE identification_number__c ='" + c + "' or passport_number__c = '" + c + "' or student_id__c='" + c + "'")
	.then(function(results) {
		if(results.length > 0)
		{
			db.select("INSERT INTO salesforce.roommate__c (primary_roommate__c, co_roommate__c) VALUES ('" + p + "', '" + results[0].sfid + "') RETURNING *" )
			.then(function(results2) {
				console.log(results2);	
				res.json(results2);
			})
		    .catch(next);
		}
		else
		{
			res.send("Not Found Account");
		}
	})
	.catch(next);
}

exports.deleteRoomate = function(req, res, next) {
	var id = req.params.id;
	db.select("DELETE FROM salesforce.roommate__c WHERE id='" + id + "'" )
	.then(function(results) {
		//console.log(results);	
		res.json(results);
	})
    .catch(next);
}

exports.updateRoomate = function(req, res, next) {
	var id = req.params.id;
	var p = req.headers['primary'];
	var c = req.headers['co'];
	
	db.select("SELECT * FROM salesforce.Account WHERE identification_number__c ='" + c + "' or passport_number__c = '" + c + "' or student_id__c='" + c + "'")
	.then(function(results) {
		if(results.length > 0)
		{
			var query = "UPDATE salesforce.roommate__c SET primary_roommate__c='" + p + "', "; 
			query += "co_roommate__c='" + results[0].sfid + "' ";
			query += " WHERE id='" + id + "' RETURNING *";
			db.select(query)
			.then(function(results2) {
				console.log(results);	
				res.json(results[0]);
			})	
		    .catch(next);
		}
	})	
    .catch(next);
}
