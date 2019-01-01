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

app.use('/static', express.static('static'))
math.radians = (degrees) => {
    return degrees * Math.PI / 180;
};

math.degrees = (radians) => {
    return radians * 180 / Math.PI;
};

app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
    res.render('index.html', {
        items: null,
        itemsfiltered: null,
        itemsaircraft: null,
        itemsaircraftfiltered: null,
        itemstrack: null
    });
});

app.get('/api/weather', (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const timestamp = req.query.timestamp;

//Creating a collection and storing a data
    let dbName = 'test';
    MongoClient.connect(urlMongo, (err, client) => {
        db = client.db(dbName);
        if (lat && lon) {
            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            request(url, (err, response, body) => {
                if (err) {
                    console.log('error:', error);
                } else {
                    item = {
                        body: JSON.parse(body)
                    };
                    console.log('body:', item);
                }
                assert.equal(null, err);
                console.log('It is connected');
                let currentdate = new Date();
                db.collection('weather').insertOne({
                    item,
                    timestamp: dateFormat(currentdate, "mm/dd/yy")
                }, (err, result) => {
                    assert.equal(1, result.insertedCount);
                    console.log('It is stored');
                    client.close();
                    res.render('index.html', {
                        items: body,
                        itemsaircraft: null,
                        itemsfiltered: null,
                        itemsaircraftfiltered: null,
                        itemstrack: null
                    });
                });
            });

        } else if (timestamp) {
            let resultArray = [];
            let cursor = db.collection('weather').find({timestamp: {$eq: timestamp}});
            cursor.forEach((doc) => {

                resultArray.push(doc);
            }, function () {
                client.close();
                console.log('It is stored');
                res.render('index.html', {
                    itemsfiltered: JSON.stringify(resultArray),
                    items: null,
                    itemsaircraft: null,
                    itemsaircraftfiltered: null,
                    itemstrack: null
                });
            });
        } else {
            res.render('index.html', {
                itemsfiltered: null,
                items: null,
                itemsaircraft: null,
                itemsaircraftfiltered: null,
                itemstrack: null
            });
        }
    });
});

app.get('/api/aircraft', (req, res) => {
    const latitudemin = parseInt(req.query.lat) - 1;
    const longitudemin = parseInt(req.query.lon) - 1;
    const latitudemax = parseInt(req.query.lat) + 1;
    const longitudemax = parseInt(req.query.lon) + 1;
    const timestamp = req.query.timestamp;
    let dbName = 'test';

    MongoClient.connect(urlMongo, (err, client) => {
        db = client.db(dbName);
        const urlFlight = `https://opensky-network.org/api/states/all?lamin=${latitudemin}&lomin=${longitudemin}&lamax=${latitudemax}&lomax=${longitudemax}`;
        console.log('urlFlight: ', urlFlight);
        if (urlFlight !== "https://opensky-network.org/api/states/all?lamin=NaN&lomin=NaN&lamax=NaN&lomax=NaN") {
            request(urlFlight, (err, response, body) => {
                if (err) {
                    console.log('error:', error);
                } else {
                    itemsaircaftrack = {
                        body: JSON.parse(body)
                    };
                    console.log('item:', itemsaircaftrack.body.states);
                }
                assert.equal(null, err);
                console.log('It is connected');

                let currentdate = new Date();
                db.collection('aircraft').insertOne({
                    itemsaircaftrack,
                    timestamp: dateFormat(currentdate, "mm/dd/yy")
                }, (err, result) => {
                    assert.equal(1, result.insertedCount);
                    console.log('It is stored');
                    client.close();
                    res.render('index.html', {
                        itemsaircraft: body,
                        items: null,
                        itemsfiltered: null,
                        itemsaircraftfiltered: null,
                        itemstrack: null
                    });
                });
            });
        } else if (timestamp) {
            let resultArray = [];
            let cursor = db.collection('aircraft').find({timestamp: {$eq: timestamp}});
            cursor.forEach((doc) => {
                resultArray.push(doc);
            }, () => {
                client.close();
                console.log(resultArray);
                res.render('index.html', {
                    itemsaircraftfiltered: JSON.stringify(resultArray),
                    items: null,
                    itemsaircraft: null,
                    itemsfiltered: null,
                    itemstrack: null
                });
            });
        } else {
            res.render('index.html', {
                itemsfiltered: null,
                items: null,
                itemsaircraft: null,
                itemsaircraftfiltered: null,
                itemstrack: null
            });
        }
    });
});

app.get('/api/tracks', (req, res) => {
    transponder = req.query.transponder;
    console.log(transponder);
    if (transponder) {
        const urlTrack = `https://opensky-network.org/api/tracks/all?icao24=${transponder}&time=0`;
        request(urlTrack, (err, response, body) => {
            if (err || !body) {
                console.log('error:', error);
            } else {
                console.log('BODY: ', body);
                itemtrack = {
                    body: JSON.parse(body)
                };

                console.log('Path: ', itemtrack.body.path);
                        maxElementTrack = itemtrack.body.path.length - 1;
                console.log('maxElement1: ', maxElementTrack);
                let aircraftLatitude2 = itemtrack.body.path[maxElementTrack][1];
                let aircraftLongitude2 = itemtrack.body.path[maxElementTrack][2];
                console.log('aircraftLatitude2: ', aircraftLatitude2);
                console.log('aircraftLongitude2: ', aircraftLongitude2);
                let maxElementAircraft = 0;
                itemsaircaftrack.body.states.forEach((state, i) => {
                    if (state[0] === transponder) {
                        maxElementAircraft = i;
                    }
                });
                console.log('maxElement2: ', maxElementAircraft);
                let aircraftLatitude1 = itemsaircaftrack.body.states[maxElementAircraft][6];
                let aircraftLongitude1 = itemsaircaftrack.body.states[maxElementAircraft][5];
                console.log('aircraftLatitude1: ', aircraftLatitude1);
                console.log('aircraftLongitude1: ', aircraftLongitude1);
                let dis = (aircraftLatitude2 - aircraftLatitude1) * (aircraftLatitude2 - aircraftLatitude1) + (aircraftLongitude2 - aircraftLongitude1) * (aircraftLongitude2 - aircraftLongitude1);
                let distance = math.round(math.sqrt(dis) * 100);

                console.log('Distance: ', distance);
                res.render('index.html', {
                    itemstrack: distance,
                    items: null,
                    itemsfiltered: null,
                    itemsaircraft: null,
                    itemsaircraftfiltered: null
                });
            }
        });
    } else {
        res.render('index.html', {
            itemsfiltered: null,
            items: null,
            itemsaircraft: null,
            itemsaircraftfiltered: null,
            itemstrack: null
        });
    }
});

app.listen(3000, () => console.log('Listening on port 3000....'));

