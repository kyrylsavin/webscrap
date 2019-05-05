const rq = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const url = "https://www.usedcars.com/buy/";

rq(url, function(err, resp, html) { //REQUEST USEDCARS.COM
	if (!err) {
		parseData(html);

	} else throw(`Page with '${url}' is not found`);
});

function parseData(html, callback) { //PARSING DATA USING JQUERY
	const $ = cheerio.load(html);

	var output = {listings:[]};
	var count = $('.listing').length;
	//ITERATING OVER PAGE LISTINGS
	for (i = 0; i < count; i++) {
		let carDetail = 'https://www.usedcars.com'+$('.col-info a').eq(i).attr('href');
		output.listings.push({title: $('.col-info .v-name').eq(i).text().replace(/\s\s+/g, ''),
							  price: $('.price').eq(i).text(),
							  mileage: $('.visible-md-up .mileage').eq(i).text(),
							  detail: carDetail});
	};
	//WRITING TO JSON FILE
	fs.writeFile('usedcars.json', JSON.stringify(output.listings), function(err) {
		if (err) {
			return console.log(err);
		}
		return console.log('Created json file with parsed data');
	});
}
