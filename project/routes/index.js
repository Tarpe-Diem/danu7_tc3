var express = require('express');
var router = express.Router();

var passport = require ('passport');

var bcrypt = require('bcrypt');
const saltRounds = 10;


bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
/* var { check, validationResult } = require('express-validator/check');*/ 



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/home', function(req, res, next) {
	console.log(req.user); 
	console.log(req.isAuthenticated());
 	res.render('home', { title: 'Home' });
});

router.get('/profile', authenticationMiddleware (),function(req, res, next) {
  res.render('profile', { title: 'Profile' });
});

router.get('/login', function(req, res, next) {
    res.render('login'), { title: 'Login' };
});

/* GET new test page. */
router.get('/newtest', function(req, res, next) {
    res.render('newtest');
});

router.post('/login',  passport.authenticate
	( 'local', {
	successRedirect: '/profile',
	failureRedirect: '/login',
}));


router.get('/registration', function(req, res, next) {
    res.render('registration');

	});
router.post('/regnew',  function(req, res, next) {

	/*check('username', 'Username field cannot be empty.').notEmpty();
	check('username', 'Username must be between 4-15 characters long.').len(4, 15);
	check('email', 'The email you entered is invalid, please try again.').isEmail();
	check('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
	check('password', 'Password must be between 8-100 characters long.').len(8, 100);
	check("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
	check('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
	check('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);*/	

	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	

	console.log(username);


	 const db = require('./db_connection.js');

	bcrypt.hash(password, saltRounds, function(err, hash) {
  // Store hash in your password DB.
		db.query('INSERT INTO Users (username, email, password) VALUES (?,?,?)',[username,email,hash], function(error,result,fields)
		{
		if (error) throw error;

		db.query('SELECT LAST_INSERT_ID() as user_id', function(error, results, fields) {
			if (error) throw error;

			const user_id = results[0];


			console.log(results[0]);
			req.login(user_id,function(err){
				res.redirect('/home');
			});



		});	
		/*res.render('registration', { title: 'Success' }); */
		});	
	});
 
});
passport.serializeUser(function(user_id, done) { //store user id in session
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) { //read from the session
  
    done(null, user_id);
  });

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(
			`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}

module.exports = router;
