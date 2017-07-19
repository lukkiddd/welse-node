import express from 'express';
import mongoose from 'mongoose';
import config from '../config';
import _ from 'lodash';
import { tokenManage } from '../helper';
import { User, Health } from '../models';
import FitbitApiClient from "fitbit-node";
const router = express.Router();

const client = new FitbitApiClient(config.CLIENT_ID, config.CLIENT_SECRET)

router.get('/authorize',  (req, res) => {
	res.redirect(client.getAuthorizeUrl('activity', 'http://localhost:3000/api/fitbit/callback'))
});

router.get('/callback', (req, res) => {
	client.getAccessToken(req.query.code, 'http://localhost:3000/api/fitbit/callback')
		.then( (result) => {
			client.get('/activities/steps/date/today/1y.json', result.access_token)
				.then( async (results) => {
					const steps = results[0]['activities-steps'];
					const retval = [];
					_.forEach(steps, (val,key) => {
						let stepData = {
							chartType: 'column',
							name: 'steps',
							timestamp: Date.now().toString(),
							unit: 'step',
							value: val.value,
							max: 0,
							type: 'step',
							_user: _id
						}
						retval.push(stepData);
					});
					res.json(retval);
				});
		})
		.catch( (error) => {
			console.log(error);
			res.send(error);
		})
})

export default router;

