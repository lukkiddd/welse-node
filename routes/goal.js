import express from 'express';
import { Goal } from '../models';
var router = express.Router();
/**
 * - Get goal
 * - Edit goal
 */

// Get Goal
router.get('/', (req, res) => {
	try {
		const userId = req.body.userId;
		// Get goal
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

// Edit Goal
router.post('/edit', (req, res) => {
	try { 
		const userId = req.body.userId;
		const goal = req.body.goal;
		const goalValue = req.body.goalValue;
		// Set goalValue
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
})

module.exports = router;