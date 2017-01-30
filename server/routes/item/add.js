(function () {
	'use strict';

	module.exports = function (router, db) {
		var Items = db.collection ('Items');

		router.put ('/item/add', function (req, res) {
			var item = req.body;

			var newItem = {
				name: item.name,
				handler: item.handler,
				state: item.state,
			};

			Items.insert (newItem).then (function () {
				res.sendStatus (200);
			});
		});
	};
}());
