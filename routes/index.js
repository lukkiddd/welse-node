import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.redirect('/index.html');
});

module.exports = router;
