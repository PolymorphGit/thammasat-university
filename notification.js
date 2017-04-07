var db = require('./server/pghelper');
var Pusher = require('pusher');
//var Pusher = require('cloud/modules/node_modules/pusher/parse');

var pusher = new Pusher({
  appId: '321597',
  key: 'f57a4e884d78cc6e048a',
  secret: '6bd62949b0bcbf8b22a8',
  encrypted: true
});

exports.push = function(req, res, next) 
{
	var id = req.headers['SFID'];
	var type = req.headers['type'];
	var result = true;
	if(type == 'billing')
	{
		result = getBilling(id);
	}
	else if(type == 'mailing')
	{
	
	}
	else if(type == 'Accept case')
	{
	
	}
	else if(type == 'Close case')
	{
	
	}
	else if(type == 'Accept clean')
	{
	
	}
	else if(type == 'Reject clean')
	{
	
	}
	else if(type == 'Complete clean')
	{
	
	}
	else if(type == 'Allow checkout')
	{
	
	}
	else if(type == 'Deny checkout')
	{
	
	}
	else
	{
	
	}
	
	if(result == false)
	{
		res.send("Fail");
	}
	res.send("Success");
}

function getBilling(id)
{
	//TODO: get Bill detail
	var invoiceNo;
	var amount;
	var duedate;
	db.select("SELECT * FROM salesforce.Payment__c WHERE SFID='" + id + "'")
	.then(function(results) {
		pusher.trigger(id, 'Billing', {
			"Name": invoiceNo,
			"Amount": amount,
			message: 'คุณมียอดค่าใช้ ' + amount + " บาท กำหนดชำระวันที่ " + duedate 
		});
		return true;
	})
	.catch(next);
}

function testSend()
{
	var events = [{
	  channel: "my-channel-1",
	  name: "Billing",
	  data: {message: "hello world"}
	},
	{
	  channel: "my-channel-2",
	  name: "Billing",
	  data: {message: "hello another world"}
	},
	{
	  channel: "my-channel-3",
	  name: "Billing",
	  data: {message: "hello another world"}
	},
	{
	  channel: "my-channel-4",
	  name: "Billing",
	  data: {message: "hello another world"}
	},
	{
	  channel: "my-channel-5",
	  name: "Billing",
	  data: {message: "hello another world"}
	}];

	pusher.triggerBatch(events);
}