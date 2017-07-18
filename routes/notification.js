import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import { tokenManage } from '../helper';
import { Notification } from '../models';
var router = express.Router();

router.post('/', async (req, res, next) => {
	const token = req.body.token;
	try {
		const tokenUser = await tokenManage.verify(token);
		const nofitications = await Notification.find({ _user: tokenUser._id }).populate('_user').populate('_patient');
		res.json(nofitications);
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

router.post('/read', async (req, res, next) => {
	const token = req.body.token;
	const notification_id = req.body.notification_id;
	try {
		const tokenUser = await tokenManage.verify(token);
		const nofitication = await Notification.update({ _user: tokenUser._id, _id: notification_id }, { read: true });
		if (nofitication) {
			res.json({ message: "success" });
		} else {
			res.status(400).json({ message: "error" });
		}
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
})

router.post('/add', async (req, res, next) => {
	const token = req.body.token;
	const userId = req.body.userId;
	const message = req.body.notification;
	const name = req.body.name;
	try {
		const tokenUser = await tokenManage.verify(token)
		const notification = new Notification({
			message,
			name,
			_patient: userId,
			_user: tokenUser._id,
			read: false
		});
		const result = await notification.save();
		if (result) {
			res.json({ message: "success" });
		} else {
			res.status(400).json({ message: "error" });
		}
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
})

export default router;