var express = require('express')
var	account = require('./server/account')
var room = require('./server/Room')
var announcement = require('./server/announcement')
var feed = require('./server/task')
var mail = require('./server/mailing')
var pay = require('./server/payment')
var case2 = require('./server/case')
var	clean = require('./server/careandclean')
var record = require('./server/recordtype')
var noti = require('./notification')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

var path = require("path");

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
//app.use(express.bodyParser());

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/Test', urlencodedParser, function(req, res) {
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	res.send('welcome, ' + req.body);
});

app.get('/room/:id', room.getInfo);

app.get('/userinfo', account.getInfo);
//app.get('/userinfo/:id', account.UserInfobyId);
//app.get('/userinfobymobileid/:mobileid', account.UserInfobyMobileId);

app.get('/logout', account.logout);

app.get('/announcement', announcement.getDetail);
app.get('/feed', feed.getFeed);
app.get('/mailing', mail.getList);
app.get('/mailing/:id', mail.getDetail);
app.get('/billing', pay.getList);
app.get('/billing/:id', pay.getDetail);
app.get('/case', case2.getList);
app.get('/case/:id', case2.getDetail);
app.post('/opencase', urlencodedParser, case2.openCase);
app.get('/getcleanrate', clean.getCleanRate);
app.get('/clean', clean.getList);
app.get('/clean/:id', clean.getDetail);
app.post('/openclean', jsonParser, clean.openClean);

app.get('/checkindetail', account.checkinDetail);
app.get('/checkin', account.checkin);
app.post('/requestcheckout', account.RequestCheckout);
app.get('/checkout', account.checkout);

app.post('/notification', noti.push);

app.get('/view_account', function(request, response){
	console.log(path.join(__dirname + '/view_account.html'));
    response.sendFile(path.join(__dirname + '/view_account.html'));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
