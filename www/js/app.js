// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('youper', ['ionic', 'youper.controllers', 'youper.directives', 'angularMoment'])

  .run(function ($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs).
      // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
      // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
      // useful especially with forms, though we would prefer giving the user a little more room
      // to interact with the app.

      // Initialize the Firebase SDK
      var config = {
        apiKey: "AIzaSyCauuN1VZ6mTVIR6Qz-op1wq6eu3Odv0oc",
        databaseURL: "https://youper-4f8a7.firebaseio.com",
        projectId: "youper-4f8a7"
      };
      firebase.initializeApp(config);
      // Initialize Cloud Firestore through Firebase
      var db = firebase.firestore();

      // Disable deprecated features
      db.settings({
        timestampsInSnapshots: true
      });

      $rootScope.firebaseDatabase = db;
      $rootScope.$broadcast('rootScope:broadcast', 'Broadcast');
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('dashboard', {
        url: '/dashboard',
        controller: 'DashboardCtrl',
        templateUrl: 'templates/dashboard.html'
      })

      .state('messages', {
        url: '/messages',
        controller: 'MessagesCtrl',
        templateUrl: 'templates/messages.html'
      });


    $urlRouterProvider.otherwise('/dashboard');
  });
