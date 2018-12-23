//Steps to set up and run an application:

1) You need to install mongoDB and create an instance of DB with name "test" on your local machine 

(make sure that the port 27017 is in use, otherwise change it in index.js file to a port that is in use on your local machine)

2) To run an app use the command: node index.js -k {apiKey} (Should see 'Listening on port 3000.....')

3) Open Chrome and install restlet plugin for Chrome

4) Open restlet and use the link below in order to get a weather info from open weather 

api based on latitude and longitude coordinates: 

http://localhost:3000/api/weather?lat={}&lon={}

5) Use below link in order to get historical data:

http://localhost:3000/api/weather?timestamp=MM/DD/YY

6) Use below link in order to get an aircrafts data from open 

api based on latitude and longitude coordinates:

http://localhost:3000/api/aircrafts?lat={}&lon={}

7) Use below link in order to get historical data regarding aircrafts:

http://localhost:3000/api/aircrafts?timestamp=MM/DD/YY
