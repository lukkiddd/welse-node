import express from 'express';
import mongoose from 'mongoose';
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
		const isFriend = await Friend.findOne({ _user: tokenUser._id, friend: follow_id });
		if (!isFriend) {
			const friend = new Friend({
				friend: follow_id,
				_user: tokenUser._id,
				isRequest: true
			});
			const result = await friend.save();

			const user = await User.findOne({ _id: tokenUser._id });
			const friendUser = await User.findOne({ _id: follow_id });
			let userClone = _.cloneDeep(user);
			let friendUserClone = _.cloneDeep(friendUser);
			userClone.password = undefined;
			userClone.follower = undefined;
			userClone.follwing = undefined;
			friendUserClone.password = undefined;
			friendUserClone.follower = undefined;
			friendUserClone.follwing = undefined;

			user.following.push(friendUserClone);
			friendUser.follower.push(userClone);
			const userResult = await user.save();
			const friendUserResult = await friendUser.save();
			
			if (userResult && friendUserResult) {
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
		const isFriend = await Friend.findOne({ _user: tokenUser._id, friend: follow_id });
		if (isFriend) {
			const result = await Friend.remove({ _user: tokenUser._id, friend: follow_id });
			if (result) {
				res.json({ message: "success" });
			} else {
				res.status(400).json({ message: "error" });
			}
		} else {
			res.status(400).json({ message: "This user have been unfollowed" });
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
		const isFriend = await Friend.findOne({ _user: tokenUser._id, friend: follow_id });
		if (isFriend) {
			isFriend.isRequest = false;
			const friend = new Friend({
				_user: follow_id,
				friend: tokenUser._id,
				isRequest: false
			});
			const friendResult = await friend.save();
			const result = await isFriend.save();
			if (result) {
				res.json({ message: "success" });
			} else {
				res.status(400).json({ message: "error" });
			}
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
		const isFriend = await Friend.findOne({ _user: tokenUser._id, friend: follow_id, isRequest: true });
		if (isFriend) {
			const result = await Friend.remove({ _user: tokenUser._id, friend: follow_id, isRequest: true });
			if (result) {
				res.json({ message: "success" });
			} else {
				res.status(400).json({ message: "error" });
			}
		} else {
			res.status(400).json({ message: "This user have been declined request" });
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