(function () {
	'use strict';

	module.exports = function (router, db) {
		var Archive = db.collection ('Archive');

		router.get ('/archive/all', function (req, res) {
			Archive.find ({}).toArray ()
			.then (function (docs) {
				res.json (docs);
			});
		});
	};
}());
