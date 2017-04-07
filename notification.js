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
	var id = req.headers['sfid'];
	var type = req.headers['type'];
	var result = true;
	if(type == 'billing')
	{
		result = getBilling(id, next);
	}
	else if(type == 'mailing')
	{
		result = getMailing(id, next);
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
		testSend();
	}
	
	if(result == false)
	{
		res.send("Fail");
	}
	res.send("Success");
}

function getBilling(id, next)
{
	//TODO: get Bill detail
	var invoiceNo;
	var amount;
	var duedate;
	var to;
	db.select("SELECT * FROM salesforce.Invoice__c WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].student_name__c;
		invoiceNo = results[0].name;
		amount = results[0].total_amount__c;
		duedate = results[0].due_date__c;
		
		console.log('To:' + to + ' ,No:' + invoiceNo + ' ,Amount:' + amount + ' ,message:คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate );
		pusher.trigger(to, 'Billing', {
			no: invoiceNo,
			amount: amount,
			message: 'คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate 
		});
		return true;
	})
	.catch(next);
}

function getMailing(id, next)
{
	var to;
	db.select("SELECT * FROM salesforce.Mailing__c WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].student_name__c
		console.log('To:' + to + ' ,No:' + results[0].name + ' ,type:' + results[0].mailing_type__c + ' , date:' + results[0].received_date__c);
		pusher.trigger(to, 'Mailing', {
			no: results[0].name,
			message: 'มีพัศดุ ' + results[0].mailing_type__c + ' ส่งถึงคุณ วันที่ ' + results[0].received_date__c
		});
		return true;
	})
	.catch(next);
}

function testSend()
{
	/*
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
	*/
}