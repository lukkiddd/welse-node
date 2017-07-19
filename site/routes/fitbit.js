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
	const id = req.query.id;
	res.redirect(client.getAuthorizeUrl('activity heartrate sleep', 'https://welse-node-v6.azurewebsites.net/api/fitbit/callback', 'none', id))
});

router.get('/callback', (req, res) => {
	const _id = req.query.state;
	client.getAccessToken(req.query.code, 'https://welse-node-v6.azurewebsites.net/api/fitbit/callback')
		.then( (result) => {
			client.get('/activities/steps/date/today/1y.json', result.access_token)
				.then( async (results) => {
					const steps = results[0]['activities-steps'];
					const stepData = _.sortBy(_.takeRight(steps, 100), 'dateTime');
					
					_.forEach(stepData, async (val) => {
						let date = new Date(val.dateTime).getTime() / 1000
						let step = new Health({
							chartType: 'column',
							name: 'steps',
							timestamp: date,
							unit: 'step',
							value: val.value,
							max: 0,
							type: 'step',
							_user: _id
						});
						let result = await step.save();
					})
					if (result) {
						res.redirect('https://welse-node-v6.azurewebsites.net');
					} else {
						res.json({'message': 'error'});
					}
				});
		})
		.catch( (error) => {
			console.log(error);
			res.send(error);
		})
})



export default router;

