(function () {
	'use strict';

	var ObjectID = require('mongodb').ObjectID;

	module.exports = function (router, db) {
		var Items = db.collection ('Items');

		router.get ('/item/:_id', function (req, res) {
			var id = req.params._id;

			Items.find ({ _id: ObjectID (id) }).toArray ()
			.then (function (docs) {
				if (docs.length > 0) {
					res.json (docs[0]);
				}
				else {
					res.json ({});
				}
			});
		});
	};
}());
