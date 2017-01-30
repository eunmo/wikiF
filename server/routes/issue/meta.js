(function () {
	'use strict';

	module.exports = function (router, db) {
		var Issues = db.collection ('Issues');
		
		router.get ('/meta', function (req, res) {
			var meta = [];

			Issues.aggregate([
			{
				$group: {
					_id : { handler: '$handler', state: '$state', minor: '$minor' },
					count: { $sum : 1	}
				}
			},
			{
				$project: {
					_id: 0,
					handler: '$_id.handler',
					state: '$_id.state',
					minor: '$_id.minor',
					count: 1
				}
			}
			]).toArray ()
			.then (function (docs) {
				meta = docs;

				return Issues.find ({ state: 'Active' }, { _id: 0, number: 1, handler: 1 }).toArray ();
			})
			.then (function (docs) {

				res.json ({ meta: meta, active: docs });
			});
		});
		
		router.get ('/issues/all', function (req, res) {
			var year = req.query.year;
			var month = req.query.month;
			var day = req.query.day;
			var date = new Date(Date.UTC(year, month - 1, day)).toISOString();

			Issues.find ({ $or: [ { notes: { $elemMatch: { date: date } } }, { state: { $ne: 'Done' } } ] } ).toArray ()
			.then (function (docs) {
				res.json (docs);
			});
		});
	};
}());
