wfApp = angular.module ('wfApp', ['ngRoute'])
.config (function ($routeProvider) {
	$routeProvider
	.when ('/', {
		templateUrl: '/partials/meta.html',
		controller: 'MetaCtrl'
	})
	.when ('/issue/add', {
		templateUrl: '/partials/add-issue.html',
		controller: 'AddIssueCtrl'
	})
	.when ('/issue/edit/:_id', {
		templateUrl: '/partials/edit-issue.html',
		controller: 'EditIssueCtrl'
	})
	.when ('/issues/:team/:week', {
		templateUrl: '/partials/team-issues.html',
		controller: 'TeamIssuesCtrl'
	})
	.when ('/item/add', {
		templateUrl: '/partials/add-item.html',
		controller: 'AddItemCtrl'
	})
	.when ('/item/edit/:id', {
		templateUrl: '/partials/edit-item.html',
		controller: 'EditItemCtrl'
	})
	.when ('/handler/:handler', {
		templateUrl: '/partials/handler.html',
		controller: 'HandlerCtrl'
	})
	.when ('/items/all/:week', {
		templateUrl: '/partials/all-items.html',
		controller: 'AllItemsCtrl'
	})
	.when ('/wiki/load', {
		templateUrl: '/partials/load-wiki.html',
		controller: 'LoadWikiCtrl'
	})
	.when ('/wiki/week/:week', {
		templateUrl: '/partials/wiki.html',
		controller: 'WikiCtrl'
	})
	.when ('/archive/all', {
		templateUrl: '/partials/archive-all.html',
		controller: 'ArchiveAllCtrl'
	})
	.when ('/archive/search', {
		templateUrl: '/partials/archive-search.html',
		controller: 'ArchiveSearchCtrl'
	})
	.otherwise ({
		redirectTo: '/'
	});
});

wfApp.factory ('NameService', function () {
	return {
		modules: ['admin', 'other'],
		admin: ['양은모'],
		other: ['김용권', '김인근', '김준산', '전영환']
	};
});

wfApp.factory ('TeamService', function () {
	return {
		teams: ['F1', 'F2', 'F3'],
		F1: ['김용권', '양은모'],
		F2: ['김준산', '김인근'],
		F3: ['전영환']
	};
});

wfApp.service ('NoteService', function () {

	this.detail1 = '현상 : \n원인 : \n조치 or 해결 or 경과 : ';
	this.detail2 = '조치 or 해결 or 경과 : ';

	this.toMonday = function (date) {
		var monday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		monday.setDate (monday.getDate () + (1 - monday.getDay ()));
		return monday;
	};

	this.toPrevMonday = function (date) {
		var monday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		monday.setDate (monday.getDate () + (-6 - monday.getDay ()));
		return monday;
	};

	this.validateNotes = function (notes) {
		var i, j;
		var di, dj;
		
		for (i = 0; i < notes.length; i++) {
			notes[i].date = this.toMonday (notes[i].date);
		}

		for (i = 0; i < notes.length; i++) {
			di = notes[i].date;
			for (j = i + 1; j < notes.length; j++) {
				dj = notes[j].date;
				if (di.toISOString () === dj.toISOString ()) {
					return false;
				}
			}
		}

		return true;
	};

	this.compareDates = function (a, b) {
		var da = a.date.toISOString ();
		var db = b.date.toISOString ();

		if (da < db) {
			return -1;
		} else if (da > db) {
			return 1;
		}

		return 0;
	};

	this.getNotesToSend = function (input) {
		var notes = [];
		var i, note;

		for (i in input) {
			note = input[i];
			if (note.detail !== '' &&
					note.detail !== this.detail1 &&
					note.detail !== this.detail2) {
				notes.push (note);
			}
		}

		notes.sort (this.compareDates);
		return notes;
	};

	this.formatNotes = function (notes) {
		for (var j in notes) {
			notes[j].details = notes[j].detail.split ('\n');
			notes[j].style = [];

			for (var k in notes[j].details) {
				if (notes[j].details[k][3] !== ':') {
					notes[j].style[k] = 'indent-detail';
				}
			}
		}
	};
});
