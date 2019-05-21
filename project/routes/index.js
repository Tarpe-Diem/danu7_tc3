var express = require('express');
var router = express.Router();

var passport = require ('passport');

var bcrypt = require('bcrypt');
const saltRounds = 10;
const mysql = require ('mysql');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var { check, validationResult } = require('express-validator/check'); 

router.use(bodyParser.json());



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

router.get('/testResults', /*authenticationMiddleware ()*/function(req, res, next) {
  res.render('testResults');
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

router.get('/logout', (req, res, next) => {
	req.logout();
	req.session.destroy(() => {
		res.clearCookie('connect.sid');
		res.redirect('/');



	});
    });

router.get('/viewResults',function(req, res, next) {
  const db = require('./db_connection.js');

  db.query('SELECT * FROM testResults',function(error, results, fields) {
    if(error) throw error;
    
    var results = results;


	console.log;
	res.send({results : results});
			});
    });
 
 router.get('/viewResults/:username',function(req, res, next) {
  const db = require('./db_connection.js');

  db.query('SELECT * FROM testResults where  username= ?',[req.body.username],function(error, results, fields) {
    if(error) throw error;
    
    var results = results;


	console.log;
	res.send({results : results});
			});
    }); 

 
router.get('/registration',  function(req, res, next) {
    res.render('registration');

	});

router.post('/storeResults',  function(req, res, next) {

	var g1 = req.body.g1;
	var g2 = req.body.g2;
	var g3 = req.body.g3;
	var username = req.body.username;
		

	/* function myOutcome(g2, g3) {
              if (tg2 > 7 || g3 > 0) {
			return 'fail';
			} else {
			return'pass';
			}
		} 
	

	console.log(testresult);*/


	 const db = require('./db_connection.js');

	
		db.query('INSERT INTO testResults (username,gradeOne, gradeTwo, gradeThree) VALUES (?,?,?,?)',[username,g1,g2,g3], function(error,result,fields)
		{
		if (error) throw error;
		res.redirect('/home')})
	});

router.post('/regnew', 

	[check('username')
    .isLength({ min:1 }).withMessage('Username must be chosen')
    .isAlphanumeric().withMessage('Username must be a combination of letters and numnbers'),
	
	check('password')
        .isLength({ min:2 }).withMessage('Password must have at least 2 characters')
        .custom((value, {req, loc, path}) => {
            if (value !== req.body.passwordMatch) {
               return false;
           			}
               	else {return value;
               	}
               } ).withMessage('Passwords dont match')
            
        ]
        ,

		
	function(req, res, next){

		var errors = validationResult(req);
   
 		/* if (!errors.isEmpty() ){     
   		 return res.status(422).json({ errors: errors.array() });
   		} */

   		var error_msg = errors.array();
        req.flash('error', error_msg);
        res.render('registration');


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
	    res.redirect('/login');
	}
}

module.exports = router;