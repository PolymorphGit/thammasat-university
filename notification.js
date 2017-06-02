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
	var message = req.headers['message'];
	var result = true;
	switch(type)
	{
		case 'billling' : result = getBilling(id, next);	break;
		case 'mailing' : result = getMailing(id, next);	break;
		case 'problem working' : result = problemWorking(id, next);	break;
		case 'problem on hold' : result = problemHold(id, message, next);	break;
		case 'problem closed' : result = problemClosed(id, message, next);	break;
		case 'complain accept' : result = complainAccept(id, message, next);	break;
		//case 'clean closed' : result = getMailing(id, next);	break;
		//case 'checkout confirm' : result = getMailing(id, next);	break;
		//case 'access approve' : result = getMailing(id, next);	break;
		//case 'access reject' : result = getMailing(id, next);	break;
		//case 'leave approve' : result = getMailing(id, next);	break;
		//case 'leave reject' : result = getMailing(id, next);	break;
		//case 'stay approve' : result = getMailing(id, next);	break;
		//case 'stay reject' : result = getMailing(id, next);	break;
		//case 'room accept' : result = getMailing(id, next);	break;
		//case 'room reject' : result = getMailing(id, next);	break;
		//case 'mail found' : result = getMailing(id, next);	break;
		//case 'mail not found' : result = getMailing(id, next);	break;
		//case 'household in progress' : result = getMailing(id, next);	break;
		//case 'household wait doc' : result = getMailing(id, next);	break;
		//case 'household completed' : result = getMailing(id, next);	break;
		//case 'other in progress' : result = getMailing(id, next);	break;
		//case 'other completed' : result = getMailing(id, next);	break;
		default: testSend();
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
		duedate = results[0].due_date__c.toDateString();
		
		console.log('To:' + to + ', No:' + invoiceNo + ', Amount:' + amount + ', message:คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate );
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
		console.log('To:' + to + ', No:' + results[0].name + ', type:' + results[0].mailing_type__c + ', date:' + results[0].received_date__c.toDateString());
		pusher.trigger(to, 'Mailing', {
			no: results[0].name,
			message: 'มีพัศดุ ' + results[0].mailing_type__c + ' ส่งถึงคุณ วันที่ ' + results[0].received_date__c.toDateString()
		});
		return true;
	})
	.catch(next);
}

function problemWorking(id, next)
{
	var to;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'problem working', {
			No: results[0].casenumber,
			message: results[0].subject + ' กำลังดำเนินการ'
		});
		return true;
	})
	.catch(next);
}

function problemHold(id, message, next)
{
	var to;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'problem on hold', {
			No: results[0].casenumber,
			message: 'Case ' + results[0].subject + ' ได้ถูกพักเนื่องจาก '+ message
		});
		return true;
	})
	.catch(next);
}

function problemClosed(id, message, next)
{
	var to;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'problem closed', {
			No: results[0].casenumber,
			message: 'Case ' + results[0].subject + ' ได้ได้ทำการแก้ไขแล้ว '+ message
		});
		return true;
	})
	.catch(next);
}

function complainAccept(id, message, next)
{
	var to;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'complain ฟccept', {
			No: results[0].casenumber,
			message: 'ได้รับทราบเรื่อง ' + results[0].subject + ' แล้ว '+ message
		});
		return true;
	})
	.catch(next);
}

function acceptClean(id, next)
{
	var to;
	var message = 'ยืนยันทำความสะอาด  วันที่ ';
	var date;
	db.select("SELECT * FROM salesforce.case WHERE SFID='" + id + "'")
	.then(function(results) {
		console.log(results);
		db.select("SELECT * FROM salesforce.WorkOrder WHERE caseid='" + results[0].sfid + "'")
		.then(function(results2) {
			to = results[0].accountid
			for(var i = 0 ; i < results2.length ; i++)
			{
				date = new Date(results2[i].working_date__c)
				message +=  date.toDateString() + ', ';
			}
			console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject + ', message:' + message);
			pusher.trigger(to, 'Accept Clean', {
				No: results[0].casenumber,
				message: message
			});
			return true;
		})
		.catch(next);
	})
	.catch(next);
}

function rejectClean(id, next)
{
	var to;
	var message = 'ยกเลิกทำความสะอาด  วันที่ ';
	var date;
	db.select("SELECT * FROM salesforce.case WHERE SFID='" + id + "'")
	.then(function(results) {
		console.log(results);
		db.select("SELECT * FROM salesforce.WorkOrder WHERE caseid='" + results[0].sfid + "'")
		.then(function(results2) {
			to = results[0].accountid
			for(var i = 0 ; i < results2.length ; i++)
			{
				date = new Date(results2[i].working_date__c);
				message +=  date.toDateString() + ', ';
			}
			console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject + ', message:' + message);
			pusher.trigger(to, 'Reject Clean', {
				No: results[0].casenumber,
				message: message
			});
			return true;
		})
		.catch(next);
	})
	.catch(next);
}

function completeClean(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.WorkOrder WHERE SFID='" + id + "'")
	.then(function(results) {
		console.log(results);
		db.select("SELECT * FROM salesforce.Case WHERE SFID='" + results[0].caseid + "'")
		.then(function(results2) {
			to = results2[0].accountid;
			date = new Date(results[0].working_date__c);
			console.log('To:' + to + ', No:' + results2[0].casenumber + ', Subject:' + results2[0].subject + ', Working Date:' + results[0].working_date__c + ', Period:' + results[0].cleaning_period__c);
			pusher.trigger(to, 'Complete Clean', {
				No: results2[0].casenumber,
				message: 'Subject:' + results2[0].subject + ', Working Date:' + date.toDateString() + ', Period:' + results[0].cleaning_period__c
			});
			return true;
		})
		.catch(next);
	})
	.catch(next);
}

function allowCheckout(id, next)
{
	var to;
	db.select("SELECT * FROM salesforce.Account WHERE SFID='" + id + "'")
	.then(function(results) {
		console.log(results);
		to = results[0].sfid;
		console.log('To:' + to + ', First Name:' + results[0].firstname + ', Last Name:' + results[0].lastname);
		pusher.trigger(to, 'Allow Checkout', {
			message: 'First Name:' + results[0].firstname + ', Last Name:' + results[0].lastname + ' อนุญาติให้ทำการ Check-out ออกจากห้องพัก'
		});
		return true;
	})
	.catch(next);
}

function rejectCheckout(id, next)
{
	var to;
	db.select("SELECT * FROM salesforce.Account WHERE SFID='" + id + "'")
	.then(function(results) {
		console.log(results);
		to = results[0].sfid;
		console.log('To:' + to + ', First Name:' + results[0].firstname + ', Last Name:' + results[0].lastname);
		pusher.trigger(to, 'Reject Checkout', {
			message: 'First Name:' + results[0].firstname + ', Last Name:' + results[0].lastname + ' ไม่อนุญาติให้ทำการ Check-out ออกจากห้องพัก เนื่องจากค้างค่าใช้จ่าย'
		});
		return true;
	})
	.catch(next);
}

function contractExpire(id, next)
{
	var to;
	db.select("SELECT * FROM salesforce.Asset WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', สัญญาจะหมดอายุในวันที่:' + results[0].contract_end__c.toDateString());
		pusher.trigger(to, 'Contract Expire', {
			message: 'สัญญาจะหมดอายุในวันที่:' + results[0].contract_end__c.toDateString()
		});
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
	return false;
}