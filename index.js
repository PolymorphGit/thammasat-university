var express = require('express')
var app = express()
var	account = require('./server/account')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
 
api.get('/Test', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

api.get('/userinfo', account.UserInfo);

