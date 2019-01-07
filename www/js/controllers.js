angular.module('youper.controllers', [])


  /**
   * Dashboard Controller
   */
  .controller('DashboardCtrl', function ($scope, $ionicModal, $timeout, $rootScope, $state) {

    /**
     * Controller variables
     */
    $scope.avatarImage = '';
    $scope.new_notification = false;
    $scope.animateIcon = false;
    let ignoreFirstChange = false,
      animateForSecs = 2000;

    /**
     * Once firebase is loaded
     */
    $scope.$on('rootScope:broadcast', function (event, data) {

      /**
       * Firebase snapshot listener for document changes
       * On document added or modified, we'll animate notification
       * icon & show badge too.
       */
      $rootScope.firebaseDatabase.collection("messages")
        .onSnapshot(function (querySnapshot) {
          let newAddedOrModified = false;
          querySnapshot.docChanges()
            .forEach(function (change) {
              if (change.type === "added" || change.type == 'modified') {
                newAddedOrModified = true;
              }
            });
          if (!ignoreFirstChange)
            ignoreFirstChange = true;
          else {
            if (newAddedOrModified) {
              $scope.new_notification = true;
              $scope.animateIcon = true;
              $timeout(() => {
                $scope.animateIcon = false;
              }, animateForSecs);
              $scope.$digest();
            }
          }
        });
    });

    /**
     * Page Enter event
     */
    $scope.$on('$ionicView.enter', function (e) {});

    // Open 
    $scope.openMessages = function () {
      $state.go('messages');
      $scope.new_notification = false;
    }

    // Change Image from local gallery
    $scope.changeImage = function () {
      window.imagePicker.getPictures(
        function (results) {
          if (results && results.length > 0)
            $scope.avatarImage = results[0];
          $scope.$digest();
        },
        function (error) {}, {
          maximumImagesCount: 1
        }
      );
    }

  })

  /**
   * Messages Controller
   */
  .controller('MessagesCtrl', function ($scope, $ionicHistory, $rootScope) {

    /**
     * Controller variables
     */
    $scope.notificationData = [];
    $scope.loading = true;
    $scope.expandId;


    /**
     * Load latest messages
     */
    $rootScope.firebaseDatabase.collection("messages")
      .onSnapshot(function (querySnapshot) {
        $scope.notificationData = [];
        let seenMessages = localStorage.getItem('seenMessages'),
          seenMessagesArray = [];
        if (seenMessages)
          seenMessagesArray = seenMessages.split(',');
        querySnapshot.forEach(function (doc) {
          let docData = doc.data();
          docData['id'] = doc.id;
          if (seenMessagesArray.indexOf(doc.id) < 0)
            docData['seen'] = false;
          else
            docData['seen'] = true;
          $scope.notificationData.push(docData);
        });
        console.log($scope.notificationData)
        $scope.loading = false;
      });

    // Go back to dashboard
    $scope.back = function () {
      $ionicHistory.goBack(-1);
    }

    // Callback to directive once image is loadeds
    $scope.onImgLoad = function (notification) {
      notification.imageLoaded = true;
    }

    // Toggle message detail
    $scope.messageDetail = function (notification) {
      $scope.expandId = notification.id;
      let seenMessages = localStorage.getItem('seenMessages'),
        seenMessagesArray = [];
      if (seenMessages) {
        seenMessagesArray = seenMessages.split(',');
        if (seenMessagesArray.indexOf(notification.id) < 0)
          seenMessagesArray.push(notification.id);
      } else {
        seenMessagesArray.push(notification.id);
      }
      localStorage.setItem('seenMessages', seenMessagesArray.join());
      notification.seen = true;
    }

    // Unexpand the message detail
    $scope.unExpand = function (event) {
      event.stopPropagation();
      $scope.expandId = '';
    }

  });
