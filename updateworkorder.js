var db = require('./server/pghelper');
var Pusher = require('pusher');

function updateWorkOrder() {
    //console.log('Notification');
    var query = "UPDATE salesforce.WorkOrder SET salesforce.WorkOrder.caseid = ";
    query += "(SELECT sfid FROM salesforce.Case WHERE salesforce.Case.id = salesforce.WorderOrder.case_heroku_id__c) "
    query += "WHERE salesforce.WorkOrder.caseid i null RETURNING *";
    db.select(query)
	  .then(function(results) {
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
