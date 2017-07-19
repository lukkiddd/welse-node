import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import { tokenManage } from '../helper';
import { Goal } from '../models';
var router = express.Router();
/**
 * Set goal
 * Remove goal
 * Get goal
 */
router.post('/set/user', async (req, res, next) => {
	const _id = req.body._id;
	const name = req.body.name;
	const value = req.body.value;
	try {
		const goalExist = await Goal.findOne({ _user: _id, name });
		let result = false;
		if (goalExist) {
			result = await Goal.update({ _user: _id, name }, { value });
		} else {
			const goal = new Goal({
				_user: _id,
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

router.post('/user', async (req, res, next) => {
	const _id = req.body._id;
	try {
		const goal = await Goal.find({ _user: _id });
		let goalRetval = {};
		_.forEach(goal, (val) => {
			if (!goalRetval[val.name]) {
				goalRetval[val.name] = {};
			}
			goalRetval[val.name] = val;
		});
		
		res.json(goalRetval);
	} catch (err) {
		console.log('Erorr: ' + err);
		res.status(400).json(err);
	}
});

router.post('/', async (req, res, next) => {
	const token = req.body.token;
	try {
		const tokenUser = await tokenManage.verify(token);
		
		const goal = await Goal.find({ _user: tokenUser._id });
		let goalRetval = {};
		_.forEach(goal, (val) => {
			if (!goalRetval[val.name]) {
				goalRetval[val.name] = {};
			}
			goalRetval[val.name] = val;
		});
		
		res.json(goalRetval);
	} catch (err) {
		console.log('Erorr: ' + err);
		res.status(400).json(err);
	}
});

export default router;