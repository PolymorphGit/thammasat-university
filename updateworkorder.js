var db = require('./server/pghelper');
var Pusher = require('pusher');

function updateWorkOrder() {
    //console.log('Notification');
    var query = "UPDATE salesforce.WorkOrder SET salesforce.WorkOrder.caseid = ";
    query += "(SELECT sfid FROM salesforce.Case WHERE salesforce.Case.id = salesforce.WorkOrder.case_heroku_id__c) "
    query += "WHERE salesforce.WorkOrder.caseid is null RETURNING *";
    db.select(query)
    .then(function(results) {
      console.log("Record : " + results.length);
      if(results.length > 0)
      {
        for(var i = 0 ; i < results.length ; i++)
        {
          console.log('Update WorkOrder Id:' + results[i].id);
        }
      }
    })
    
}
updateWorkOrder();

function CheckNull(){
	db.select("SELECT * FROM salesforce.WorkOrder WHERE caseid is null")	
	.then(function(results) {
		console.log("Record : " + results.length);
		if(results.length > 0)
		{
			for(var i = 0 ; i < results.length ; i++)
			{
		  		console.log('Update WorkOrder Id:' + results[i].id);
			}
		}
	})
}
//CheckNull();
