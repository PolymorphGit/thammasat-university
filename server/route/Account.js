var account = 
{
	login: function(req, res) 
	{
		var allProducts = data; // Spoof a DB call
		res.json(allProducts);
	},
	getOne: function(req, res) 
	{
		var id = req.params.id;
		var product = data[0]; // Spoof a DB call
		res.json(product);
	},
	create: function(req, res) 
	{
		var newProduct = req.body;
		data.push(newProduct); // Spoof a DB call
		res.json(newProduct);
	},
	update: function(req, res) 
	{
		var updateProduct = req.body;
		var id = req.params.id;
		data[id] = updateProduct // Spoof a DB call
		res.json(updateProduct);
	},
	delete: function(req, res) 
	{
		var id = req.params.id;
		data.splice(id, 1) // Spoof a DB call
		res.json(true);
	}
};

var data = [{
	name: 'product 1',
	id: '1'
}, {
	name: 'product 2',
	id: '2'
}, {
	name: 'product 3',
	id: '3'
}];

function login(email, password, callback) 
{
	  var conString = "postgres://ehuotalmpdqjvs:da48536ca63cdb9f209d7e00695d5e261441f7313b611d670bf104bbb1d24a5a@ec2-54-243-214-198.compute-1.amazonaws.com:5432/df3pgi81qfmoc7";
	  postgres(conString, function (err, client, done) {
	    if (err) {
	      console.log('could not connect to postgres db', err);
	      return callback(err);
	    }

	    var query = 'SELECT id, nickname, email, password ' +
	      'FROM user WHERE email = $1';

	    client.query(query, [email], function (err, result) {
	      // NOTE: always call `done()` here to close
	      // the connection to the database
	      done();

	      if (err) {
	        console.log('error executing query', err);
	        return callback(err);
	      }

	      if (result.rows.length === 0) {
	        return callback(new WrongUsernameOrPasswordError(email));
	      }

	      var user = result.rows[0];

	      bcrypt.compare(password, user.password, function (err, isValid) {
	        if (err) {
	          callback(err);
	        } else if (!isValid) {
	          callback(new WrongUsernameOrPasswordError(email));
	        } else {
	          callback(null, {
	            id: user.id,
	            nickname: user.nickname,
	            email: user.email
	          });
	        }
	      });
	    });
	  });
	}

module.exports = products;