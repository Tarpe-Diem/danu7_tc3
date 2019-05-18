var express = require('express');
var router = express.Router();


router.get('/registration', function(req, res, next) {

  res.render('registration', { title: 'Registration' });
});

/*what happens when the site reacts to a postrequest of ure/register

router.post('/regnew', function(req, res, next) {
	var username = req.body.username
	var email = req.body.email;
	var password = req.body.password;
	console.log('username' + username);


	/*const db = require('db_connection.js');

	db.query('INSERT INTO Users (username, email, password) VALUES (?,?,?)',[username,email,password], function(error,result,fields)
	{
		if (error) throw error;

		
	})
  res.render('/registration');
});  */

module.exports = router;
