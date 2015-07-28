var retrieve = require("./retrieve"), express = require("express"),util = require("util");
var app = express();

app.get('/:ticker',function(req,res){
	var ticker = req.params.ticker;
	retrieve.get(ticker,function(price){
		res.send(util.format('{"ticker":"%s","price":"%s"}',ticker,price));
		console.log(ticker,price);
	});
});

var server = app.listen(80, function () {
  console.log('Server Running');
});