var db = require('./server/pghelper');

function inactiveContractExpired()
{
	var listId = '(';
	var listAccId = '(';
	var to;
	var payload;
	db.select("SELECT * FROM salesforce.Asset WHERE active__c=true and contract_end__c < NOW()")
	.then(function(results) {
		for(var i = 0 ; i < results.length ; i++)
		{
			listId += '\'' + results[i].sfid + '\', ';
			listAccId += '\'' + results[i].accountid + '\', ';
		}
    
    if(results.length > 0)
		{
      db.select("UPDATE salesforce.Asset SET active__c=false WHERE SFID IN " + listId)
	    .then(function(results2) {
        db.select("UPDATE salesforce.Account SET status__c='Inactive', mobile_id__c='' WHERE renew__c=false and SFID IN " + listAccId + "  RETURNING *")
				.then(function(results3) {
					console.log(results3);
          for(var i = 0 ; i < results3.length; i++)
					{
            var https = require('https');
            var options = {
              host: 'thammasat-university.herokuapp.com',
              path: '/deleteuser/' + results3[i].sfid,
              port: '443',
              method: 'POST'
              }
            };
            callback = function(results) {
              var str = '';
              results.on('data', function(chunk) {
                  str += chunk;
              });
              results.on('end', function() {
                console.log("Delete account: " + results3[i].sfid);
              });
            }
            var httprequest = https.request(options, callback);
            httprequest.on('error', (e) => {
              res.send('problem with request: ${e.message}');
            });
            httprequest.write(postBody);
            httprequest.end();
          }
				})
				.catch(function(e){console.log(e);});
      })
	    .catch(function(e){console.log(e);});   
    }
	})
	.catch(function(e){console.log(e);});
}
inactiveContractExpired();
