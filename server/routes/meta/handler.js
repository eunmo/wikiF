(function () {
	'use strict';

	module.exports = function (router, db) {
		var Issues = db.collection ('Issues');
		var Items = db.collection ('Items');

		router.get ('/handler/:_handler', function (req, res) {
			var handler = req.params._handler;

			Issues.find ({ handler: handler }).toArray ()
			.then (function (issues) {
				Items.find ({ handler: handler }).toArray ()
				.then (function (items) {
					res.json ({ issues: issues, items: items });
				});
			});
		});
	};
}());
