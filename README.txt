//Steps to set up and run an application:

1) Go to a directory of the project and enter: npm install

2) You need to install mongoDB on your local machine OR to point to a remote DB

3) Command to run an app: node index.js -a {latitude} -o {longitude} -k {key}

//Use this query in order to query a store data

db.testcollection.find().pretty()