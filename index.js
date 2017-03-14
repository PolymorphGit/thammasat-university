var express = require('express')
//var bodyParser = require('body-parser'), compression = require('compression'), cors = require('cors');
var	account = require('./server/account')
var app = express()
/*
var pg = require('pg'),databaseURL = process.env.DATABASE_URL || 'postgres://localhost:5432/df3pgi81qfmoc7';
var client = new pg.Client(databaseURL);
client.connect();
*/
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/Test', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.get('/userinfo/:id', account.UserInfo);
/*
app.get('/userinfo/:id', function(req, res) {
	var id = req.params.id;
	var sql = "SELECT name, identification_number__c, gender__c FROM salesforce.Account WHERE SFID='" + id + "'";
	client.query(sql, function(error, data) {res.json(data.rows[0]);});
})
*/

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
