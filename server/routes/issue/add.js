(function () {
	'use strict';

	module.exports = function (router, db) {
		var Issues = db.collection ('Issues');

		router.put ('/issue/add', function (req, res) {
			var issue = req.body;

			var newIssue = {
				number: issue.number,
				name: issue.name,
				handler: issue.handler,
				state: issue.state,
				minor: issue.minor
			};

			Issues.insert (newIssue).then (function () {
				res.sendStatus (200);
			});
		});
	};
}());
