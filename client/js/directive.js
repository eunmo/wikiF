wfApp.directive('navi', function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/navi.html'
	};
});

wfApp.directive('archive', function () {
	return {
		restrict: 'E',
		scope: { data: '=' },
		controller: ['$scope', '$http', function ArchiveCtrl ($scope, $http) {
			var handlerSet = new Set ();
			var weekSet = new Set ();
			$scope.archives = [];

			$scope.updateData = function () {
				var issue;
				var hSet = new Set ();
				var dSet = new Set ();
				var handlers;
				var i, j;
				var data = $scope.data;
				
				for (i in data) {
					issue = data[i];
					issue.number = parseInt(issue._id);
					handlers = new Set ();

					for (j in issue.note) {
						hSet.add (issue.note[j].author);
						handlers.add (issue.note[j].author);
						dSet.add (issue.note[j].week);
					}

					issue.handlers = Array.from(handlers).sort();
				}

				$scope.archives = data;
				$scope.handlers = [];

				var array = Array.from(hSet).sort();
				for (i in array) {
					$scope.handlers.push ({ name: array[i], active: false });
				}
				handlerSet = new Set ();

				$scope.weeks = [];
				array = Array.from (dSet).sort ();
				for (i in array) {
					$scope.weeks.push ({ date: array[i], active: false });
				}
				weekSet = new Set ();
			}

			$scope.updateData ();

			$scope.expand = function (obj) {
				obj.expand = true;
			};

			$scope.shrink = function (obj) {
				obj.expand = false;
			};

			$scope.toggleHandler = function (handler) {
				if (handler.active) {
					handlerSet.delete (handler.name);
				}
				else {
					handlerSet.add (handler.name);
				}
				handler.active = !handler.active;
			};

			$scope.clearHandlerButtons = function () {
				var i, handler;

				for (i in $scope.handlers) {
					handler = $scope.handlers[i];
					if (handler.active) {
						$scope.toggleHandler (handler);
					}
				}
			}

			$scope.toggleWeek = function (week) {
				if (week.active) {
					weekSet.delete (week.date);
				}
				else {
					weekSet.add (week.date);
				}
				week.active = !week.active;
			};

			$scope.clearWeekButtons = function () {
				var i, week;

				for (i in $scope.weeks) {
					week = $scope.weeks[i];
					if (week.active) {
						$scope.toggleWeek (week);
					}
				}
			}

			$scope.filter = function (issue) {
				var i;

				if (handlerSet.size === 0 && weekSet.size === 0)
					return true;

				if (handlerSet.size > 0) {
					for (i in issue.handlers) {
						if (handlerSet.has (issue.handlers[i]))
							return true;
					}
				}

				if (weekSet.size > 0) {
					for (i in issue.note) {
						if (weekSet.has (issue.note[i].week))
							return true;
					}
				}

				return false;
			};
		}],
		link: function (scope, el, attrs) {
			scope.$watch(attrs.data, function (data) {
				scope.updateData();
			}, true);
		},
		templateUrl: 'partials/directive-archives.html'
	};
});
