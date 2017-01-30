(function () {
	'use strict';
	
	var ObjectID = require('mongodb').ObjectID;

	module.exports = function (router, db) {
		var Items = db.collection ('Items');

		router.put ('/item/delete', function (req, res) {
			var item = req.body;
				
			Items.remove ({ _id: ObjectID (item._id) })
			.then (function () {
				res.sendStatus (200);
			});
		});
	};
}());
