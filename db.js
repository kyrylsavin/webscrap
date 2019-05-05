const mg = require('mongodb').MongoClient;
const fs = require('fs');
const mongo = new mg("mongodb://localhost:27017/", { useNewUrlParser: true });

mongo.connect(function(err, client) {
	var tableName = 'short_description';
	const db = client.db("cars");

	db.listCollections({name: tableName})
	    .next(function(err, collinfo) {
	        if (collinfo) {
	        	console.log('Collection already exists, owerriting...');
	        	db.collection(tableName).drop();
	        }
	    }); //DROP TABlE IF EXISTS

	const coll = db.collection(tableName);
	//LOAD JSON FILE CREATED AFTER PAGE PARSING
	fs.readFile('usedcars.json', function(err, data) {
		if (err) return console.log(err);
		var jsonObject =  JSON.parse(data);

		for (carIndex in jsonObject) {
			try {
				//INSERT VALUE {obj}
				coll.insertOne(jsonObject[carIndex]);
			}
			catch (err) {
				console.log(err.name);
				break;
			}
		};
	});
	//SELECT * FROM short_description
	db.collection(tableName).find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
	});
})
