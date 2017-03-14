
angular.module('weatherApp', []);

// Use '{[' and ']}' to interpolate with angular, because '{{' and '}}' clashes
// with Jinja templating.
angular.module('weatherApp').config(function($interpolateProvider){
	$interpolateProvider.startSymbol('{[').endSymbol(']}');
});

angular.module('weatherApp').factory('dataFactory', function($http, $q, $rootScope){
	var factory = {};

	factory.getWOEID = function(zipcode, units){
		var query = "select woeid from geo.places where text='" + zipcode + "' limit 1";
		return $http.get('http://query.yahooapis.com/v1/public/yql?format=json&q=' + query);
	};

	factory.getData = function(zipcode, units){
		var deferred = $q.defer();

		factory.getWOEID(zipcode, units).success(function(data){
			if (!data.query.results){
				alert('Could not find zipcode through Yahoo Weather API. Please make sure you have a valid zipcode and try again.');
			}
			else{
				var woeid = data.query.results.place.woeid;
				var query = "select * from weather.forecast where woeid=" + woeid;
				// string = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D%20' + woeid + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
				$http.get('https://query.yahooapis.com/v1/public/yql?format=json&q=' + query).then(function successCallback(response){
					factory.data = response.data.query.results.channel;
					deferred.resolve();
					$rootScope.$broadcast('dataLoaded');
					console.log(response.data.query.results.channel);
				}, function errorCallback(error){
					deferred.reject(error);
				});
			}
		}).error(function(error){
			alert(error);
		});
		
		return deferred.promise;
	};
	
	return factory;
});

angular.module('weatherApp').factory('weatherIcons', function(){
	data = {
		0: 'tornado',
		1: 'day-storm-showers',
		2: 'hurricane',
		3: 'thunderstorm',
		4: 'thunderstorm',
		5: 'rain-mix',
		6: 'rain-mix',
		7: 'rain-mix',
		8: 'hail',
		9: 'showers',
		10: 'hail',
		11: 'showers',
		12: 'showers',
		13: 'snow',
		14: 'day-snow',
		15: 'snow-wind',
		16: 'snow',
		17: 'hail',
		18: 'rain-mix',
		19: 'dust',
		20: 'fog',
		21: 'windy',
		22: 'smoke',
		23: 'strong-wind',
		24: 'strong-wind',
		25: 'snowflake-cold',
		26: 'cloudy',
		27: 'night-cloudy',
		28: 'day-cloudy',
		29: 'night-cloudy',
		30: 'day-cloudy',
		31: 'night-clear',
		32: 'day-sunny',
		33: 'night-partly-cloudy',
		34: 'day-sunny-overcast',
		35: 'rain-mix',
		36: 'hot',
		37: 'day-storm-showers',
		38: 'day-storm-showers',
		39: 'day-storm-showers',
		40: 'showers',
		41: 'snow-wind',
		42: 'snow',
		43: 'snow-wind',
		44: 'day-sunny-overcast',
		45: 'day-storm-showers',
		46: 'snow',
		47: 'day-storm-showers',
		3200: 'stars'
	};
	return data;
});

angular.module('weatherApp').controller('currentConditionsCtrl', function($scope, dataFactory, $rootScope){
	$scope.zipcode = '10001';
	$scope.images = {};
	$scope.showDetails = false;
	$scope.units = 'f';

	// Use function to get data from factory for asynchronous loading of data into scope
	$scope.data = function(){
		return dataFactory.data;
	};

	$scope.$on('unitsUpdated', function(units){
		console.log('hello', units);
		$scope.units = units;
	});

	function formatDates(){
		$scope.data().item.pubTime = moment($scope.data().item.pubDate, 'ddd, DD MMM YYYY hh:mm a zz');
	}

	function initData(zipcode, units){
		promise = dataFactory.getData(zipcode, units);
		promise.then(function(){

		}, function(error){
			alert(error);
		});
	}

	$scope.$on('dataLoaded', function(){
		formatDates();
	});

	initData($scope.zipcode, $scope.units);
});

angular.module('weatherApp').directive('weatherCcTitle', function(){
	return {
		restrict: 'A',
		scope: {
			time: '='
		},
		template: '<h3>Current Conditions</h3><p>{[time.format("MMM Do, h:mm a zz")]}</p>'
	};
});

angular.module('weatherApp').directive('weatherCcDescription', function(weatherIcons, $timeout){
	return {
		restrict: 'A',
		scope: {
			conditionCode: '=',
			description: '='
		},
		link: function(scope){
			scope.$on('dataLoaded', function(){
				// Need to use timeout because scope for the directive is not yet updated
				$timeout(function(){
					scope.iconName = 'wi-' + weatherIcons[scope.conditionCode];
				});
				
			});
		},
		templateUrl: '/static/templates/weather-cc-description.html'
	};
});

angular.module('weatherApp').directive('weatherCcLocation', function(){
	return {
		restrict: 'A',
		scope: {
			location: '='
		},
		templateUrl: '/static/templates/weather-cc-location.html'
	};
});

angular.module('weatherApp').directive('weatherCcTemp', function($timeout){
	return {
		restrict: 'A',
		scope: {
			text: '@',
			temp: '=',
			units: '='
		},
		link: function(scope){
			scope.small = (scope.text === 'High' || scope.text === 'Low');
		},
		templateUrl: '/static/templates/weather-cc-temperature.html'
	};
});

angular.module('weatherApp').directive('weatherCcDetails', function($timeout){
	return {
		restrict: 'A',
		scope: {
			data: '='
		},
		templateUrl: '/static/templates/weather-cc-details.html'
	};
});

angular.module('weatherApp').directive('inputZipcode', function(dataFactory){
	return {
		restrict: 'A',
		link: function(scope){
			scope.submitZipcode = function(zipcode){
				dataFactory.getData(zipcode, scope.units);
			};
		},
		templateUrl: '/static/templates/weather-cc-zipcode-input.html'
	};
});

angular.module('weatherApp').directive('inputHeatUnits', function(dataFactory){
	return {
		restrict: 'A',
		scope: {
			units: '='
		},
		link: function(scope){
			scope.$broadcast('unitsUpdated', scope.units);
			scope.updateUnits = function(units){
				scope.$broadcast('unitsUpdated', units);
			};
		},
		templateUrl: '/static/templates/weather-cc-units-input.html'
	};
});

angular.module('weatherApp').directive('forecastChart', function($timeout){
	return{
		restrict: 'A',
		scope: {
			data: '=',
			units: '='
		},
		link: function(scope){
			var data;

			scope.$on('dataLoaded', function(){
				$timeout(function(){
					initChart();	
				});
			});

			function getDatesFromData(){
				var datesList = [];
				_.forEach(data, function(d){
					datesList.push(d.date.format('ddd MMM DD'));
				});
				return datesList;
			}

			function getTempUnit(){
				if (scope.units.temperature === 'F'){
					return '°F';
				}
				else {
					return '°C';
				}
			}

			function getChartData(){
				var chartData = [
					{name:'High', data:[], color:'#AA3C39'},
					{name:'Low', data:[], color:'#9575AB'}
				];
				_.forEach(data, function(d){
					var dPoint = d;
					dPoint.y = parseInt(d.low);
					chartData[0].data.push(parseInt(d.high));
					chartData[1].data.push(dPoint);
				});
				return chartData;
			}


			function initChart(){

				// convert all dates in data to date objects and limit forecast to 7 days
				data = _.slice(scope.data, 0, 7);
				_.map(data, function(d){
					d.date = moment(d.date, 'DD MMM YYYY');
					return d;
				});

				Highcharts.chart('forecast-chart', {
					chart:{
						borderWidth: 2,
						borderColor: '#0C1F45',
						type: 'line'
					},
					title: {
						text: '7 Day Forecast',
					},
					xAxis: {
						title: {
							text: 'Date',
							x: -20,
							style: {
								fontSize: '15px'
							}
						},
						categories: getDatesFromData()
					},
					yAxis: {
						title: {
							text: 'Temperature (' + getTempUnit() + ')'
						},
						plotLines: [{
			                value: 0,
			                width: 1,
			                color: '#808080'
			            }]
					},
					tooltip: {
						shared: true,
						crosshairs: true,
						pointFormatter: function(){
							var html = '<span style="color:' + this.color + '">\u25CF</span> ';
							html +=  this.series.name + ': <b>' + this.y + ' ' + getTempUnit() + '</b>.<br/>';
							if (this.text){
								html += 'Weather: <b>' + this.text + '</b><br/>';
							}

							return html;
						}
					},
					series: getChartData()
				});
			}
		},
		template: '<div id="forecast-chart" class="col-md-8 col-md-offset-2 top-buffer bottom-buffer no-padding" style="height: 400px;"></div>'
		
	};
});

// Need this because the returned value for sunrise and sunset can be weird sometimes from the Yahoo API.
// Sometimes it is missing the second digit in the display for the time (E.G. Sunset = '7:1 pm' instead of '7:10 pm')
angular.module('weatherApp').filter('displaySunRiseSet', function(){
	return function(timeStr) {
		var returnStr = timeStr;
		if (timeStr){
			var count = 0;
			var afterColon = false;
			var needsInsert = false;
			for (var i = 0; i < timeStr.length; i++){
				if (afterColon){
					count++;
					if (count == 2){
						if (timeStr[i] === ' '){
							returnStr = timeStr.slice(0, i) + "0" + timeStr.slice(i, timeStr.length);
						}
						break;
					}
				}
				if (timeStr[i] === ":"){
					afterColon = true;
				}
			}	
		}
		return returnStr;
	};
});

// angular.module('weatherApp').directive('weatherPanel', function(self){
// 	self.html = ""
// });