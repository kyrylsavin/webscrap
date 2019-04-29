const rq = require('request'); //request to webpage
const $ = require('cheerio'); //extract data with jquery
const mg = require('mongodb').MongoClient;

const url = "https://demiart.ru/forum/index.php?showforum=2";
const mongoClient = new mg("mongodb://localhost:27017/", { useNewUrlParser: true });

rq(url, function(err, resp, html) { 
	if (!err) {
		var data = fetchData(html);
		
		mongoClient.connect(function(err, client) {
		const db = client.db("photoshop");
		const newsfeed = db.collection('ulinks');

			newsfeed.insertMany(data, function(err, result) {
				if (err) {
					return console.log(err);
				}
				console.log(result.ops);
			});
		});

	} else console.log(`Page with '${url}' is not found`);
});

function fetchData(html) {
	fetchedData = [];

	var links = $('.news-block .des a', html);
	var dates = $('.news-block .des span', html);
	var count = links.length; 
		
	for (var i = 0; i < count; i++) {
		fetchedData.push({link:links[i].attribs.href, published: dates.eq(i).text()});
	}
	return fetchedData;
}
