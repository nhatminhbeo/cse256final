$('[data-toggle="tooltip"]').tooltip();
$('[data-toggle="popover"]').popover(); 

var app = angular.module('256', []);
app.controller('one', ['$rootScope', '$scope', '$http', one]);
app.filter('dataContent', () => {
  return input => {
    var s = '';
    s += 'feature: ' + input.feature.toFixed(5) + '</br>';
    s += 'weight: ' + input.weights.toFixed(5) + '</br>';
    s += 'product: ' + input.product.toFixed(5) + '</br>';
    return s;
  };
});

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

function one($rootScope, $scope, $http) {
  var rs = $rootScope;
  var sc = $scope;
//  sc.response = [{"it": {"weights": -0.43001681800408187, "product": -0.05741274168409996, "feature": 0.13351278201299321, "indices": [10]}, "is": {"weights": 1.2029821739914306, "product": 0.15474318702132825, "feature": 0.1286329842344202, "indices": [13]}, "know": {"weights": 0.3639997187504674, "product": 0.10172761282467072, "feature": 0.27947167974162096, "indices": [0]}, "what": {"weights": -0.6722016913107819, "product": -0.15791495420864624, "feature": 0.2349219828660573, "indices": [5]}}, {"it is": {"weights": 0.0526956301363738, "product": 0.014700263730233207, "feature": 0.2789655174857881, "indices": [10]}, "what it": {"weights": 0.2847384385030889, "product": 0.11861416007202659, "feature": 0.4165723486284408, "indices": [5]}, "know what": {"weights": 0.5149061642739029, "product": 0.19721249310378317, "feature": 0.38300666565505814, "indices": [0]}}, {"what it is": {"weights": 0.03493823513619062, "product": 0.015683818802268698, "feature": 0.44890128940779506, "indices": [5]}, "know what it": {"weights": 0.23852056806500857, "product": 0.11507829632496329, "feature": 0.48246697238117764, "indices": [0]}}]
   

  sc.change = function () {
    
    $http.get('https://cse256final.herokuapp.com/' + sc.sentence)
    
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
      console.log('popover');
      $('[data-toggle="tooltip"]').tooltip({container: 'body'});
      $('[data-toggle="popover"]').popover({container: 'body'}); 
    })
    
    .catch(console.log);
  }
  
}