const request = require('request');
const MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let express = require('express');
const app = express();
let dateFormat = require('dateformat');
let argv = require('yargs').argv;
const apiKey = argv.k;
const urlMongo = 'mongodb://localhost:27017';
let math = require('math');

math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};


app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) =>{
    res.sendfile('index.html');

});

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
                    console.log('body:', item);
                    res.sendfile('index.html');
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
                    res.sendfile('index.html', res.json({items: item}));
                });

            });

        } else {
            let resultArray = [];
            let cursor = db.collection('testcollection').find({timestamp: {$eq: timestamp}});
            cursor.forEach(function (doc) {
                resultArray.push(doc);
            }, function () {
                client.close();
                console.log('It is stored');
                console.log(resultArray);
               res.sendfile('index.html', {itemsfiltered: resultArray});
            });
        }
    });
});

app.get('/api/aircrafts', (req, res) => {

    const latitude = req.query.lat + 1;
    const longitude = req.query.lon;
    const timestamp = req.query.timestamp;

    let dbName = 'test';
    MongoClient.connect(urlMongo, function (err, client) {
        db = client.db(dbName);
        if (!timestamp) {
            var urlFlight = `https://opensky-network.org/api/states/all?latitude=${latitude}&longitude=${longitude}`;

            request(urlFlight, function (err, response, body) {
                if (err) {
                    console.log('error:', error);
                } else {
                    res.send(body);
                    item = {
                        body: body
                    };

                    console.log('item:', body);
                }
                assert.equal(null, err);
                console.log('It is connected');

                let currentdate = new Date();
                db.collection('flightcollection').insertOne({
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
            let cursor = db.collection('flightcollection').find({timestamp: {$eq: timestamp}});
            cursor.forEach(function (doc) {
                resultArray.push(doc);
            }, function () {
                client.close();
                res.send(resultArray);
                console.log(resultArray)
            });
        }
    });
});

app.listen(3000, () => console.log('Listening on port 3000....'));