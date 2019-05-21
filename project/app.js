var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser= require('body-parser');
var { check,validationResult } = require('express-validator/check');
var flash = require('express-flash');


//Authentification
var session = require('express-session');
var passport = require ('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcrypt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use ( bodyParser.json( { type: 'text/*' } )); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = {
  host: "mysql1.it.nuigalway.ie",
  user: "mydb4759tc",
  password: "rrrfff5948",
  database: "mydb4759"
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  //cookie: { secure: true }
}))
app.use(passport.initialize()); // needs to be below session middleware
app.use(passport.session());

app.use(function(req,res,next){
	res.locals.isAuthenticated = req.
		isAuthenticated();
	next();
})
app.use('/', indexRouter);
app.use('/users', usersRouter);

passport.use(new LocalStrategy(
  function(username, password, done) {
    	console.log(username);
    	console.log(password);

    	 const db = require('./routes/db_connection.js');

    	db.query('SELECT id, password FROM Users WHERE username = ?', [username],
    		function(err, results, fields){
    			if (err) {done(err)}; // provided by passport manages errors automatically with db connections

    			if (results.length === 0) {
    				done (null,false);
    			} else {

    				const hash = results[0].password.toString();

    				bcrypt.compare(password, hash, function(err, response){
    					if (response === true){
    						return done(null, {user_id: results[0].id});  //pass through an object with prop of user id that is equal to id grabbed from db 
    					} else {
    						return done (null, false)// if it doesnt work 
    					}


    			 });
    			 
    		}

      })
    }
  
));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
