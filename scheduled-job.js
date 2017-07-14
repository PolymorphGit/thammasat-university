var db = require('./server/pghelper');
var Pusher = require('pusher');

function sayHello() {
    console.log('Notification');
}
sayHello();

var pusher = new Pusher({
  appId: '321597',
  key: 'f57a4e884d78cc6e048a',
  secret: '6bd62949b0bcbf8b22a8',
  encrypted: true,
  cluster: "mt1"
});

function sendAnnouncement()
{
	
}
sendAnnouncement();

function sendBilling()
{
	var listId = '(';
	var invoiceNo;
	var amount;
	var duedate;
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Invoice__c WHERE send_notification__c is null or send_notification__c = false limit 30")
	.then(function(results) {
		console.log('Invoice count: ' + results.length);
		for(var i = 0 ; i < results.length ; i++)
		{
			to = results[i].student_name__c;
			invoiceNo = results[i].name;
			amount = results[i].total_amount__c;
			duedate = results[i].due_date__c;
			duedate = duedate.setHours(duedate.getHours() + 7);
			
			noti = { title : 'คุณมียอดค่าใช้จ่าย จำนวน ' + amount + 'บาท', 
				 body : 'คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate,
				 click_action: 'MAIN_ACTIVITY'};
			payload = {	ID: results[i].sfid,
				    	type: 'Billing',
					message: 'คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate };
			
			console.log('To:' + to + ', No:' + invoiceNo + ', Amount:' + amount + ', message:คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate );
			//pusher.trigger(to, 'Billing', payload);
			pusher.notify([to], {
				apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
				fcm: { notification : noti, badge : 1, sound : "default", data : payload }
			});
			listId += '\'' + results[i].sfid + '\', ';
		}
		
		if(results.length > 0)
		{
			listId = listId.substr(0, listId.length - 2) + ')';
			//TODO Mark Send Notification to true
			db.select("UPDATE salesforce.Invoice__c SET send_notification__c=true WHERE SFID IN " + listId)
			.then(function(results) {
				console.log('Invoice complete');
			})
			.catch(function(e){console.log(e);});
		}
	})
	.catch(function(e){console.log(e);});
}
sendBilling();

function sendMailing()
{
	var listId = '(';
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Mailing__c WHERE send_notification__c is null or send_notification__c = false limit 30")
	.then(function(results) {
		console.log('Mailing count: ' + results.length);
		for(var i = 0 ; i < results.length ; i++)
		{
			to = results[i].student_name__c;
			noti = { title : 'มีพัศดุส่งมาถึง วันที่ ' + results[i].createddate.toDateString(), 
				 body : 'มีพัศดุ ' + results[i].mailing_type__c + ' ส่งถึงคุณ วันที่ ' + results[i].createddate.toDateString(),
				 click_action: 'MAIN_ACTIVITY'};
			payload = {	ID: results[i].sfid,
					type: 'Mailing',
					message: 'มีพัศดุ ' + results[i].mailing_type__c + ' ส่งถึงคุณ วันที่ ' + results[i].createddate.toDateString() };
			console.log('To:' + to + ', No:' + results[i].name + ', type:' + results[i].mailing_type__c + ', date:' + results[i].createddate.toDateString());
			//pusher.trigger(to, 'Mailing', payload);
			pusher.notify([to], {
				apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
				fcm: { notification : noti, badge : 1, sound : "default", data : payload }
			});
			listId += '\'' + results[i].sfid + '\', ';
		}
		
		if(results.length > 0)
		{
			//TODO Mark Send Notification to true
			listId = listId.substr(0, listId.length - 2) + ')';
			//TODO Mark Send Notification to true
			db.select("UPDATE salesforce.Mailing__c SET send_notification__c=true WHERE SFID IN " + listId)
			.then(function(results) {
				console.log('Mailing complete');
			})
			.catch(function(e){console.log(e);});
		}
	})
	.catch(function(e){console.log(e);});
}
sendMailing();

function sendContractExpire()
{
	var listId = '(';
	var listAccId = '(';
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Asset WHERE active__c=true and send_notification__c=false and contract_end__c > NOW() - interval '1 months' limit 10")
	.then(function(results) {
		console.log(results);
		for(var i = 0 ; i < results.length ; i++)
		{
			to = results[i].accountid;
			noti = { title : 'สัญญาจะหมดอายุ', 
				 body : 'ในวันที่:' + results[0].contract_end__c.toDateString(),
				 click_action: 'MAIN_ACTIVITY'};
			payload = {	ID: to,
					type: 'Contract',
				   	message: 'สัญญาจะหมดอายุในวันที่:' + results[i].contract_end__c.toDateString() };
			console.log('To:' + to + ', สัญญาจะหมดอายุในวันที่:' + results[i].contract_end__c.toDateString());
			//pusher.trigger(to, 'Contract Expire', payload);
			pusher.notify([to], {
				apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
				fcm: { notification : noti, badge : 1, sound : "default", data : payload }
			});
			listId += '\'' + results[i].sfid + '\', ';
			listAccId += '\'' + results[i].accountid + '\', ';
		}
		
		if(results.length > 0)
		{
			//TODO Mark Send Notification to true
			listId = listId.substr(0, listId.length - 2) + ')';
			listAccId = listAccId.substr(0, listAccId.length - 2) + ')';
			//TODO Mark Send Notification to true
			db.select("UPDATE salesforce.Asset SET send_notification__c=true WHERE SFID IN " + listId)
			.then(function(results) {
				db.select("UPDATE salesforce.Account SET allow_renew__c=true WHERE SFID IN " + listAccId)
				.then(function(results) {
					console.log('Contract complete');
				})
				.catch(function(e){console.log(e);});
			})
			.catch(function(e){console.log(e);});
		}
	})
	.catch(function(e){console.log(e);});
}
sendContractExpire();

function caseNotification()
{
	var sfid, type, message;
	var listCaseId = '(';
	db.select("SELECT * FROM salesforce.RecordType WHERE name !='Care and Clean' and sobjecttype = 'Case'")
	.then(function(rec) {
		db.select("SELECT * FROM salesforce.Case WHERE send_notification__c=false and type != 'Care and Clean' limit 10")
		.then(function(results) {
			//console.log(results);
			for(var i = 0 ; i < results.length ; i++)
			{
				for(var j = 0 ; j < rec.length ; j++)
				{
					if(results[i].recordtypeid == rec[j].sfid)
					{
						sfid = results[i].sfid;
						message = '';
						type = '';
						//Services
						if(rec[j].name == 'Services')
						{
							if (results[i].status == 'Working') {
								type = 'problem working';
							} 
							else if (results[i].status == 'On Hold') 
							{
								type = 'problem on hold';
								message = results[i].reason_on_hold__c;
							} 
							else if (results[i].status == 'Completed') 
							{
								type = 'problem closed';
								if(results[i].amount__c != null)
								{
								    message = 'มีค่าใช้จ่าย ' + results[i].Amount__c + ' บาท เนื่องจาก ' + results[i].Payment_Detail__c;
								}
							}
						}
						
						//Complain
						else if(rec[j].name == 'Complain')
						{
							if (results[i].status == 'Accepted') {
								type = 'complain accept';
								message = results[i].response_message__c;
						    	}
						}
						
						//Checkout
						else if(rec[j].name == 'Checkout')
						{
							if (results[i].status == 'Confirm') 
							{
								type = 'checkout confirm';
								message = results[i].response_message__c;
							} 
							else if (results[i].status == 'Waiting for Payment') 
							{
								type = 'checkout payment';
								if (results[i].amount__c != null) 
								{
									message = 'มีค่าใช้จ่าย ' + results[i].amount__c + ' บาท เนื่องจาก ' + results[i].payment_detail__c;
								}
							}
						}
						
						//Early and Late Access
						else if(rec[j].name == 'Early and Late Access')
						{
							if (results[i].problem_type__c == 'ขออนุญาตเข้าหอ หลังเวลา') 
							{
								if (results[i].status == 'Approve') 
								{
								    type = 'access approve';
								} 
								else if (results[i].status == 'Reject') 
								{
								    type = 'access reject';
								    message = results[i].response_message__c;
								}
							} 
							else if (results[i].problem_type__c == 'ขออนุญาตออกหอ ก่อนเวลา') 
							{
								if (results[i].status == 'Approve') 
								{
								    type = 'leave approve';
								} 
								else if (results[i].status == 'Reject') 
								{
								    type = 'leave reject';
								    message = results[i].Response_Message__c;
								}
							}
						}
						
						//Request to Stay
						else if(rec[j].name == 'Request to Stay')
						{
							if (results[i].status == 'Approve') 
							{
								type = 'stay approve';
							} 
							else if (results[i].status == 'Reject') 
							{
								type = 'stay reject';
								message = results[i].response_message__c;
							}
						}
						
						//Check Mailing
						else if(rec[j].name == 'Check Mailing')
						{
							if (results[i].status == 'Found') 
							{
								type = 'mail found';
							} 
							else if (results[i].status == 'Not Found') 
							{
								type = 'mail not found';
								message = results[i].response_message__c;
							}
						}
						
						//Request Household
						else if(rec[j].name == 'Request Household')
						{
							if (results[i].status == 'Working') 
							{
								type = 'household in progress';
							} 
							else if (results[i].status == 'Waiting Document') 
							{
								type = 'household wait doc';
								message = results[i].response_message__c;
							} 
							else if (results[i].status == 'Completed') 
							{
								type = 'household completed';
								message = results[i].response_message__c;
							}
						}
						
						//Other
						else if(rec[j].name == 'Other')
						{
							if (results[i].status == 'In Progress') 
							{
								type = 'other in progress';
							} 
							else if (results[i].status == 'Completed') 
							{
								type = 'other completed';
								message = results[i].response_message__c;
							}
						}
						
						//Move Room
						else if(rec[j].name == 'Move Room')
						{
							if (results[i].status == 'Approve') 
							{
								type = 'room accepted';
							} 
							else if (results[i].status == 'Reject') 
							{
								type = 'room reject';
								message = results[i].response_message__c;
							}
						}
						
						if(type != '')
						{
							var https = require('https');
							var postBody = JSON.stringify(message);
							var options = {
							  host: 'thammasat-university.herokuapp.com',
							  path: '/notification',
							  port: '443',
							  method: 'POST',
							  headers: { 'sfid': sfid, 'content-type': 'application/x-www-form-urlencoded', 'type': type, 'Content-Length': Buffer.byteLength(postBody) }
							};
							console.log('Type:' + rec[j].name + 'Status:' + results[i].status + ', ' + options);
							callback = function(results) { };
							var httprequest = https.request(options, callback);
							httprequest.on('error', (e) => {
								res.send('problem with request: ${e.message}');
							});
							httprequest.write(postBody);
							httprequest.end();
						}
					}
				}
				db.select("UPDATE salesforce.Case SET send_notification__c=true WHERE SFID = '" + results[i].sfid + "'")
				.then(function(results) {
					console.log('Send Case : ' + results[i].sfid);
				})
				.catch(function(e){console.log(e);});
			}
		})
		.catch(function(e){console.log(e);});
	})		  
	.catch(function(e){console.log(e);});
}
caseNotification();
	
function workorderNotification()
{
	var sfid, type, message;
	var listCaseId = '(';
	db.select("SELECT * FROM salesforce.RecordType WHERE name='Maid'")
	.then(function(rec) {
		db.select("SELECT * FROM salesforce.workorder WHERE send_notification__c=false and recordtypeid = '" + rec[0].sfid + "' limit 10")
		.then(function(results) {
			//console.log(results);
			for(var i = 0 ; i < results.length ; i++)
			{
				for(var j = 0 ; j < rec.length ; j++)
				{
					if(results[i].recordtypeid == rec[j].sfid)
					{
						sfid = results[i].sfid;
						message = '';
						type = '';
						if (results[i].status == 'Closed') 
						{
							type = 'clean closed';
						}
						
						if(type != '')
						{
							var https = require('https');
							var postBody = JSON.stringify(message);
							var options = {
							  host: 'thammasat-university.herokuapp.com',
							  path: '/notification',
							  port: '443',
							  method: 'POST',
							  headers: { 'sfid': sfid, 'content-type': 'application/x-www-form-urlencoded', 'type': type, 'Content-Length': Buffer.byteLength(postBody)}
							};
							callback = function(results) { };
							var httprequest = https.request(options, callback);
							httprequest.on('error', (e) => {
								res.send('problem with request: ${e.message}');
							});
							httprequest.write(postBody);
							httprequest.end();
						}
					}
				}
				db.select("UPDATE salesforce.workorder SET send_notification__c=true WHERE SFID = '" + results[i].sfid + "'")
				.then(function(results) {
					console.log('Send Clean : ' + results[i].sfid);
				})
				.catch(function(e){console.log(e);});
			}
		})
		.catch(function(e){console.log(e);});
	})		  
	.catch(function(e){console.log(e);});
}
workorderNotification();
