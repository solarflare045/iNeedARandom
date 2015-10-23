angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, NumberGenerator) {
  $scope.newGame = {
    players: 3,
    revealOne: false
  };

  $scope.generating = false;
  $scope.generate = function() {
    $scope.numbers = [];
    $scope.generating = true;
    return NumberGenerator.generate($scope.players + 1, $scope.newGame.revealOne)
      .then(function(numbers) {
        $scope.numbers = numbers;
      })
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.generating = false;
      });
  };

  $scope.restart = function() {
    $scope.players = $scope.newGame.players;
    return $scope.generate();
  };
  $scope.restart();

  $scope.countSelected = function() {
    return _.filter($scope.numbers, function(num) {
      return num.selected;
    }).length;
  };

  $scope.reveal = function(number) {
    if ($scope.countSelected() >= $scope.players)
      return;

    number.revealed = true;
    number.selected = true;

    if ($scope.countSelected() >= $scope.players) {
      var selected = _.chain($scope.numbers)
        .filter(function(num) {
          return num.selected;
        })
        .sortBy(function(num) {
          return num.value;
        })
        .value();

      _.each($scope.numbers, function(num) {
        if (!num.selected) {
          num.revealed = true;
          return;
        }

        num.loser = num.value == _.first(selected).value;
        num.winner = num.value == _.last(selected).value;
        num.others = !(num.loser || num.winner);
      });
    }
  };
});
