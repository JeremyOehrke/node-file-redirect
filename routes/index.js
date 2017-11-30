var express = require('express');
var router = express.Router();

//DB
var pg = require('pg');
var dbpool = new pg.Pool({
	connectionString: process.env.DATABASE_URL + '?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'
});

/* GET home page. */
router.get('/', function(req, res, next) {
	dbpool.connect(function(err, client, done) {
		if (err){ return res.status(500)}
		client.query('SELECT value FROM props where name = \'url\'', function(err, rec) {
			done();
			if (err)
				{ console.error(err); res.status(500); }
			else
				{ 
					var loc = rec.rows[0].value
					res.redirect(loc)
				}
		});
	});
});

router.put('/', function(req,res,next){
	if (req.body.key == process.env.SUPER_SECRET_KEY) {
		dbpool.connect(function(err, client, done) {
			if (err){ return res.status(500)}
			client.query('update props set value = $1::text where name = \'url\'', [req.body.url], function(err, rec) {
				done();
				if (err)
					{ console.error(err); res.status(500); }
				else
					{ 
						res.send('Updated to: ' + req.body.url)
					}
			});
		});
	}
	else {
		res.send('Nuh Uh. Not doin\' it.')
	}
});

module.exports = router;
