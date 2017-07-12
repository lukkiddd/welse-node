import express from 'express';
import { User } from '../models';
var router = express.Router();
/**
 * - Register
 * - Login
 * - Logout
 * - Push data (profile)
 * - get Profile
 * - edit Profile
 * - Get User Profile
 * - Get user
 */


router.post('/register', (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const fname = req.body.fname;
	const lname = req.body.lname;
	const profilePic = req.body.profilePic
	
	var user = new User({
		email: email,
		password: password,
		fname: fname,
		lname: lname,
		profilePic: profilePic,
		// Token genereated
	});
	user.save( (error) => {
		if (error) throw err;
		res.json({status: 'OK'});
	})
});

router.post('/login', async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	try {
		const result = await User.findOne({ email });
		if(!result) {
			let message = 'User not found!';
		} else if(result) {
			if(password === result.password) {
				//generate token
				res.json({ email: result.email, id: result._id });
			} else {
				message = 'Password not Match!';
			}
		}
		console.log('Error', { message });
		res.status(500).json({ message });
	} catch (err) {
		console.log('Error: ', err);
		res.status(500).json(err);
	}
});

router.post('/logout', async (req, res, next) => {
	try {
		const token = req.body.token || req.query.token;
		const removeToken = await User.update({
				token: {
					$in: [token]
				}
			}, {
				$pull: {
					'token': token
				}
			}
		);
		console.log('#WARN : Remove token result: ', removeToken);
		res.json({message: 'Logout successful!'});
	} catch (err) {
		console.log('Error: ', err);
		res.status(400).json(err);
	}
});

/**
 * Push profile data
 */
// router.post('/profile/add', async (req, res, next) => {
// 	try {
// 		const result = await User.update(
// 			{ _id: req.params.userId },
			
// 		);
// 	} catch (err) {
// 		console.log('Error: ', err);
// 		res.status(400).json(err);
// 	}
// });

router.post('/profile/edit', (req, res) => {
	try {
		const userId = req.body.userId;
		const profileId = req.body.profileId;
		// edit profile of user
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

router.get('/profile', (req, res) => {
	try {
		const userId = req.body.userId;
		// Get user then return
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

// Get Users
router.get('/', (req, res) => {
	User.find({}, (err, users) => {
		if (err) throw err;
		res.json(users);
	})
});

module.exports = router;