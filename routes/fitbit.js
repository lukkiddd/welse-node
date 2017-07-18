import express from 'express';
import mongoose from 'mongoose';
import config from '../config';
import _ from 'lodash';
import { tokenManage } from '../helper';
import { User, Health } from '../models';
import FitbitApiClient from "fitbit-node";
const router = express.Router();

const client = new FitbitApiClient(config.CLIENT_ID, config.CLIENT_SECRET)

router.get('/authorize', (req, res) => {
	res.redirect(client.getAuthorizeUrl('activity heartrate sleep', 'https://welse-platform.azurewebsites.net/api/fitbit/callback'))
});

router.get('/callback', (req, res) => {
	client.getAccessToken(req.query.code, 'https://welse-platform.azurewebsites.net/api/fitbit/callback')
		.then( (result) => {
			client.get('/', result.access_token)
				.then( (results) => {
					res.send(results);
				});
		})
		.catch( (error) => {
			console.log(error);
			res.send(error);
		})
})

export default router;