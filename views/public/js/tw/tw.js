/**
 * Created by twatson on 8/30/14.
 */

//$render is the result of a value passing from the model to the view.
//$setViewValue is the start of passing a value from the view to the model.

//	$modelValue -> $formatters -> $viewValue -> $render

// $modelValue <- $parsers <- $viewValue <- $setViewValue
angular.module("tw", ["tw.socket"])
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
			scope: true,
			template: template,
			link: function(scope, elm, attr){
				scope.title = attr.title || "title";
			}
		}
	}])
