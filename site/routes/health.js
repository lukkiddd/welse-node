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


export default router;