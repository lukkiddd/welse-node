import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import { tokenManage } from '../helper';
import { Notification } from '../models';
var router = express.Router();
/**
 * Get notification data
 * Read
 */

router.post('/', async (req, res, next) => {
	const token = req.body.token;
	try {
		const tokenUser = await tokenManage.verify(token);
		const nofitications = await Notification.find({ _user: tokenUser._id });
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
		const nofitications = await Notification.update({ _id: notification_id }, { read: true });
		if (nofitications) {
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