import express from 'express';
import mongoose from 'mongoose';
import { tokenManage } from '../helper';
import { Goal } from '../models';
var router = express.Router();
/**
 * Set goal
 * Remove goal
 * Get goal
 */

router.post('/set', async (req, res, next) => {
	const token = req.body.token;
	const name = req.body.name;
	const value = req.body.value;
	try {
		const tokenUser = await tokenManage.verify(token);
		const goalExist = await Goal.findOne({ _user: tokenUser._id, name });
		let result = false;
		if (goalExist) {
			result = await Goal.update({ _user: tokenUser._id, name }, { value });
		} else {
			const goal = new Goal({
				_user: tokenUser._id,
				name,
				value
			});
			result = await goal.save();
		}

		if (result) {
			res.json({ message: "success" });
		} else {
			res.status(400).json({ message: "error" });
		}
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

router.post('/remove', async (req, res, next) => {
	const token = req.body.token;
	const name = req.body.name;
	try {
		const tokenUser = await tokenManage.verify(token);
		const goal = await Goal.remove({ _user: tokenUser._id, name });
		if (goal) {
			res.json({ message: "success" });
		} else {
			res.status(400).json({ message: "error" });
		}
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
})

router.post('/', async (req, res, next) => {
	const token = req.body.token;
	try {
		const tokenUser = await tokenManage.verify(token);
		const goals = await Goal.find({});
		console.log(goals);
		// Check user
		const goal = await Goal.find({ _user: tokenUser._id });
		res.json(goal);
	} catch (err) {
		console.log('Erorr: ' + err);
		res.status(400).json(err);
	}
});

export default router;