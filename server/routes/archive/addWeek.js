(function () {
	'use strict';

	module.exports = function (router, db) {
		var Archive = db.collection ('Archive');

		router.put ('/archive/add-week', function (req, res) {
			var issues = req.body.issues;
			var date = req.body.date;
			var bulk = Archive.initializeUnorderedBulkOp ();
			var issue, note;

			console.log (date);

			for (var i in issues) {
				issue = issues[i];
				note = { author: issue.handler, week: date, lines: issue.notes };

				bulk.find( { _id: parseInt(issue.number) } ).upsert ().updateOne (
					{
						$setOnInsert: { name: issue.name },
						$addToSet: { note: note }
					}
				);
			}

			bulk.execute ().then (function (result) {
				res.sendStatus (200);
			}).catch (function (error) {
				console.log (error);
			});
		});
	};
}());
