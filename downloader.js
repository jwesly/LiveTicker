'use strict';
var cheerio = require('cheerio'), request = require('request'), mongoose = require('mongoose'), async = require('async'), config = require('./config');
var companySchema = new mongoose.Schema({
	"ticker": String,
	"name" : String,
	"reports": String,
	"sector": String,
	"subsector": String,
	"headquarters": String,
	"CIK": Number
})

var Company = mongoose.model('Company', companySchema, 'SP');

var test = new Company({ticker: "GOOG", name: "Google, INC", reports: "blah", sector: "Tech", subsector: "Swag", "CIK": 120034});

mongoose.connect(config.creds);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
async.series([
	function(callback){
		db.once('open', function () {
			request("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies", 
			function(err, response, body){
				if(err && response.statusCode !== 200){console.log('Request error.');}
				var $ = cheerio.load(body);
				var table = $("table").first().children().slice(1);
				var rownum = table.length;
				table.each(function(){
					var row = $(this).children();
					var record = new Company(
						{ticker:row.eq(0).children().html()
						, name: row.eq(1).children().html()
						, reports: row.eq(2).children().attr("href")
						, sector: row.eq(3).html()
						, subsector: row.eq(4).html()
						, headquarters: row.eq(5).children().html()
						, CIK: row.eq(7).html()
						});
					record.save(function (err, fluffy) {
						if (err) return console.error(err);
							rownum--;
							if(rownum==0){
								return callback(null,null)
					}});

				});
			});
		});
	},
	function(callback){
			mongoose.connection.close();
			console.log("Download Complete");
			return callback(null,null);
	}
]);