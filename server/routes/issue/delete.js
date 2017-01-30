(function () {
	'use strict';
	
	var ObjectID = require('mongodb').ObjectID;

	module.exports = function (router, db) {
		var Issues = db.collection ('Issues');

		router.put ('/issue/delete', function (req, res) {
			var issue = req.body;
				
			Issues.remove ({ _id: ObjectID (issue._id) })
			.then (function () {
				res.sendStatus (200);
			});
		});
	};
}());
