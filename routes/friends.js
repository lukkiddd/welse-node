import express from 'express';
import { Friend } from '../models';
var router = express.Router();
/**
 * - Add Friend
 * - Remove Friend
 * - Confirm Friend
 * - Decline Friend
 * - Get Friend
 */

router.post('/add', (req, res, next) => {
	// add friend
	try {
		const friendId = req.body.friendId;
		const userId = req.body.userId;
		// add to friend request
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

router.post('/remove', (req, res, next) => {
	try {
		const friendId = req.body.friendId;
		const userId = req.body.userId;
		// remove from friend
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

router.post('/confirm', (req, res, next) => {
	try {
		const friendId = req.body.friendId;
		const userId = req.body.userId;
		// Set Confirm

		// remove from frirnd request, then
		// add to friend
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

router.post('/decline', (req, res, next) => {
	try {
		const friendId = req.body.friendId;
		const userId = req.body.userId;
		// Decline
		// Remove from friend request
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

// Get Friend
router.get('/', (req, res) => {
	User.find({}, (err, users) => {
		if (err) throw err;
		res.json(users);
	})
});

module.exports = router;