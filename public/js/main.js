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
				ngModel.$render = function() {
					console.log("Render");
					//scope.value = ngModel.$viewValue;
					scope.value = ngModel.$modelValue;
					//element.val(ngModel.$viewValue);
										//console.log(arguments);
					//scope.value = ngModel.$modelValue;
					//console.log(scope);
				};

				function read(){
					console.log("Read");
					//console.log(ngModel);
					ngModel.$setViewValue(element.val() + "s");
					element.val(element.val() + 's');
				}

				read();

				element.on("blur keyup change", function(){
					console.log("Event");
					//element.val(element.val() + 's');
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