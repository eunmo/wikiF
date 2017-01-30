(function () {
	'use strict';
	
	var ObjectID = require('mongodb').ObjectID;

	module.exports = function (router, db) {
		var Issues = db.collection ('Issues');

		router.put ('/issue/edit', function (req, res) {
			var issue = req.body;

			var newIssue = {
				number: issue.number,
				name: issue.name,
				handler: issue.handler,
				state: issue.state,
				minor: issue.minor
			};

			if (issue.notes.length > 0) {
				newIssue.notes = issue.notes;
			}

			Issues.remove ({ _id: ObjectID (issue._id) })
			.then (function () {
				Issues.insert (newIssue).then (function () {
					res.sendStatus (200);
				});
			});
		});
	};
}());
