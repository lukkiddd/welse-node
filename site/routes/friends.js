import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import { tokenManage } from '../helper';
import { Friend, User } from '../models';
var router = express.Router();
/**
 * follow friend
 * unfollow friend
 * confirm follow
 * decline follow
 * get friends
 */

router.post('/follow', async (req, res, next) => {
	const token = req.body.token;
	const follow_id = req.body.follow_id;
	try {
		const tokenUser = await tokenManage.verify(token);
		const user = await User.findOne({ _id: tokenUser._id});
		const isFollow = _.find(user.pending, function (val) {
			return val == follow_id
		});
		if(!isFollow) {
			const friend = await User.findOne({ _id: follow_id });
			user.pending.push(follow_id);
			friend.request.push(tokenUser._id);
			const result = await user.save();
			const resultFriend = await friend.save();
			if (result && resultFriend) {
				res.json({ message: "success" });
			} else {
				res.status(400).json({ message: "error" });
			}
		} else{
			res.status(400).json({ message: "This user have been followed" });
		}
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

router.post('/unfollow', async (req, res, next) => {
	const token = req.body.token;
	const follow_id = req.body.follow_id;
	try {
		const tokenUser = await tokenManage.verify(token);
		const user = await User.findOne({ _id: tokenUser._id});
		const isFollow = _.find(user.following, function (val) {
			return val == follow_id
		});
		if(isFollow) {
			const friend = await User.findOne({ _id: follow_id });
			user.following.pull(follow_id);
			friend.follower.pull(tokenUser._id);
			const result = await user.save();
			const resultFriend = await friend.save();
			if (result && resultFriend) {
				res.json({ message: "success" });
			} else {
				res.status(400).json({ message: "error" });
			}
		} else{
			res.status(400).json({ message: "This user have been followed" });
		}
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

router.post('/confirm', async (req, res, next) => {
	const token = req.body.token;
	const follow_id = req.body.follow_id;
	try {
		const tokenUser = await tokenManage.verify(token);
		const user = await User.findOne({ _id: tokenUser._id});
		const isRequest = _.find(user.request, function (val) {
			return val == follow_id
		});
		if(isRequest) {
			const friend = await User.findOne({ _id: follow_id });
			user.request.pull(follow_id);
			user.follower.push(follow_id);
			friend.pending.pull(tokenUser._id);
			friend.following.push(tokenUser._id);
			const result = await user.save();
			const resultFriend = await friend.save();
			if (result && resultFriend) {
				res.json({ message: "success" });
			} else {
				res.status(400).json({ message: "error" });
			}
		} else{
			res.status(400).json({ message: "This user have been followed" });
		}
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

router.post('/decline', async (req, res, next) => {
	const token = req.body.token;
	const follow_id = req.body.follow_id;
	try {
		const tokenUser = await tokenManage.verify(token);
		const user = await User.findOne({ _id: tokenUser._id});
		const isRequest = _.find(user.request, function (val) {
			return val == follow_id
		});
		if(isRequest) {
			const friend = await User.findOne({ _id: follow_id });
			user.request.pull(follow_id);
			friend.pending.pull(tokenUser._id);
			const result = await user.save();
			const resultFriend = await friend.save();
			if (result && resultFriend) {
				res.json({ message: "success" });
			} else {
				res.status(400).json({ message: "error" });
			}
		} else{
			res.status(400).json({ message: "This user have been followed" });
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
		const friends = await Friend.find({ _user: tokenUser._id }).populate('friend', 'fname lname email profilePic');
		if (friends) {
			res.json(friends);
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
	try {
		const tokenUser = await tokenManage.verify(token);
		const result = await Friend.remove({ _user: tokenUser._id });
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

 export default router;