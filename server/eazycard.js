var db = require('./pghelper');

exports.topupone2callprepare = function(req, res, next) {
  var head = req.headers['authorization'];
  var price = req.headers['price'];
  
  res.send("Topup One2call Prepare, Price:" + price);
}

exports.topupone2callconfirm = function(req, res, next) {
  var head = req.headers['authorization'];
  var otp = req.headers['otp'];
  
  res.send("Topup One2call Confirm, OTP:" + otp);
}
