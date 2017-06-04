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
		case 'clean closed' : result = cleanClose(id, next);	break;
		case 'checkout confirm' : result = checkoutConfirm(id, next);	break;
		case 'access approve' : result = accessApprove(id, next);	break;
		case 'access reject' : result = accessReject(id, message, next);	break;
		case 'leave approve' : result = leaveApprove(id, next);	break;
		case 'leave reject' : result = leaveReject(id, message, next);	break;
		case 'stay approve' : result = stayApprove(id, next);	break;
		case 'stay reject' : result = stayReject(id, message, next);	break;
		case 'room accept' : result = roomAccept(id, next);	break;
		case 'room reject' : result = roomReject(id, message, next);	break;
		case 'mail found' : result = mailFound(id, next);	break;
		case 'mail not found' : result = mailNotFound(id, next);	break;
		case 'household in progress' : result = houseProgress(id, next);	break;
		case 'household wait doc' : result = houseDoc(id, next);	break;
		case 'household completed' : result = houseCompleted(id, next);	break;
		case 'other in progress' : result = otherProgress(id, next);	break;
		case 'other completed' : result = otherCompleted(id, message, next);	break;
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
		duedate = results[0].due_date__c;
		
		console.log('To:' + to + ', No:' + invoiceNo + ', Amount:' + amount + ', message:คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate );
		pusher.trigger(to, 'Billing', {
			ID: results[0].sfid,
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
		to = results[0].student_name__c;
		console.log('To:' + to + ', No:' + results[0].name + ', type:' + results[0].mailing_type__c + ', date:' + results[0].received_date__c);
		pusher.trigger(to, 'Mailing', {
			ID: results[0].sfid,
			no: results[0].name,
			message: 'มีพัศดุ ' + results[0].mailing_type__c + ' ส่งถึงคุณ วันที่ ' + results[0].received_date__c
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
			ID: results[0].sfid,
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
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'problem on hold', {
			ID: results[0].sfid,
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
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'problem closed', {
			ID: results[0].sfid,
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
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'complain accept', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'ได้รับทราบเรื่อง ' + results[0].subject + ' แล้ว '+ message
		});
		return true;
	})
	.catch(next);
}

function cleanClosed(id, next)
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
			pusher.trigger(to, 'clean closed', {
				ID: results[0].sfid,
				No: results2[0].casenumber,
				message: 'Subject:' + results2[0].subject + ', Working Date:' + date.toDateString() + ', Period:' + results[0].cleaning_period__c
			});
			return true;
		})
		.catch(next);
	})
	.catch(next);
}

function checkoutConfirm(id, next)
{
	var to;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'checkout confirm', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'อนุญาติให้ทำการ Check-out ได้'
		});
		return true;
	})
	.catch(next);
}

function accessApprove(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].early_late_access_date__c;
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'access approve', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'อนุญาติเข้าหอดึกได้ในวันที่ ' + date
		});
		return true;
	})
	.catch(next);
}

function accesReject(id, message, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].early_late_access_date__c;
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'access reject', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'ไม่อนุญาติเข้าหอดึกได้ในวันที่ ' + date + ' เนื่องจาก ' + message
		});
		return true;
	})
	.catch(next);
}

function leaveApprove(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].early_late_access_date__c;
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'leave approve', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'อนุญาติออกจากหอพักก่อนเวลาได้ในวันที่ ' + date
		});
		return true;
	})
	.catch(next);
}

function leaveReject(id, message, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].early_late_access_date__c;
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'leave reject', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'ไม่อนุญาติออกจากหอพักก่อนเวลาได้ในวันที่ ' + date + ' เนื่องจาก ' + message
		});
		return true;
	})
	.catch(next);
}

function stayApprove(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].stay_start_date__c;
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'stay approve', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'อนุญาติให้พาเพื่อนเข้าพักได้วันที่ ' + date
		});
		return true;
	})
	.catch(next);
}

function stayReject(id, message, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].stay_start_date__c;
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'stay reject', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'ไม่อนุญาติให้พาเพื่อนเข้าพักได้วันที่ ' + date + ' เนื่องจาก ' + message
		});
		return true;
	})
	.catch(next);
}

function roomAccept(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'room accept', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'อนุญาติให้ทำการย้ายห้อง '
		});
		return true;
	})
	.catch(next);
}

function roomReject(id, message, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'room reject', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'ไม่อนุญาติให้ทำการย้ายห้อง เนื่องจาก ' + message
		});
		return true;
	})
	.catch(next);
}

function mailFound(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'mail found', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'พบพัศดุของท่าน ให้มารับได้'
		});
		return true;
	})
	.catch(next);
}

function mailNotFound(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'mail found', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'ไม่พบพัศดุของท่าน'
		});
		return true;
	})
	.catch(next);
}

function houseProgress(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'household in progress', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'กำลังดำเนินการขอเอกสารทะเบียนบ้านให้'
		});
		return true;
	})
	.catch(next);
}

function houseDoc(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'household wait document', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'ไม่ได้รับเอกสารในการขอทะเบียนบ้าานของท่าน กรุณานำส่งที่จุดรับด้วย'
		});
		return true;
	})
	.catch(next);
}

function houseCompleted(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'household completed', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'เอกสสารทะเบียนบ้านของท่านมาถึงแล้ว'
		});
		return true;
	})
	.catch(next);
}

function otherProgress(id, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'other in progress', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: 'ได้รับเรื่อง' + results[0].description + 'กำลังดำเนินการ'
		});
		return true;
	})
	.catch(next);
}

function otherCompleted(id, message, next)
{
	var to;
	var date;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		pusher.trigger(to, 'other in progress', {
			ID: results[0].sfid,
			No: results[0].casenumber,
			message: message
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
	return false;
}