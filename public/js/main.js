/**
 * Created by twatson on 8/29/14.
 */
angular.module("BlockingDemo", [])
	.controller("PromisesController", ["$scope", function($scope){
		$scope.output = "test";
	}])
	.directive("twPanel", [function(){
		return {
			restrict: "C",
			transclude: true,
			replace: false,
			scope: false,
			templateUrl: "/templates/panel",
			link: function(scope, elm, attr){
				scope.title = attr.title || "title";
			}
		}
	}])
	.directive("twSocket", [function(){
		return {
			restrict: "A",
			require: "ngModel",
			scope: false,
			priority: 99,
			/*controller: ["$scope", function($scope){
				console.log($scope);
				console.log(arguments);
				$scope.output = "BLAH";
			}],*/
			link: function(scope, element, attrs, ngModel){
				//This fires when something changes the external model from outside.
				ngModel.$render = function() {
					//This updates the directive's copy of the model
					scope.value = ngModel.$modelValue;

					//This updates the display (the text box).
					element.val(scope.value);
				};

				function read(){

					//This line updates the underlying model
					ngModel.$setViewValue(element.val() + "s");

					//This line updates the display (the text box) if needed.
					element.val(element.val() + 's');
				}

				read();

				element.on("blur keyup change", function(){

					scope.$apply(read);

				});

				//scope.$watch("value", function(){
				//	ngModel.$setViewValue(scope.value);
				//});

				/*element.on("blur keyup change", function(){
					element.val(ngModel.$viewValue);
					//scope.value = element[0].value + "s";
					//ngModel.$setViewValue(scope.value);
				});*/


				/*scope.$watch("value", function(){
					console.log(ngModel);
					ngModel.$setViewValue(scope.value);
				});*/

			}
		}
	}])