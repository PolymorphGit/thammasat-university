var db = require('./pghelper');

exports.getInfobyId = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.Lead WHERE SFID='" + id + "'")
	.then(function(results) {
		//console.log(results);	
		res.json(results);
	})
    .catch(next);
}

exports.createLead = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	//console.log(req.body);
	var query = "INSERT INTO salesforce.lead (Identification_Number__c, Passport_Number__c, Gender__c, Title_TH__c, ";
	query += "First_Name_TH__c, Last_Name_TH__c, Salutation, FirstName, LastName, MobilePhone, Email, Congenital_Disease__c, ";
	query += "Student_ID__c, Faculty__c, Request_Zone__c, Street, City, State, PostalCode, ";
	query += "Country, Parent_Name__c, Parent_Phone__c) VALUES ("; 
	query += req.body.Identification_Number__c + ", " + req.body.Passport_Number__c + ", " + req.body.Gender__c + ", ";
	query += req.body.Title_TH__c + ", " + req.body.First_Name_TH__c + ", " + req.body.Last_Name_TH__c + ", ";
	query += req.body.Salutation + ", " + req.body.FirstName + ", " + req.body.LastName + ", " + req.body.MobilePhone + ", ";
	query += req.body.Email + ", " + req.body.Congenital_Disease__c + ", " + req.body.Student_ID__c + ", " + req.body.Faculty__c + ", ";
	query += req.body.Request_Zone__c + ", " + req.body.Street + ", " + req.body.City + ", ";
	query += req.body.State + ", " + req.body.PostalCode + ", " + req.body.Country + ", " + req.body.Parent_Name__c + ", ";
	query += req.body.Parent_Phone__c + ") RETUNING *";
	db.select(query)
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})
    .catch(next);
}

exports.deleteLead = function(req, res, next) {
	var id = req.params.id;
	db.select("DELETE FROM salesforce.Lead WHERE SFID='" + id + "'" )
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})
    .catch(next);
}

exports.updateLead = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
	//console.log(req.body);
	var query = "UPDATE salesforce.Lead SET identification_number__c='" + req.body.identification_number__c + "', "; 
	query += "passport_number__c='" + req.body.passport_number__c + "', ";
	query += "Gender__c='" + req.body.Gender__c + "', ";
	query += "Title_TH__c='" + req.body.Title_TH__c + "', ";
	query += "First_Name_TH__c='" + req.body.First_Name_TH__c + "', ";
	query += "Last_Name_TH__c='" + req.body.Last_Name_TH__c + "', ";
	query += "Salutation='" + req.body.Salutation + "', ";
	query += "FirstName='" + req.body.FirstName + "', ";
	query += "LastName='" + req.body.LastName + "', ";
	query += "MobilePhone='" + req.body.MobilePhone + "', ";
	query += "Email='" + req.body.Email + "', ";
	query += "Congenital_Disease__c='" + req.body.Congenital_Disease__c + "', ";
	query += "Student_ID__c='" + req.body.Student_ID__c + "', ";
	query += "Faculty__c='" + req.body.Faculty__c + "', ";
	query += "Request_Zone__c='" + req.body.Faculty__c + "', ";
	query += "Street='" + req.body.Street + "', ";
	query += "City='" + req.body.City + "', ";
	query += "State='" + req.body.State + "', ";
	query += "PostalCode='" + req.body.PostalCode + "', ";
	query += "Country='" + req.body.Country + "', ";
	query += "parent_name__c='" + req.body.parent_name__c + "', ";
	query += "parent_phone__c='" + req.body.parent_phone__c + "' ";
	query += " WHERE SFID='" + id + "'";
	db.select(query)
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})	
    .catch(next);
}