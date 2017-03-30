var express = require('express')
var	account = require('./server/account')
var room = require('./server/Room')
var announcement = require('./server/announcement')
var mail = require('./server/mailing')
var pay = require('./server/payment')
var case2 = require('./server/case')
var	clean = require('./server/careandclean')
var record = require('./server/recordtype')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
//app.use(express.bodyParser());

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/Test', function(req, res) {
	res.send(record.Case.CareandClean); 
});

app.get('/room/:id', room.getInfo);

app.get('/userinfo', account.getInfo);
//app.get('/userinfo/:id', account.UserInfobyId);
//app.get('/userinfobymobileid/:mobileid', account.UserInfobyMobileId);

app.get('/logout', account.logout);
app.get('/checkindetail', account.checkinDetail);
app.get('/checkin', account.checkin);
app.post('/requestcheckout', account.RequestCheckout);
app.get('/checkout', account.checkout);

app.get('/announcement', announcement.getDetail);
app.get('/mailing', mail.getList);
app.get('/mailing/:id', mail.getDetail);
app.get('/payment', pay.getList);
app.get('/payment/:id', pay.getDetail);
app.get('/case', case2.getList);
app.get('/case/:id', case2.getDetail);
app.get('/clean', clean.getList);
app.get('/clean/:id', clean.getDetail);
app.post('/openclean', clean.OpenClean);
app.get('/getcleanrate', clean.getCleanRate);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
