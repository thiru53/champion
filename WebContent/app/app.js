'use strict';

var app = angular.module('quizApp', ['ngRoute', 'ngSanitize'])
// Routing has been added to keep flexibility in mind. This will be used in future.
angular.module('quizApp')
.config(['$routeProvider',
  function ($routeProvider) {

      var routes = [
          {
              url: '/home',
              template: 'templates/quiz.html',
              controller: 'quizCtrl'
          },
          {
              url: '/quiz',
              template: 'templates/quiz.html',
              controller: 'quizCtrl'
          },          
          {
              url: '/about',
              template: 'templates/about.html',
              controller: 'quizCtrl'
          },    
          {
              url: '/contact',
              template: 'templates/contact.html',
              
          },          
          {
              url: '/review',
              template: 'templates/review.html',
              controller: 'reviewCtrl'
          },
          {
              url: '/result',
              template: 'templates/result.html',
              controller: 'resultCtrl'
          },
          {
              url: '/create',
              template: 'templates/create.html',
              controller: 'createCtrl'
          }
      ];

      routes.forEach(function (r, index) {
          $routeProvider.when(r.url, { templateUrl: r.template, controller: r.controller });
      });

      $routeProvider.otherwise({ redirectTo: '/home' });
  }]);
