import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import { tokenManage } from '../helper';
import { User, Health, Notification } from '../models';
var router = express.Router();
/**
 * push health data
 * Get health data
 */

router.post('/push', async (req, res, next) => {
	const email = req.body.email;
	const data = req.body.data;
	try {
		const user = await User.findOne({ email });
		if(user) {
			const health = new Health({
				chartType: data.chartType,
				name: data.name,
				timestamp: data.timestamp,
				unit: data.unit,
				value: data.value,
				max: data.max,
				type: data.type || 'blood',
				isDanger: (data.value > data.max) ? true : false,
				_user: user._id
			});
			const result = await health.save();
			if (data.value > data.max) {
				let notification = new Notification({
						message: "is out of bound",
						name: data.name,
						_patient: user._id,
						_user: user._id,
						read: false
					});
				let resultNotification = await notification.save();
				_.forEach(user.followers, async (follower) => {
					let notification = new Notification({
						message: "is out of bound",
						name: data.name,
						_patient: user._id,
						_user: follower,
						read: false
					});
					let resultNotification = await notification.save();
				});
			}
			// Creatinine
			if (data.name == 'Creatinine' || data.name == 'creatinine') {
				const dataGFR = {
					chartType: 'column',
					name: 'eGFR',
					timestamp: new Date().getTime() / 1000,
					unit: 'ml/min/1.73m2',
					type: 'blood',
					_user: user._id
				}
				if (user.gender == 'Male' || user.gender == 'male') {
					// male
					if (data.value > 0.9) {
						dataGFR.value = (Math.pow(144 * (data.value / 0.7), -1.209)) * (Math.pow(0.993, parseInt(user.age)))
					} else {
						dataGFR.value = (Math.pow(144 * (data.value / 0.7), -0.411)) * (Math.pow(0.993, parseInt(user.age)))
					}
					dataGFR.max = 1.2
					dataGFR.isDanger = (data.value > data.max) ? true : false;
				} else if(user.gender == 'Female' || user.gender == 'female') {
					// famale
					if (data.value > 0.7) {
						dataGFR.value = (Math.pow(144 * (data.value / 0.7), -1.209)) * (Math.pow(0.993, parseInt(user.age)))
					} else {
						dataGFR.value = (Math.pow(144 * (data.value / 0.7), -0.329)) * (Math.pow(0.993, parseInt(user.age)))
					}
					dataGFR.max = 1.1;
					dataGFR.isDanger = (data.value > data.max) ? true : false;
				}
				let healthGFR = new Health({
					chartType: dataGFR.chartType,
					name: dataGFR.name,
					timestamp: dataGFR.timestamp,
					unit: dataGFR.unit,
					type: dataGFR.type,
					value: dataGFR.value,
					max: dataGFR.max,
					isDanger: dataGFR.isDanger,
					_user: dataGFR._user
				});
				var resultGFR = await healthGFR.save();
			}

			if (result) {
				res.json({ message: "success" });
			} else {
				res.status(400).json({ message: "error, data cannot be saved" });
			}
		} else {
			res.status(400).json({ message: "User not found!"});
		}
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

router.post('/', async (req, res, next) => {
	const token = req.body.token;
	try {
		const tokenUser = await tokenManage.verify(token);
		const health = await Health.find({ _user: tokenUser._id }).sort({ createdAt: -1});
		let healthRetval = {};
		_.forEach(health, (val) => {
			if (!healthRetval[val.name]) {
				healthRetval[val.name] = [];
			}
			healthRetval[val.name].push(val);
		})
		res.json(healthRetval);
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
})

router.post('/user', async (req, res, next) => {
	const _id = req.body._id;
	try {
		const health = await Health.find({ _user: _id }).sort({ createdAt: -1 });
		let healthRetval = {};
		_.forEach(health, (val) => {
			if (!healthRetval[val.name]) {
				healthRetval[val.name] = [];
			}
			healthRetval[val.name].push(val);
		})
		res.json(healthRetval);
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});


// remove all
router.delete('/', async (req, res, next) => {
	const token = req.body.token;
	try {
		const tokenUser = await tokenManage.verify(token);
		const health = await Health.remove({ _user: tokenUser._id });
		res.json(health);
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
})

router.delete('/remove', async (req, res, next) => {
	const token = req.body.token;
	const key = req.body.req;

	try {
		const tokenUser = await tokenManage.verify(token);
		const healthRemove = await Health.remove({ _user: tokenUser._id, name: key });
		res.json(healthRemove);
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});


export default router;