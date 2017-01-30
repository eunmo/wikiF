(function () {
	'use strict';

	module.exports = function (router, db) {
		var Items = db.collection ('Items');

		router.get ('/items/all', function (req, res) {
			var year = req.query.year;
			var month = req.query.month;
			var day = req.query.day;
			var date = new Date(Date.UTC(year, month - 1, day)).toISOString();

			Items.find ({ notes: { $elemMatch: { date: date } } }).toArray ()
			.then (function (docs) {
				res.json (docs);
			});
		});
	};
}());
