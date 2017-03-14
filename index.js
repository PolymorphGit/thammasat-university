var express = require('express')
//var bodyParser = require('body-parser'), compression = require('compression'), cors = require('cors');
var	account = require('./server/account')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.disable('etag');
//app.use(cors());
//app.use(bodyParser.json());
//app.use(compression());

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/Test', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.get('/userinfo/:id', account.UserInfo);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
