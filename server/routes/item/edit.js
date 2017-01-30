(function () {
	'use strict';
	
	var ObjectID = require('mongodb').ObjectID;

	module.exports = function (router, db) {
		var Items = db.collection ('Items');

		router.put ('/item/edit', function (req, res) {
			var item = req.body;

			var newItem = {
				name: item.name,
				state: item.state,
			};

			if (item.notes.length > 0) {
				newItem.notes = item.notes;
			}

			Items.update (
				{ _id: ObjectID (item._id) },
				{ $set: newItem }
			)
			.then (function () {
				res.sendStatus (200);
			});
		});
	};
}());
