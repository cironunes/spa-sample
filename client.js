;(function(window, document, undefined) {
	'use strict';

	var app = angular.module('rupy', ['ngRoute']);

	app.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				controller: 'AppCtrl',
				templateUrl: 'views/main.html'
			})
			.when('/item/:id', {
				controller: 'ItemCtrl',
				templateUrl: 'views/item.html'
			})
	});

	app.factory('Item', function($http, $q, $location) {
		var itemFactory = {
			edit: function(id, newItem) {
				$http.put('http://localhost:8080/item/' + id, newItem)
					.success(function() {
						$location.path('/');
					});
			},
			del: function(id) {
				$http.delete('http://localhost:8080/item/' + id)
					.success(function() {
						$location.path('/');
					});
			},
			add: function(item) {
				var deferred = $q.defer();
				$http.post('http://localhost:8080/items', item)
					.success(function(data) {
						deferred.resolve(data);
					});
				return deferred.promise;
			}
		};
		return itemFactory;
	});

	app.controller('AppCtrl', function($scope, $http, Item) {
		$http.get('http://localhost:8080/items')
			.success(function(data) {
				$scope.items = data;
			});

		$scope.addItem = function() {
			Item.add($scope.item).then(function(data) {
				$scope.items.push(data);
			});
		};
	});

	app.controller('ItemCtrl', function($scope, $http, $routeParams, Item) {
		$http.get('http://localhost:8080/item/' + $routeParams.id)
			.success(function(data) {
				$scope.item = data[0];
			});

		$scope.editItem = function(itemId) {
			Item.edit(itemId, $scope.item);
		};

		$scope.deleteItem = function(itemId) {
			Item.del(itemId);
		};
	});

}(window, document));