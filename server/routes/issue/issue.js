(function () {
	'use strict';

	var ObjectID = require('mongodb').ObjectID;

	module.exports = function (router, db) {
		var Issues = db.collection ('Issues');

		router.get ('/issue/:_id', function (req, res) {
			var _id = ObjectID (req.params._id);

			Issues.find ({ _id: _id }).toArray ()
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
