import express from 'express';
import { Health } from '../models';
var router = express.Router();
/**
 * - Add health data
 * - Get health data
 * - Get health (n days)
 * - Get health realtime data
 */

// Add health data
router.post('/add', (req, res) => {
	try { 
		const userId = req.body.userId;
		const chartType = req.body.chartType;
		const name = req.body.name;
		const timestamp = req.body.timestamp;
		const unit = req.body.unit;
		const value = req.body.value;
		// Add health value to user
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

// Get health data
router.get('/', (req, res) => {
	try {
		const userId = req.body.userId;
		// Get health data
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});

// Get health data last n (day)
// (experiment)
router.get('/last/:n', (req, res) => {
	try {
		const userId = req.body.userId;
		const nDay = req.params.n;
		// Get health data in n days
	} catch (err) {
		console.log('Error: ' + err);
		res.status(400).json(err);
	}
});


module.exports = router;
