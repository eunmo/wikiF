(function () {
	'use strict';

	module.exports = function (router, db) {
		var Archive = db.collection ('Archive');
		
		router.get ('/archive/search/:_query', function (req, res) {
			var query = req.params._query;

			Archive.find ({ $or: [ { _id: parseInt(query) },
														 { name: { $regex: query, $options: 'i' } },
														 { note: { $elemMatch: { lines: { $regex: query, $options: 'i' } } } } ] }).toArray ()
			.then (function (docs) {
				res.json (docs);
			});
		});
	};
}());
