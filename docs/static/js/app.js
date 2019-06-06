var app = angular.module('256', []);
app.controller('one', ['$rootScope', '$scope', '$http', '$timeout', one]);
app.controller('two', ['$rootScope', '$scope', '$http', '$timeout', two]);
app.filter('dataContent', ['$sce', dataContent]);
app.filter('colorize', ['$rootScope', colorize]);
app.filter('toFixed', ['$rootScope', toFixed]);

var chartOption = {};
                           
function dataContent ($sce) {
  return input => {
    var s = '';
    s += '<p>feature: ' + input.feature.toFixed(5) + '</p>';
    s += '<p>weight: ' + input.weights.toFixed(5) + '</p>';
    s += '<p>product: ' + input.product.toFixed(5) + '</p>';
    return s;
  };
}

function toFixed() {
  return input => {
    return parseFloat(input).toFixed(5);
  }
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

function addToken(rs, chart, token, config) {
    chart.data.labels.push(token.key);
    chart.data.datasets.forEach((dataset) => {
      dataset.backgroundColor.push('#' + rs.rainbow.colorAt(token.product));
      dataset.borderColor.push('#' + rs.rainbow.colorAt(token.product));
      dataset.data.push(token.product);  
    });
  
    console.log(chart.data.datasets[0]);
    chart.update(config);
}

function removeData(chart, config) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.backgroundColor.pop();
      dataset.borderColor.pop();
      dataset.data.pop();
    });
    chart.update(config);
}

function one($rootScope, $scope, $http, $timeout) {
  var rs = $rootScope;
  var sc = $scope;
  
  rs.rainbow = new Rainbow();
  rs.rainbow.setSpectrum('orangered', 'lawngreen');
  rs.rainbow.setNumberRange(-0.4,0.4);
  
  var ctx = document.getElementById('chart1').getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
          labels: [],
          datasets: [ {
              label: 'product',
              backgroundColor: [],
              borderColor: [],
              //borderColor: '#fd7e14',
              data: []
          }]
      },

      // Configuration options go here
      options: chartOption
  });
  
  sc.positive = {
    product: 0.4
  }
  sc.negative = {
    product: -0.4
  }
  
  sc.bias = {
    feature: 1.0,
    weights: 0.04065296,
    product: 0.04065296,
    key: 'bias'
  }
  
  sc.prediction = 0;
  
  sc.predictionToken = {
    key: 'prediction',
    product: sc.prediction
  }
  
  sc.confidence = 0;
  
  sc.updateChart = function (token) {
    if (chart.data.labels.length > 1) {
      removeData(chart, {
        duration: 0
      });
    }
    addToken(rs, chart, token, {
      duration: 0
    });
  }

  sc.change = function () {
    
    
    $http.get('http://54.201.134.0:5000/0/' + sc.sentence)
    
    .then(res => {
      var response = res.data;
      sc.uni = Object.keys(response[0]).map(key => Object.assign(response[0][key],{key:key}));
      sc.bi = Object.keys(response[1]).map(key => Object.assign(response[1][key],{key:key}));
      sc.tri = Object.keys(response[2]).map(key => Object.assign(response[2][key],{key:key}));

      sc.uni.sort(compare);
      sc.bi.sort(compare);
      sc.tri.sort(compare);
      
      sc.prediction = sc.bias.product;
      sc.confidence = 0;

      sc.uni.forEach(each => {
        sc.prediction += each.product;
        console.log(each);
      })

      sc.bi.forEach(each => {
        sc.prediction += each.product;
        console.log(each);
      })

      sc.tri.forEach(each => {
        sc.prediction += each.product;
        console.log(each);
      })
      
      sc.predictionToken.product = sc.prediction;
      removeData(chart, {});
      removeData(chart, {});
      addToken(rs, chart, sc.predictionToken, {});
      if (sc.uni.length > 0) {
        addToken(rs, chart, sc.uni[0]);
      }
      sc.confidence = (sc.prediction < 0) ? response[3][0] : response[3][1];
      
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

function two($rootScope, $scope, $http, $timeout) {
  var rs = $rootScope;
  var sc = $scope;
  
  rs.rainbow = new Rainbow();
  rs.rainbow.setSpectrum('orangered', 'lawngreen');
  rs.rainbow.setNumberRange(-0.4,0.4);
  
  var ctx = document.getElementById('chart2').getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
          labels: [],
          datasets: [ {
              label: 'product',
              backgroundColor: [],
              borderColor: [],
              //borderColor: '#fd7e14',
              data: []
          }]
      },

      // Configuration options go here
      options: chartOption
  });
  
  sc.positive = {
    product: 0.4
  }
  sc.negative = {
    product: -0.4
  }
  
  sc.bias = {
    feature: 1.0,
    weights: 0.46692793,
    product: 0.46692793,
    key: 'bias'
  }
  
  sc.prediction = 0;
  
  sc.predictionToken = {
    key: 'prediction',
    product: sc.prediction
  }
  
  sc.confidence = 0;
  
  sc.updateChart = function (token) {
    if (chart.data.labels.length > 1) {
      removeData(chart, {
        duration: 0
      });
    }
    addToken(rs, chart, token, {
      duration: 0
    });
  }

  sc.change = function () {
    
    
    $http.get('http://54.201.134.0:5000/1/' + sc.sentence)
    
    .then(res => {
      var response = res.data;
      sc.uni = Object.keys(response[0]).map(key => Object.assign(response[0][key],{key:key}));
      sc.bi = Object.keys(response[1]).map(key => Object.assign(response[1][key],{key:key}));
      sc.tri = Object.keys(response[2]).map(key => Object.assign(response[2][key],{key:key}));

      sc.uni.sort(compare);
      sc.bi.sort(compare);
      sc.tri.sort(compare);
      
      sc.prediction = sc.bias.product;
      sc.confidence = 0;

      sc.uni.forEach(each => {
        each.weights = - each.weights;
        each.product = - each.product;
        sc.prediction += each.product;
        console.log(each);
      })

      sc.bi.forEach(each => {
        each.weights = - each.weights;
        each.product = - each.product;
        sc.prediction += each.product;
        console.log(each);
      })

      sc.tri.forEach(each => {
        each.weights = - each.weights;
        each.product = - each.product;
        sc.prediction += each.product;
        console.log(each);
      })
      
      sc.predictionToken.product = sc.prediction;
      removeData(chart, {});
      removeData(chart, {});
      addToken(rs, chart, sc.predictionToken, {});
      if (sc.uni.length > 0) {
        addToken(rs, chart, sc.uni[0]);
      }
      sc.confidence = (sc.prediction < 0) ? response[3][0] : response[3][1];
      
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