var http = require('http');
var https = require('https');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('assets'))


// function getImg() {
// 	var url = 'https://www.123rf.com/stock-photo/';
// 	return new Promise(function (resolve,reject) {
// 		https.get(url, function (res){
// 			var chunks = [];
// 			res.on('data', function(chunk) {
// 				chunks.push(chunk)
// 			})
// 			res.on('end', function() {
// 				var obj = {};
// 				var html = iconv.decode(Buffer.concat(chunks), 'utf-8');
// 				var $ = cheerio.load(html);
// 				var s = $('.index-main-banner').css('background-image');
// 				obj.img = `https:${s.substring(4, s.length-1)}`;
// 			    resolve(obj)
// 			})
// 		}).on('error', function (err) {
// 			reject(err)
// 		})
// 	})
// }
function getImage() {
	var url = 'https://d3cbihxaqsuq0s.cloudfront.net/';
	return new Promise(function (resolve,reject) {
		https.get(url, function (res){
			var chunks = [];
			res.on('data', function(chunk) {
				chunks.push(chunk)
			})
			res.on('end', function() {
				var obj = {};
				var html = iconv.decode(Buffer.concat(chunks), 'utf-8');
				var $ = cheerio.load(html, { xmlMode: true });
				var random = getRandom(1, $('ListBucketResult Contents').length - 1);
				var src = $('ListBucketResult Contents').eq(random).find('Key').text();
				obj.img = `${url}${src}`;
			    resolve(obj)
			})
		}).on('error', function (err) {
			reject(err)
		})
	})
}
function getRandom(s, e){
	return Math.ceil(s + Math.random() * (e - s));
}
function getWord() {
	var url = 'http://sentence.iciba.com/index.php?callback=word&c=dailysentence&m=getTodaySentence';
	return new Promise(function (resolve,reject) {
		http.get(url, function (res){
			var data = '';
			res.on('data', function(chunk) {
				data += chunk;
			})
			res.on('end', function() {
				var obj = {};
				obj.word = {
					ch: eval(data).content,
					en: eval(data).note
				};
			    resolve(obj)
			})
		}).on('error', function (err) {
			reject(err)
		})
	})
}
function word(res) {
	return res;
}

function getWeater() {
	var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D2151330%20and%20u%3D%22c%22&format=json';
	return new Promise(function (resolve,reject) {
		https.get(url, function (res){
			var data = '';
			res.on('data', function(chunk) {
				data += chunk;
			})
			res.on('end', function() {
				var obj = {};
				obj.weater = {
					city: JSON.parse(data).query.results.channel.location.city,
					temp: JSON.parse(data).query.results.channel.item.condition.temp,
					text: JSON.parse(data).query.results.channel.item.condition.text
				}
			    resolve(obj)
			})
		}).on('error', function (err) {
			reject(err)
		})
	})
}


app.get('/', function (req, res) {
	Promise.all([getImage(), getWord(), getWeater()]).then(function(info) {
		var obj = {};
		info.forEach(function(item) {
			obj = Object.assign(obj, item)
		})
		res.render('index', {info: obj});
	}).catch(function(err) {
		console.log(err)
	})
	
})
app.listen(3000);

// var app = http.createServer(function (req, res) {
// 	res.writeHead(200, {"Content-Type": "text/plain"});  
//     res.write("Hello World");  
//     res.end(); 
// });
// app.listen(3000);