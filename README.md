node-RESTlike
=============

RESTlike api (without the hypertext link stuff)
for node.js and mongodb

Requirements
------------

* [node.js](http://nodejs.org/)
* [mongodb](http://www.mongodb.org/)
* grunt
* grunt-cli

node.js and mongodb should be in your PATH variable

Installation
------------

Open a cli in your node-RESTlike project folder and type in npm install.
Npm should download all neccessary node modules.

Development
-----------

There are 4 grunt tasks:
1. 1-db (starts your mongodb with path ./data/db)
2. 2-server (starts the node-RESTlike server.js with nodemon and lints all js files on change)
3. all (combines 1-db, 2-server)
4. build (builds your node-RESTlike module and puts it in a folder called dist)
