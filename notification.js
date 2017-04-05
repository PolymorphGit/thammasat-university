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
	var channels = ['1004000012345', 'my-channel-1', 'my-channel-2', 'my-channel-3' ];
	pusher.trigger(channels, 'Billing', {
	  "Name": "Invoice01",
	  "Amount": "100",
	  message: 'hello world'
	});
	
	
}