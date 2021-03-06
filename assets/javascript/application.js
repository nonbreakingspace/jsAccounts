// Use strict mode: http://www.nczonline.net/blog/2012/03/13/its-time-to-start-using-javascript-strict-mode/
'use strict';

var angular;

angular
    .module('accountApplication', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        // use the HTML5 History API
        $locationProvider.html5Mode( true );

        $routeProvider
            .when('/', {
                templateUrl: 'assets/templates/lists.html',
                controller: ListCtrl
            })
            .when('/add-user', {
                templateUrl: 'assets/templates/add-new.html',
                controller: AddCtrl
            })
            .when('/edit/:id', {
                templateUrl: 'assets/templates/edit.html',
                controller: EditCtrl
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

function ListCtrl($scope, $http) {
    $http.get('api/users').success(function(data) {
        $scope.users = data;
    });
}

function AddCtrl($scope, $http, $location) {
    $scope.master = {};
    $scope.activePath = null;

    $scope.add_new = function(user, AddNewForm) {
        $http.post('api/add_user', user).success(function(){
            $scope.reset();
            $scope.activePath = $location.path('/');
        });

        $scope.reset = function() {
            $scope.user = angular.copy($scope.master);
        };

        $scope.reset();
    };
}

function EditCtrl($scope, $http, $location, $routeParams) {
    var id = $routeParams.id;
    $scope.activePath = null;

    $http
        .get('api/users/'+id)
        .success(function(data) {
            $scope.users = data;
        });

    $scope.update = function(user){
        $http
            .put('api/users/'+id, user)
            .success(function(data) {
                $scope.users = data;
                $scope.activePath = $location.path('/');
            });
    };

    $scope.delete = function(user) {
        console.log(user);

        var deleteUser = confirm('Are you absolutely sure you want to delete?');
        if (deleteUser) {
            $http.delete('api/users/'+user.id);
            $scope.activePath = $location.path('/');
        }
    };
}