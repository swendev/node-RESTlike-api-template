// setup
var express         = require("express");
var router          = express.Router();
var GeoLocation     = require("../models/geoJson");
// db setup
var mongoose        = require("mongoose");
mongoose.connect("mongodb://localhost:27017/loci"); // connect to our database

// ROUTES FOR OUR API
// =============================================================================

// middleware to use for all requests
router.use(function(req, res, next) {
	console.log("middleware call (do stuff like auth)");
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working
router.get('/', function(req, res) {
	res.json({ message: "root, it works but no logic here" });
});

// more routes for our API will happen here

// on routes that end in /locations
// ----------------------------------------------------
router.route("/locations")

	// create a location
	.post(function(req, res) {

		var location                = new GeoLocation(); 		// create a new instance of the GeoLocation model
		location.name               = req.body.name;            // set the locations name (comes from the request)
		location.loc.type           = req.body.type;            // set the type of the geo location (sphere, point, polygon)
		location.loc.coordinates    = [req.body.lng, req.body.lat];

		// save the location and check for errors
		location.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: "location added" });
		});

	})
	// get all locations
	.get(function(req, res) {
		GeoLocation.find(function(err, locations) {
			if (err)
				res.send(err);

			res.json(locations);
		});
	});


// on routes that end in /locations/:location_id
// ----------------------------------------------------
router.route("/locations/:location_id")

	// get the location with the matching location_id
	.get(function(req, res) {
		GeoLocation.findById(req.params.location_id, function(err, location) {
			if (err)
				res.send(err);
			res.json(location);
		});
	})
	// update the location with the matching location_id
	.put(function(req, res) {

		// use our bear model to find the bear we want
		GeoLocation.findById(req.params.location_id, function(err, location) {

			if (err)
				res.send(err);

			// update the location data
			location.name               = req.body.name;
			location.loc.type           = req.body.type;
			location.loc.coordinates    = [req.body.lng, req.body.lat];

			// save the bear
			location.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: "location updated" });
			});

		});
	})
	// delete the location with the matching location_id
	.delete(function(req, res) {
		GeoLocation.remove({
			_id: req.params.location_id
		}, function(err, location) {
			if (err)
				res.send(err);

			res.json({ message: "location deleted" });
		});
	});

//
// ----------------------------------------------------
router.route("/locations/near/:lng/:lat/:max")

	// get locations near the get params
	.get(function(req, res) {
		// setup geoJson for query
		var geoJson                 = {};
		geoJson.type            = "Point";
		geoJson.coordinates     = [parseFloat(req.params.lng), parseFloat(req.params.lat)];

		// setup options for query
		var options = {};
		options.spherical           = true;
		options.maxDistance         = parseInt(req.params.max);

		// query db with mongoose geoNear wrapper
		GeoLocation.geoNear(geoJson, options, function (err, results, stats) {
			if (err)
				res.send(err);
			res.json(results);
		});
	});

module.exports = router;