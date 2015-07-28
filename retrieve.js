var cheerio = require('cheerio'), request = require('request');

exports.get = function(ticker,fn){
	var url = "https://google.com/search?q="+ticker+"+stock";
	request(url,function(err,response,body){
		var $ = cheerio.load(body);
		var x = $("b").eq(1).html();
		if(!isNaN(x))
			fn(x);//return x to callback
	});
};