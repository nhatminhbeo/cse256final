var app = angular.module('256', []);
app.controller('one', ['$rootScope', '$scope', '$http', '$timeout', one]);
app.controller('two', ['$rootScope', '$scope', '$http', '$timeout', two]);
app.filter('dataContent', ['$sce', dataContent]);
app.filter('colorize', ['$rootScope', colorize]);
                           
function dataContent ($sce) {
  return input => {
    var s = '';
    s += '<p>feature: ' + input.feature.toFixed(5) + '</p>';
    s += '<p>weight: ' + input.weights.toFixed(5) + '</p>';
    s += '<p>product: ' + input.product.toFixed(5) + '</p>';
    return s;
  };
}

function colorize($rootScope) {
  return input => {
    return $rootScope.rainbow.colourAt(input.product);
  }; 
}
function count(str) { 
  return str.split(" ").length;
}

function compare( a, b ) {
  if ( a.indices[0] < b.indices[0]){
    return -1;
  }
  if ( a.indices[0] > b.indices[0] ){
    return 1;
  }
  return 0;
}

function one($rootScope, $scope, $http, $timeout) {
  var rs = $rootScope;
  var sc = $scope;
  
  rs.rainbow = new Rainbow();
  rs.rainbow.setSpectrum('orangered', 'lawngreen');
  rs.rainbow.setNumberRange(-0.4,0.4);

  sc.change = function () {
    
    $http.get('localhost:5000/1/' + sc.sentence)
    
    .then(res => {
      var response = res.data;
      sc.uni = Object.keys(response[0]).map(key => Object.assign(response[0][key],{key:key}));
      sc.bi = Object.keys(response[1]).map(key => Object.assign(response[1][key],{key:key}));
      sc.tri = Object.keys(response[2]).map(key => Object.assign(response[2][key],{key:key}));

      sc.uni.sort(compare);
      sc.bi.sort(compare);
      sc.tri.sort(compare);

      sc.uni.forEach(each => {
        console.log(each);
      })

      sc.bi.forEach(each => {
        console.log(each);
      })

      sc.tri.forEach(each => {
        console.log(each);
      })
      
      return () => new Promise((resolve, reject) => resolve);
    })
    
    
    .then(() => {
      $timeout(function(){
        $('[data-toggle="tooltip"]').tooltip('hide');
        $('[data-toggle="popover"]').popover('hide'); 
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover(); 
      })
    })
        
    .catch(console.log);
    
  }
  
}