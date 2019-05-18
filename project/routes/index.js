var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET new test page. */
router.get('/newtest', function(req, res, next) {
    res.render('newtest');
});



router.get('/registration', function(req, res, next) {
    res.render('registration');

});router.post('/regnew', urlencodedParser, function(req, res, next) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;

	console.log(username);

		
	


	/* const db = require('db_connection.js');

	db.query('INSERT INTO Users (username, email, password) VALUES (?,?,?)',[username,email,password], function(error,result,fields)
	{
		if (error) throw error;

		
	}) */
  res.render('registration');
});



module.exports = router;
