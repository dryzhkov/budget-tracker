const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const apiRoutes = require('../routes/api');
const authRoutes = require('../routes/auth');
const app = express();
const serverless = require('serverless-http');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../build')));

// initialize passport
app.use(passport.initialize());

// load passport strategies
const localLoginStrategy = require('../passport/local-login');
passport.use('local-login', localLoginStrategy);
const localSignupStrategy = require('../passport/local-signup');
passport.use('local-signup', localSignupStrategy);
const baseUrlPath =
  process.env.NODE_ENV === 'development' ? '' : '/.netlify/functions/app';

// pass the authenticaion checker middleware
const authCheckMiddleware = require('../passport/auth-check');
app.use(`${baseUrlPath}/api`, authCheckMiddleware);

// register app routes
app.use(`${baseUrlPath}/api`, apiRoutes);
app.use(`${baseUrlPath}/auth`, authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
module.exports.handler = serverless(app);
