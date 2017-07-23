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
	res.redirect(client.getAuthorizeUrl('activity sleep', 'https://welse-node-v6.azurewebsites.net/api/fitbit/callback', 'none', id))
});

router.get('/callback', (req, res) => {
	const _id = req.query.state;
	client.getAccessToken(req.query.code, 'https://welse-node-v6.azurewebsites.net/api/fitbit/callback')
		.then( async (result) => {
			const results = await client.get('/activities/steps/date/today/1y.json', result.access_token)
				// .then( async (results) => {
			const steps = results[0]['activities-steps'];
			const stepData = _.takeRight(steps, 100);
					
			const calRes = await client.get('/activities/calories/date/today/1y.json', result.access_token);
			const cal = calRes[0]['activities-calories'];
			res.json(cal);
			// const calData = _.takeRight(cal, 100);
			// 			// .then( async (calRes) => {
			// 				// const cal = calRes[0]['activities-calories'];
			// 				// const calData = _.takeRight(cal, 100);

			// const distanceRes = await client.get('/activities/distance/date/today/1y.json', result.access_token)
			// 				// 	.then( async (distanceRes) => {
			// const distance = distanceRes[0]['activities-distance'];
			// const disData = _.takeRight(distance, 100);
									
			// _.forEach(stepData, async (val) => {
			// 	let date = new Date(val.dateTime).getTime() / 1000
			// 	let step = new Health({
			// 		chartType: 'column',
			// 		name: 'steps',
			// 		timestamp: date,
			// 		unit: 'step',
			// 		value: val.value,
			// 		max: 0,
			// 		type: 'step',
			// 		_user: _id
			// 	});
			// 	let stepResult = await step.save();
			// })

			// _.forEach(calData, async (val) => {
			// 	let date = new Date(val.dateTime).getTime() / 1000
			// 	let cal = new Health({
			// 		chartType: 'column',
			// 		name: 'calories',
			// 		timestamp: date,
			// 		unit: 'calories',
			// 		value: val.value,
			// 		max: 0,
			// 		type: 'calories',
			// 		_user: _id
			// 	});
			// 	let calResult = await cal.save();
			// })

			// _.forEach(disData, async (val) => {
			// 	let date = new Date(val.dateTime).getTime() / 1000
			// 	let distance = new Health({
			// 		chartType: 'column',
			// 		name: 'distance',
			// 		timestamp: date,
			// 		unit: 'km',
			// 		value: val.value,
			// 		max: 0,
			// 		type: 'distance',
			// 		_user: _id
			// 	});
			// 	let disResult = await distance.save();
			// })
			// if (disResult) {
			// 	res.redirect('https://welse-node-v6.azurewebsites.net');
			// } else {
			// 	res.json({'message': 'error'});
			// }

			// 					})
			// 			})


			// });
		})
		.catch( (error) => {
			console.log(error);
			res.send(error);
		})
})



export default router;

