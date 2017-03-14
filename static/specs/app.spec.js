// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('Data factory', function() {
	var factory;

	// // Before each test load our api.users module
	beforeEach(angular.mock.module('weatherApp'));

	// Before each test set our injected Users factory (_Users_) to our local Users variable
	var CurrentConditionsCtrl, scope;

	beforeEach(inject(function($rootScope, $controller){
		scope = $rootScope.$new();
		CurrentConditionsCtrl = $controller('currentConditionsCtrl', {
			$scope: scope
		});
	}));
	

	it('should pass', function() {
		expect(2+2).toEqual(4);
	});

});