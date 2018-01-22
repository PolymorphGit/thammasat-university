var db = require('./pghelper');
var md5 = require('md5');

exports.topupone2callprepare = function(req, res, next) {
  var head = req.headers['authorization'];
  var mobile = req.headers['mobile'];
  var price = req.headers['price'];
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
				      .then(function(results3) {
					var refid = today.valueOf();
					var hash = md5('TU_HoUseTu2018EzHn*ZDr^561' + refid + mobile + results3.personemail + price);
					var https2 = require('https');

					var options2 = {
					  host: 'easycard.club',
					  path: '/api/TUHOUSE/TopupOne2call_prepare.php?refid='+refid+'&msisdn='+mobile+'&email='+hash+'&price='+price+'&hash='+hash,
					  port: '443',
					  method: 'GET',
					  headers: { }
					};

					callback2 = function(results2) {
					  var str2 = '';
					  results2.on('data', function(chunk2) {
					    str2 += chunk;
					  });
					  results2.on('end', function() {
					    try
					    {
					      res.send("Topup One2call Prepare, Price:" + price);
					    }
					    catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
					  });
					}

					var httprequest2 = https2.request(options, callback2);
					httprequest2.on('error', (e) => {
					  //console.log(`problem with request: ${e.message}`);
					  res.send('problem with request: ${e.message}');
					});
					httprequest2.end();
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

exports.topupone2callconfirm = function(req, res, next) {
  var head = req.headers['authorization'];
  var otp = req.headers['otp'];
  
  res.send("Topup One2call Confirm, OTP:" + otp);
}
