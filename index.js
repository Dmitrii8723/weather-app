const request = require('request');
const MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let express = require('express');
const app = express();
let dateFormat = require('dateformat');
let argv = require('yargs').argv;
const apiKey = argv.k;
const urlMongo = 'mongodb://localhost:27017';

app.get('/api/weather', (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const timestamp = req.query.timestamp;
//Creating a collection and storing a data
    let dbName = 'test';
    MongoClient.connect(urlMongo, function (err, client) {
        db = client.db(dbName);
        if (!timestamp) {
            let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            request(url, function (err, response, body) {
                if (err) {
                    console.log('error:', error);
                } else {
                    res.send(body);
                    item = {
                        body: body
                    };
                    console.log('body:', body);
                }
                assert.equal(null, err);
                console.log('It is connected');

                let currentdate = new Date();
                db.collection('testcollection').insertOne({
                    item,
                    timestamp: dateFormat(currentdate, "mm/dd/yy")
                }, function (err, result) {
                    assert.equal(1, result.insertedCount);
                    console.log('It is stored');
                    client.close();
                });
            });

        } else {
            let resultArray = [];
            let cursor = db.collection('testcollection').find({timestamp: {$eq: timestamp}});
            cursor.forEach(function (doc) {
                resultArray.push(doc);
            }, function () {
                client.close();
                res.send(resultArray);
            });
        }
    });
});

app.listen(3000, () => console.log('Listening on port 3000....'));