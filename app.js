var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let db = require('./db');

var indexRouter = require('./routes/index');
var createCharacterRouter = require('./routes/create_character');
var loginRouter = require('./routes/login');
var characterRouter = require('./routes/character');
var assaultRouter = require('./routes/assault');
var deleteEquipmentRouter = require('./routes/deleteEquipment');
var equipItemRouter = require('./routes/equipItem');

var app = express();

var checkLoggedIn = (req, res, next) => req.session.connected ? next() : res.redirect("/login");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var listener = app.listen(3100, function(){
    console.log('Listening on port ' + listener.address().port);
});
app.use('/', indexRouter);
app.use('/createCharacter' , createCharacterRouter);
app.use('/login' , loginRouter);
app.use('/character', checkLoggedIn , characterRouter);
app.use('/assault', checkLoggedIn , assaultRouter);
app.use('/deleteEquipment/', checkLoggedIn , deleteEquipmentRouter);
app.use('/equipItem/', checkLoggedIn ,equipItemRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
