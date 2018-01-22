var db = require('./pghelper');

exports.topupone2callprepare = function(req, res, next) {
  res.send("Topup One2call Prepare");
}

exports.topupone2callconfirm = function(req, res, next) {
  res.send("Topup One2call Confirm");
}
