import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import { tokenManage } from '../helper';
import { User, Health, Friend } from '../models';
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
				_user: user._id
			});
			const result = await health.save();
			if(health.value > health.max) {
				const notification = new Notification({
					_user: user._id,
					message: user.fname + '\s ' + data.name + ' is out of bound.',
					read: false
				});
				const myNoti = await notification.save();
				const friends = await Friend.find({ _user: user._id });
				_.forEach(friends, async (friend) => {
					let noti = new Notification({
						_user: friend.friend._id,
						message: user.fname + '\s ' + data.name + ' is out of bound.',
						read: false
					});
					let friendNoti = await noti.save();
				});
				
			}
			if (friendNoti && myNoti) {
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

// Test
router.post('/', async (req, res, next) => {
	const token = req.body.token;
	try {
		const tokenUser = await tokenManage.verify(token);
		const health = await Health.find({ _user: tokenUser._id });
		console.log(health);
		res.json(health);
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
})


export default router;