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
	
	var identification_number__c = (req.body.identification_number__c=='undefined' || req.body.identification_number__c==null ||req.body.identification_number__c=='null'? '' : req.body.identification_number__c);
	var passport_number__c  = (req.body.passport_number__c =='undefined' || req.body.passport_number__c ==null || req.body.passport_number__c=='null'? '' :req.body.passport_number__c);
	var gender__c = (req.body.gender__c=='undefined' || req.body.gender__c==null ||req.body.gender__c=='null'? '' : req.body.gender__c);
	var title_th__c = (req.body.title_th__c=='undefined' || req.body.title_th__c==null ||req.body.title_th__c=='null'? '' : req.body.title_th__c);
	var first_name_th__c = (req.body.first_name_th__c=='undefined' || req.body.first_name_th__c==null ||req.body.first_name_th__c=='null'? '' : req.body.first_name_th__c);
	var last_name_th__c = (req.body.last_name_th__c=='undefined' || req.body.last_name_th__c==null ||req.body.last_name_th__c=='null'? '' : req.body.last_name_th__c);
	var salutation = (req.body.salutation=='undefined' || req.body.salutation==null ||req.body.salutation=='null'? '' :req.body.salutation);
	var firstname = (req.body.firstname=='undefined' || req.body.firstname==null ||req.body.firstname=='null'? '' :req.body.firstname);
	var lastname = (req.body.lastname=='undefined' || req.body.lastname==null ||req.body.lastname=='null'? '' :req.body.lastname);
	var birthdate__c =(req.body.birthdate__c=='undefined' || req.body.birthdate__c==null ||req.body.birthdate__c=='null'? '' : req.body.birthdate__c);
	var mobilephone = (req.body.mobilephone=='undefined' || req.body.mobilephone==null ||req.body.mobilephone=='null'? '' :req.body.mobilephone);
	var email = (req.body.email=='undefined' || req.body.email==null ||req.body.email=='null'? '' : req.body.email);
	var Scholarship = (req.body.scholarship__c ? req.body.scholarship__c : 'false');
	var Scholarship_Name = (req.body.scholarship_name__c=='undefined' || req.body.scholarship_name__c==null || req.body.scholarship_name__c=='null'  ? '' : req.body.scholarship_name__c);
	var Disable = (req.body.disabled__c ? req.body.disabled__c : 'false');
	var congenital_disease__c = (req.body.congenital_disease__c=='undefined' || req.body.congenital_disease__c==null || req.body.congenital_disease__c=='null'? '' : req.body.congenital_disease__c);
	var student_id__c = (req.body.student_id__c=='undefined' || req.body.student_id__c==null ||req.body.student_id__c=='null'? '' : req.body.student_id__c);
	var faculty__c = (req.body.faculty__c=='undefined' || req.body.faculty__c==null ||req.body.faculty__c=='null'? '' : req.body.faculty__c);
	var request_zone__c = (req.body.request_zone__c=='undefined' || req.body.request_zone__c==null ||req.body.request_zone__c=='null'? '' : req.body.request_zone__c);
	
	var street = (req.body.street=='undefined' || req.body.street==null ||req.body.street=='null'? '' : req.body.street);
	var city = (req.body.city=='undefined' || req.body.city==null ||req.body.city=='null'? '' : req.body.city);
	var state = (req.body.state=='undefined' || req.body.state==null ||req.body.state=='null'? '' : req.body.state);
	var postalcode = (req.body.postalcode=='undefined' || req.body.postalcode==null ||req.body.postalcode=='null'? '' : req.body.postalcode);
	var country = (req.body.country=='undefined' || req.body.country==null ||req.body.country=='null'? '' : req.body.country);
	
	var parent_name__c = (req.body.parent_name__c=='undefined' || req.body.parent_name__c==null ||req.body.parent_name__c=='null'? '' : req.body.parent_name__c);
	var parent_phone__c = (req.body.parent_phone__c=='undefined' || req.body.parent_phone__c==null ||req.body.parent_phone__c=='null'? '' : req.body.parent_phone__c);
	var parent_income__c = (req.body.parent_income__c=='undefined' || req.body.parent_income__c==null ||req.body.parent_income__c=='null'? '' : req.body.parent_income__c);
	var parent_name_2__c = (req.body.parent_name_2__c=='undefined' || req.body.parent_name_2__c==null ||req.body.parent_name_2__c=='null'? '' : req.body.parent_name_2__c);
	var parent_phone_2__c = (req.body.parent_phone_2__c=='undefined' || req.body.parent_phone_2__c==null ||req.body.parent_phone_2__c=='null'? '' : req.body.parent_phone_2__c);
	
	
	var query2 = "INSERT INTO salesforce.lead (identification_number__c, passport_number__c, gender__c, title_th__c, ";
	query2 += "first_name_th__c, last_name_th__c, salutation, firstname, lastname, mobilephone, email, congenital_disease__c, ";
	query2 += "student_id__c, faculty__c, request_zone__c, street, city, state, postalcode, ";
	query2 += "country, parent_name__c, parent_phone__c, parent_name_2__c, parent_phone_2__c, Scholarship__c,";
	query2 += " Scholarship_Name__c, Disabled__c, Birthdate__c, Parent_Income__c) VALUES ('"; 
	query2 += identification_number__c + "', '" + passport_number__c + "', '" + gender__c + "', '";
	query2 += title_th__c + "', '" + first_name_th__c + "', '" + last_name_th__c + "', '";
	query2 += salutation + "', '" + firstname + "', '" + lastname + "', '" + mobilephone + "', '";
	query2 += email + "', '" + congenital_disease__c + "', '" + student_id__c + "', '" + faculty__c + "', '";
	query2 += request_zone__c + "', '" + street + "', '" + city + "', '";
	query2 += state + "', '" + postalcode + "', '" + country + "', '" + parent_name__c + "', '";
	query2 += parent_phone__c + "', '" + parent_name_2__c + "', '" + parent_phone_2__c + "', '";
	//query2 += Scholarship + "', '" + Scholarship_Name + "', '";
	//query2 += Disable + "', '" + birthdate__c + "', '" + parent_income__c + "') RETURNING *";
	
	
	
	var query = "INSERT INTO salesforce.lead (identification_number__c, passport_number__c, gender__c, title_th__c, ";
	query += "first_name_th__c, last_name_th__c, salutation, firstname, lastname, mobilephone, email, congenital_disease__c, ";
	query += "student_id__c, faculty__c, request_zone__c, street, city, state, postalcode, ";
	query += "country, parent_name__c, parent_phone__c, parent_name_2__c, parent_phone_2__c, Scholarship__c,";
	query += " Scholarship_Name__c, Disabled__c, Birthdate__c, Parent_Income__c) VALUES ('"; 
	query += req.body.identification_number__c + "', '" + req.body.passport_number__c + "', '" + req.body.gender__c + "', '";
	query += req.body.title_th__c + "', '" + req.body.first_name_th__c + "', '" + req.body.last_name_th__c + "', '";
	query += req.body.salutation + "', '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.mobilephone + "', '";
	query += req.body.email + "', '" + req.body.congenital_disease__c + "', '" + req.body.student_id__c + "', '" + req.body.faculty__c + "', '";
	query += req.body.request_zone__c + "', '" + req.body.street + "', '" + req.body.city + "', '";
	query += req.body.state + "', '" + req.body.postalcode + "', '" + req.body.country + "', '" + req.body.parent_name__c + "', '";
	query += req.body.parent_phone__c + "', '" + req.body.parent_name_2__c + "', '" + req.body.parent_phone_2__c + "', '";
	query += Scholarship + "', '" + Scholarship_Name + "', '";
	query += Disable + "', '" + req.body.birthdate__c + "', '" + req.body.parent_income__c + "') RETURNING *";
	
	
	db.select(query)
	.then(function(results) {
		setTimeout(function () {
			db.select("SELECT * FROM salesforce.lead WHERE id='" + results[0].id + "'")
			.then(function(results2) {
				console.log(results2);	
				res.json(results2);
			})
		    .catch(next);
		}, 5000) 
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
	console.log(req.body);
	var query = "UPDATE salesforce.Lead SET identification_number__c='" + req.body.identification_number__c + "', "; 
	query += "passport_number__c='" + req.body.passport_number__c + "', ";
	query += "gender__c='" + req.body.gender__c + "', ";
	query += "title_th__c='" + req.body.title_th__c + "', ";
	query += "first_name_th__c='" + req.body.first_name_th__c + "', ";
	query += "last_name_th__c='" + req.body.last_name_th__c + "', ";
	query += "salutation='" + req.body.salutation + "', ";
	query += "firstname='" + req.body.firstname + "', ";
	query += "lastname='" + req.body.lastname + "', ";
	query += "mobilephone='" + req.body.mobilephone + "', ";
	query += "email='" + req.body.email + "', ";
	query += "congenital_disease__c='" + req.body.congenital_disease__c + "', ";
	query += "student_id__c='" + req.body.student_id__c + "', ";
	query += "faculty__c='" + req.body.faculty__c + "', ";
	query += "request_zone__c='" + req.body.request_zone__c + "', ";
	query += "street='" + req.body.street + "', ";
	query += "city='" + req.body.city + "', ";
	query += "state='" + req.body.state + "', ";
	query += "postalcode='" + req.body.postalcode + "', ";
	query += "country='" + req.body.country + "', ";
	query += "parent_name__c='" + req.body.parent_name__c + "', ";
	query += "parent_phone__c='" + req.body.parent_phone__c + "', ";
	query += "parent_name_2__c='" + req.body.parent_name_2__c + "', ";
	query += "parent_phone_2__c='" + req.body.parent_phone_2__c + "', ";
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
	query += "birthdate__c='" + req.body.birthdate__c + "', ";
	query += "parent_income__c='" + req.body.parent_income__c + "' ";
	if(req.body.year__c)
	{
		query += ", year__c=" + req.body.year__c + ", ";
	}
	if(req.body.term__c)
	{
		query += "term__c='" + req.body.term__c + "' ";
	}
	query += " WHERE SFID='" + id + "' RETURNING *";
	db.select(query)
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})	
    .catch(next);
}