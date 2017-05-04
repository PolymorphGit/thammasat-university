var db = require('./pghelper');

exports.getAccountRoommate = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.roommate__c WHERE primary_roommate__c='" + id + "'")
	.then(function(results) {
		//console.log(results);
		if(results.length > 0)
		{
			var listAcc = "";
			for(var i = 0 ; i < results.length ; i++)
			{
				listAcc += "'" + results[i].co_roommate__c + "', ";
			}	
			listAcc = listAcc.substr(0, listAcc.length - 2);
			
			db.select("SELECT * FROM salesforce.Account WHERE SFID IN (" + listAcc + ")")
			.then(function(results2) {
				res.json(results2);
			})
			.catch(next);
		}
		else
		{
			res.send("No Roommate");
		}
	})
    .catch(next);
}

exports.createRoommate = function(req, res, next) {
	var p = req.headers['primary'];
	var c = req.headers['co'];
	var zone = req.headers['z'];
	
	db.select("SELECT * FROM salesforce.Account WHERE (identification_number__c ='" + c + "' or passport_number__c = '" + c + "' or student_id__c='" + c + "') and secondary__c = false")
	.then(function(results) {
		console.log(p);
		console.log("zone:" + zone + ", account zone:" + results[0].zone__c);
		if(results.length > 0 && p != results[0].sfid && zone != results[0].zone__c)
		{
			console.log(results);
			db.select("SELECT * FROM salesforce.roommate__c WHERE primary_roommate__c='" + results[0].sfid + "'")
			.then(function(results2) { 
				console.log(results2);
				console.log(zone);
				if(results2.length == 0)
				{
					db.select("INSERT INTO salesforce.roommate__c (primary_roommate__c, co_roommate__c) VALUES ('" + p + "', '" + results[0].sfid + "') RETURNING *" )
					.then(function(results3) { 
						db.select("UPDATE salesforce.Account SET secondary__c=true WHERE SFID='" + results[0].sfid + "' RETURNING *")
						.then(function(results4) {
							console.log(results3);	
							res.json(results);
						})	
					    .catch(next);
					})
				    .catch(next);
				}
				else 
				{
					res.json("This student already have roommate.");
				}
			})
		    .catch(next);
		}
		else if (zone != results[0].zone__c)
		{
			res.json("This student zone is not match.");
		}
		else
		{
			res.send("Not Found Account");
		}
	})
	.catch(next);
}

exports.deleteRoommate = function(req, res, next) {
	var id = req.params.id;
	db.select("DELETE FROM salesforce.roommate__c WHERE co_roommate__c='" + id + "'" )
	.then(function(results) {
		db.select("UPDATE salesforce.Account SET secondary__c=false WHERE SFID='" + id + "' RETURNING *")
		.then(function(results2) {
			console.log(results2);	
			res.json(results2);
		})	
	    .catch(next);
	})
    .catch(next);
}

exports.updateRoommate = function(req, res, next) {
	var id = req.params.id;
	var p = req.headers['primary'];
	var c = req.headers['co'];
	var zone = req.headers['zone'];
	
	db.select("SELECT * FROM salesforce.Account WHERE (identification_number__c ='" + c + "' or passport_number__c = '" + c + "' or student_id__c='" + c + "') and secondary__c = false")
	.then(function(results) {
		if(results.length > 0 && p != results[0].sfid)
		{
			db.select("SELECT * FROM salesforce.roommate__c WHERE primary_roommate__c='" + results[0].sfid + "'")
			.then(function(results2) { 
				if(results2.length == 0)
				{
					var query = "UPDATE salesforce.roommate__c SET primary_roommate__c='" + p + "', "; 
					query += "co_roommate__c='" + results[0].sfid + "' ";
					query += " WHERE co_roommate__c='" + id + "' RETURNING *";
					db.select(query)
					.then(function(results2) {
						db.select("UPDATE salesforce.Account SET secondary__c=true WHERE SFID='" + results[0].sfid + "' RETURNING *")
						.then(function(results3) {
							db.select("UPDATE salesforce.Account SET secondary__c=false WHERE SFID='" + id + "' RETURNING *")
							.then(function(results4) {
								console.log(results);	
								res.json(results[0]);
							})	
						    .catch(next);
						})	
					    .catch(next);
					})	
				    .catch(next);
				}
				else
				{
					res.json("This Student already have roommate.");
				}
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
