//Steps to set up and run an application:

Important!!! - use a version of node js - 10.13.0

1) You need to install mongoDB and create an instance of DB with name "test" on your local machine 

(make sure that the port 27017 is in use, otherwise change it in index.js file to a port that is in use on your local machine)

2) To run an app use the command: node index.js -k {apiKey} (Should see 'Listening on port 3000.....')

4) Open your browser and use the link below in order to access the application: 

http://localhost:3000

5) Use this date format "mm/dd/yy" in order to access a historical data

6) Use a transponder of an aircraft from a receivded "Aircraft" data (This data can be received by entering coordinates of a particluar location (usually an Airport)). 

Example of a received data: 

["ab5d52","DAL469 ","United States",1546162049,1546162049,-73.1382,40.5666,3467.1,false,126.27,229.63,-11.38,null,3444.24,"2404",false,0]

from this example the first element of an array is a transponder, in this case it's "ab5d52". Also, "-73.1382" and "40.5666" are coordinates of 

an aircraft at the moment when this data was received from an open api 

Enter this transponder into "Transponder" field in order to see a distance that an aircraft travelled from the time when the data was retrieved till

the moment when the distance calculation is requested. Also, this distance can be recalculated as many times as you would like.