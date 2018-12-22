const request = require('request');
let argv = require('yargs').argv;
const MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let express = require('express');
const app = express();
const urlMongo = 'mongodb://localhost:27017';

app.get('/api/weather', (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const apiKey = req.query.apiKey;
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
    });

//Creating a collection and storing a data
    const dbName = 'test';
    MongoClient.connect(urlMongo, function (err, client) {
        assert.equal(null, err);
        console.log('It is connected');
        const db = client.db(dbName);
        db.collection('testcollection').insertOne(item, function (err, result) {
            assert.equal(1, result.insertedCount);
            console.log('It is stored');
            client.close();
        });
    });
});

app.listen(3000, () => console.log('Listening on port 3000....'));