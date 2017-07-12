import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger  from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import index from './routes/index';
import user from './routes/user';
import ihealth from './routes/ihealth';
import fitbit from './routes/fitbit';

import config from './config';

mongoose.connect(config.DATABASE, {
	useMongoClient: true
});

var app = express();

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/db/user', user);
app.use('/api/ihealth', ihealth);
app.use('/api/fitbit', fitbit);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
