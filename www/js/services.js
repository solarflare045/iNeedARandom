angular.module('starter.services', [])

.factory('SymbolGenerator', function() {
  return {
    generate: function(length) {
      var icons = [
        'ion-beer',
        'ion-bonfire',
        'ion-bug',
        'ion-cash',
        'ion-cloud',
        'ion-coffee',
        'ion-hammer',
        'ion-headphone',
        'ion-heart',
        'ion-nuclear',
        'ion-paintbrush',
        'ion-pizza',
        'ion-planet',
        'ion-trophy',
        'ion-umbrella'
      ];

      return _.shuffle(icons);
    }
  };
})

.factory('NumberGenerator', function($http, SymbolGenerator) {
  function downloadNumbers(length) {

  }

  function generateUniqueChain(length) {
    return $http.get('https://qrng.anu.edu.au/API/jsonI.php?type=uint16&length=' + length)
      .then(function(body) {
        return body.data.data;
      })
      .then(function(numbers) {
        return _.uniq(numbers);
      })
      .then(function(numbers) {
        if (numbers.length === length)
          return numbers;

        return generateUniqueChain(length);
      });
  }

  function generateGame(length, revealOne) {
    return generateUniqueChain(length)
      .then(function(numbers) {
        var sorted = _.sortBy(numbers, _.identity);
        var reveal = revealOne && sorted[_.random(1, numbers.length-2)];
        var symbols = SymbolGenerator.generate();
        var shuffled = _.shuffle(numbers);
        return _.map(shuffled, function(number, i) {
          return {
            value: number,
            display: _.padLeft(number, 5, '0'),
            revealed: reveal === number,
            selected: false,
            icon: (reveal === number) ? 'ion-android-sunny' : symbols[i]
          };
        });
      });
  }

  return {
    generate: generateGame
  };
});
