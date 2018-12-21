const request = require('request');
let argv = require('yargs').argv;
const MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let express = require('express');
const urlMongo = 'mongodb://localhost:27017';
let lat = argv.la;
let lon = argv.lo;
let apiKey = argv.k;

//Calling an open api
let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
request(url, function (err, response, body) {
    if (err) {
        console.log('error:', error);
    } else {

        item = {
            body: body
        };

        console.log('body:', body);
        console.log('item:', item);
    }
});

//Creating a collection and stroing a data
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
