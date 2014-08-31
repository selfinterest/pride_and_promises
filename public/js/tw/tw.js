/**
 * Created by twatson on 8/30/14.
 */

angular.module("tw", [])
	.directive("twPanel", [function(){
		//Could hold this in a separate file, but why?
		var template = '<div class="panel panel-primary">'+
		'<div class="panel-heading">'+
			'<h2 class="panel-title">{{title}}</h2>'+
			'</div>'+
		'<div ng-transclude class="panel-body"></div>'+
		'</div>';
		return {
			restrict: "C",
			transclude: true,
			replace: false,
			scope: true,
			template: template,
			link: function(scope, elm, attr){
				scope.title = attr.title || "title";
			}
		}
	}])
	.service('twSocketService', ["$q", function($q){
		this.registry = {};

		this.registerWithSocket = function(socketName){
			this.registry[socketName] = {};
			return $q.when(true);
		}
	}])
	.directive("twSocket", ["twSocketService", function(socketService){
		return {
			restrict: "A",
			require: "ngModel",
			scope: false,
			priority: 5,
			link: function(scope, element, attrs, ngModel){
				//This fires when something changes the external model from outside.
				ngModel.$render = function() {
					//This updates the directive's copy of the model, held in scope
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

			}
		}
	}])