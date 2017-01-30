wfApp.controller ('AddIssueCtrl', function ($rootScope, $scope, $http, $routeParams, $location, NameService) {

	$scope.modules = [];
	$scope.issue = { number: null, state: 'Active', minor: false, handler: null };
	
	for (var i in NameService.modules) {
		var module = NameService.modules[i];
		$scope.modules.push ({ name: module, handlers: NameService[module] });
	}

	$scope.add = function () {
		if ($scope.issue.number === null) {
			alert ('Number가 null이면 안됩니다.');
		}
		else if ($scope.issue.handler === null) {
			alert ('Handler가 null이면 안됩니다.');
		}
		else {
			$http.put ('issue/add', $scope.issue)
				.then (function (res) {
					$location.url ('/');
				});
		}
	};
});

wfApp.controller ('HandlerCtrl', function ($rootScope, $scope, $http, $routeParams, $location, NoteService) {

	$scope.name = $routeParams.handler;
	$scope.states = [];
	$scope.issueCount = 0;
	$scope.itemCount = 0;

	$http.get ('handler/' + $scope.name)
	.success (function (data) {
		var i, j;
		var array = [];

		var states = ['Active', 'Postponed', 'Done'];
		var styles = ['danger', 'warning', ''];
		for (i in states) {
			array.push ({ state: states[i], issues: [], items: [], style: styles[i] });
		}

		for (i in data.issues) {
			var issue = data.issues[i];
			if (issue.state === 'Active' && issue.notes) {
					issue.expand = true;
			}

			for (j in states) {
				if (issue.state === states[j]) {
					array[j].issues.push (issue);
				}
			}

			NoteService.formatNotes (issue.notes);
		}

		for (i in data.items) {
			var item = data.items[i];

			for (j in states) {
				if (item.state === states[j]) {
					array[j].items.push (item);
				}
			}
			
			NoteService.formatNotes (item.notes);
		}

		for (i in array) {
			if (array[i].issues.length + array[i].items.length > 0) {
				$scope.states.push (array[i]);
				$scope.issueCount += array[i].issues.length;
				$scope.itemCount += array[i].items.length;
			}
		}
	});

	$scope.editIssue = function (issue) {
		$location.url ('issue/edit/' + issue._id);
	};

	$scope.editItem = function (item) {
		$location.url ('item/edit/' + item._id);
	};

	$scope.expand = function (obj) {
		obj.expand = true;
	};

	$scope.shrink = function (obj) {
		obj.expand = false;
	};
});

wfApp.controller ('EditIssueCtrl', function ($rootScope, $scope, $http, $routeParams, $location, NameService, NoteService) {

	$scope.issue = {};
	$scope.modules = [];
	$scope.notes = [];

	$scope.addNote = function () {
		var newNote = {
			date: NoteService.toMonday (new Date())
		};

		if ($scope.notes.length === 0) {
			newNote.detail = NoteService.detail1;
		} else {
			newNote.detail = NoteService.detail2;
		}

		$scope.notes.push (newNote);
	};

	for (var i in NameService.modules) {
		var module = NameService.modules[i];
		$scope.modules.push ({ name: module, handlers: NameService[module] });
	}

	console.log ($routeParams._id);

	$http.get ('issue/' + $routeParams._id)
	.success (function (data) {
		$scope.issue = data;
		if ($scope.issue.notes === undefined) {
			$scope.addNote ();
		} else {
			$scope.notes = $scope.issue.notes;

			for (var i in $scope.notes) {
				$scope.notes[i].date = new Date($scope.notes[i].date);
			}
		}
	});
	
	$scope.edit = function () {
		if (NoteService.validateNotes ($scope.notes)) {
			$scope.issue.notes = NoteService.getNotesToSend ($scope.notes);
			$http.put ('issue/edit', $scope.issue)
				.then (function (res) {
					$location.url ('/handler/' + $scope.issue.handler);
				});
		} else {
			alert ('한 주에 note가 두개 이상이면 안됩니다.');
		}
	};
	
	$scope.delete = function () {
		var r = confirm("진짜 지워요?");

		if (r) {
			$http.put ('issue/delete', $scope.issue)
				.then (function (res) {
					$location.url ('/');
				});
		}
	};
});

wfApp.controller ('MetaCtrl', function ($rootScope, $scope, $http, $routeParams, $location, NameService) {
	
	$scope.modules = [];

	function addMeta (data, moduleName) {
		var i, row, index;
		var names = NameService[moduleName];
		var meta = [];

		for (i in names) {
			meta[i] = {
				name: names[i],
				Active: 0,
				Done: 0,
				Postponed: 0,
				current: []
			};
		}

		for (i in data.meta) {
			row = data.meta[i];
			index = names.indexOf (row.handler);

			if (index === -1)
				continue;
			
			if (row.state === 'Active' || !row.minor) {
				meta[index][row.state] += row.count;
			}
		}

		for (i in data.active) {
			row = data.active[i];
			index = names.indexOf (row.handler);

			if (index === -1)
				continue;

			meta[index].current.push (row.number);
		}

		var module = { name: moduleName, meta: meta };

		$scope.modules.push (module);
	}

	$http.get ('meta')
	.success (function (data) {
		for (var i in NameService.modules) {
			addMeta (data, NameService.modules[i]);
		}
	});
});

wfApp.controller ('AddItemCtrl', function ($rootScope, $scope, $http, $routeParams, $location, TeamService) {

	$scope.teams = [];
	$scope.item = { state: 'Active', handler: null };
	
	for (var i in TeamService.teams) {
		var team = TeamService.teams[i];
		$scope.teams.push ({ name: team, handlers: TeamService[team] });
	}

	$scope.add = function () {
		if ($scope.item.handler === null) {
			alert ('Handler가 null이면 안됩니다.');
		}
		else {
			$http.put ('item/add', $scope.item)
				.then (function (res) {
					$location.url ('/');
				});
		}
	};
});

wfApp.controller ('EditItemCtrl', function ($rootScope, $scope, $http, $routeParams, $location, TeamService, NoteService) {

	$scope.issue = {};
	$scope.notes = [];
	
	$scope.addNote = function () {
		var newNote = {
			date: NoteService.toMonday (new Date())
		};

		newNote.detail = '';

		$scope.notes.push (newNote);
	};
	
	$http.get ('item/' + $routeParams.id)
	.success (function (data) {
		$scope.item = data;
		if ($scope.item.notes === undefined) {
			$scope.addNote ();
		} else {
			$scope.notes = $scope.item.notes;

			for (var i in $scope.notes) {
				$scope.notes[i].date = new Date($scope.notes[i].date);
			}
		}
	});
	
	$scope.edit = function () {
		if (NoteService.validateNotes ($scope.notes)) {
			$scope.item.notes = NoteService.getNotesToSend ($scope.notes);
			$http.put ('item/edit', $scope.item)
				.then (function (res) {
					$location.url ('/handler/' + $scope.item.handler);
				});
		} else {
			alert ('한 주에 note가 두개 이상이면 안됩니다.');
		}
	};
	
	$scope.delete = function () {
		var r = confirm("진짜 지워요?");

		if (r) {
			$http.put ('item/delete', $scope.item)
				.then (function (res) {
					$location.url ('/');
				});
		}
	};
});

wfApp.controller ('AllItemsCtrl', function ($rootScope, $scope, $http, $routeParams, $location, TeamService, NoteService) {

	$scope.teams = [];
	$scope.map = {};
	
	if ($routeParams.week === 't') {
		$scope.date = NoteService.toMonday (new Date ());
	}
	else {
		$scope.date = NoteService.toPrevMonday (new Date ());
	}
	
	for (var i in TeamService.teams) {
		var team = TeamService.teams[i];
		var handlers = TeamService[team];
		$scope.teams[i] = { name: team, handlers: [] };

		for (var j in handlers) {
			var handler = { name: handlers[j], items: [] };
			$scope.map[handler.name] = handler;
			$scope.teams[i].handlers.push (handler);
		}
	}

	var params = {
		year: $scope.date.getFullYear(),
		month: $scope.date.getMonth() + 1,
		day: $scope.date.getDate()
	};

	$http.get ('items/all', { params: params })
	.success (function (data) {
		$scope.items = data;
		var item, handler;

		for (var i in data) {
			item = data[i];

			for (var j in item.notes) {
				if (item.notes[j].date === $scope.date.toISOString ()) {
					item.thisWeek = item.notes[j];
				}
			}
			NoteService.formatNotes (item.notes);

			handler = $scope.map[item.handler];
			handler.items.push(item);
		}
	});

	$scope.expand = function (obj) {
		obj.expand = true;
	};

	$scope.shrink = function (obj) {
		obj.expand = false;
	};
});

wfApp.controller ('TeamIssuesCtrl', function ($rootScope, $scope, $http, $routeParams, $location, TeamService, NoteService) {

	$scope.team = $routeParams.team;
	$scope.handlers = [];
	$scope.map = {};
	
	if ($routeParams.week === 't') {
		$scope.date = NoteService.toMonday (new Date ());
	}
	else {
		$scope.date = NoteService.toPrevMonday (new Date ());
	}
	
	var handlers = TeamService[$scope.team];
	var states = ['해결', '미해결', '장기수'];
	var styles = ['', 'warning', 'danger'];

	for (var i in handlers) {
		var handler = { name: handlers[i], states: [] };

		for (var j in states) {
			handler.states.push ({ state: states[j], issues: [], style: styles[j] });
		}

		$scope.map[handler.name] = handler;
		$scope.handlers.push (handler);
	}

	var params = {
		year: $scope.date.getFullYear(),
		month: $scope.date.getMonth() + 1,
		day: $scope.date.getDate()
	};

	$http.get ('issues/all', { params: params })
	.success (function (data) {
		var issue, handler;
		var array = [];

		for (var i in data) {
			issue = data[i];
			handler = $scope.map[issue.handler];
			
			if (handler === undefined) {
				continue;
			}

			for (var j in issue.notes) {
				if (issue.notes[j].date === $scope.date.toISOString ()) {
					issue.thisWeek = issue.notes[j];
				}
			}
			NoteService.formatNotes (issue.notes);

			if (issue.state === 'Done') {
				handler.states[0].issues.push (issue); // 해결
			}
			else if (issue.thisWeek !== undefined && issue.notes.length === 1) {
				handler.states[1].issues.push (issue); // 미해결
			}
			else {
				handler.states[2].issues.push (issue); // 장기수
			}
		}
	});

	$scope.expand = function (obj) {
		obj.expand = true;
	};

	$scope.shrink = function (obj) {
		obj.expand = false;
	};
});

wfApp.controller ('WikiCtrl', function ($rootScope, $scope, $http, $routeParams, $location, TeamService, NoteService) {

	$scope.teams = [];
	$scope.map = {};
	
	if ($routeParams.week === 't') {
		$scope.date = NoteService.toMonday (new Date ());
	}
	else {
		$scope.date = NoteService.toPrevMonday (new Date ());
	}
	$scope.quarter = Math.floor(($scope.date.getMonth() + 3) / 3);

	var params = {
		year: $scope.date.getFullYear(),
		month: $scope.date.getMonth() + 1,
		day: $scope.date.getDate()
	};
	
	var states = ['해결', '미해결', '장기수'];
	
	for (var i in TeamService.teams) {
		var team = TeamService.teams[i];
		var handlers = TeamService[team];
		$scope.teams[i] = { name: team, handlers: [] };

		for (var j in handlers) {
			var handler = { name: handlers[j], states: [], items: [], issueCount: 0 };
			$scope.map[handler.name] = handler;
			$scope.teams[i].handlers.push (handler);

			for (var k in states) {
				handler.states.push ({ state: states[k], issues: [] });
			}
		}
	}

	$http.get ('items/all', { params: params })
	.success (function (data) {
		var item, handler;

		for (var i in data) {
			item = data[i];

			for (var j in item.notes) {
				if (item.notes[j].date === $scope.date.toISOString ()) {
					item.thisWeek = item.notes[j];
				}
			}
			NoteService.formatNotes (item.notes);

			handler = $scope.map[item.handler];
			handler.items.push(item);
		}

		console.log ($scope.teams);
	});
	
	$http.get ('issues/all', { params: params })
	.success (function (data) {
		var issue, handler;
		var array = [];

		for (var i in data) {
			issue = data[i];
			handler = $scope.map[issue.handler];

			for (var j in issue.notes) {
				if (issue.notes[j].date === $scope.date.toISOString ()) {
					issue.thisWeek = issue.notes[j];
				}
			}
			NoteService.formatNotes (issue.notes);

			if (issue.state === 'Done') {
				handler.states[0].issues.push (issue); // 해결
			}
			else if (issue.thisWeek !== undefined && issue.notes.length === 1) {
				handler.states[1].issues.push (issue); // 미해결
			}
			else {
				handler.states[2].issues.push (issue); // 장기수
			}

			handler.issueCount += 1;
		}
		
		console.log ($scope.teams);
	});
});

wfApp.controller ('LoadWikiCtrl', function ($rootScope, $scope, $http, $routeParams, $location, NoteService) {

	$scope.date = null;
	$scope.issues = [];

	$scope.verify = function () {
		var lines = $scope.wikitext.split('\n');
		var i, line;
		var handler = "";
		var issues, issue;
		var title, number;

		issues = [];	

		for (i in lines) {
			line = lines[i];

			if (line === "" || /^-- /.test(line)) {
				continue;
			}
				
			if (/^== F/.test(line)) {
				break;
			}
				
			if (/^=== /.test(line)) {
				handler = line.replace(/=| /g, '');
				in_dev = false;
				continue;
			}

			line = line.replace(/\<\/*nowiki\>/ig, '');

			if (/^\* ims/i.test(line)) {
				number = line.replace(/^\* ims[ -]*/i, '').replace(/[\[ ].*/g, '').trim();
				title = line.substr(line.indexOf(number) + number.length).trim();
				issue = { handler: handler, number: number, name: title, notes: [] };
				issues.push (issue);
			}
			else if (/^\* \[.*\]\s*ims/i.test(line)) {
				number = line.replace(/^\* \[.*\]\s*ims[ -]*/i, '').replace(/[\[ ].*/g, '');
				title = line.substr(line.indexOf(number) + number.length).trim();
				issue = { handler: handler, number: number, name: title, notes: [] };
				issues.push (issue);
			}
			else if (issue !== undefined) {
				issue.notes.push (line.replace(/^\*\*/, '').trim());
			}
		}
		
		$scope.issues = [];

		for (i in issues) {
			issue = issues[i];
			if (!isNaN (parseInt (issue.number)) && issue.notes.length > 0) {
				$scope.issues.push (issue);
			}
		}
	};
	
	$scope.submit = function () {
		$http.put ('archive/add-week', { date: $scope.date, issues: $scope.issues })
			.then (function (res) {
				$location.url ('/archive/all');
			});
	};
});

wfApp.controller ('ArchiveAllCtrl', function ($rootScope, $scope, $http, $routeParams, $location, NoteService) {
	$http.get ('archive/all')
	.success (function (data) {
		$scope.data = data;
	});
});

wfApp.controller ('ArchiveSearchCtrl', function ($rootScope, $scope, $http, $routeParams, $location, NoteService) {
	$scope.data = [];

	$scope.search = function () {
		$http.get ('archive/search/' + $scope.query).success (function (data) {
			$scope.data = data;
		});
	};
});
