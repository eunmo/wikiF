(function () {
	'use strict';

	module.exports = function (router, db) {
		var Issues = db.collection ('Issues');
		
		router.get ('/issue/search/:_query', function (req, res) {
			var query = req.params._query;

			Issues.find ({ $or: [ { number: Number(query) },
														{ name: { $regex: query, $options: 'i' } },
														{ notes: { $elemMatch: { detail: { $regex: query, $options: 'i' } } } } ] }).toArray ()
			.then (function (docs) {
				res.json (docs);
			});
		});
	};
}());
