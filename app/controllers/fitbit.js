	// // initialize the Fitbit API client
	// var express = require('express'),
	// 	router = express.Router(),
	// FitbitApiClient = require("fitbit-node"),
	// fs = require('fs'),
	// 		client = new FitbitApiClient("228B2M", "0a8e9ff47637e88b204421cbb72e0718");

	// module.exports = function (app) {
	// 	app.use('/fitbit', router);
	// };

	// // redirect the user to the Fitbit authorization page
	// router.route("/authorize", function (req, res) {
	// 		// request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
	// 		res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:4000/callback'));
	// });

	// // handle the callback from the Fitbit authorization flow
	// router.route("/callback", function (req, res) {
	// 		// exchange the authorization code we just received for an access token
	// 		client.getAccessToken(req.query.code, 'http://localhost:4000/callback').then(function (result) {

	// 				// use the access token to fetch the user's profile information
	// 				client.get("/profile.json", result.access_token).then(function (results) {
							
	// 						res.send(results[0]);
	// 				});
	// 		}).catch(function (error) {
	// 				res.send(error);
	// 		});
	// });

	// router.route("/webhook", function (req,res){
	// 		console.log("webhook");
	// 		console.log(req.query.verify);
	// 		if(req.query.verify === "93624ce6be20ba2f2a169fd18595cb16cf51482c9c4f39c85feab0f373ca0098"){
	// 				console.log("yes");
	// 				res.status(204).send(http.STATUS_CODES[204]);
	// 		}
	// 		else{
	// 				res.status(404).send();
	// 		}
			
	// });

