/**
 * Created by twatson on 9/7/14.
 */

angular.module("tw.socket", [])
	.factory("socket", function(){
		return io("http://localhost");
	})
	.service("twSocketManager", ["socket", "$rootScope", function(socket, $rootScope){
		this.namespaces = {};
		this.namespace = function(namespace){
			if(!this.namespaces[namespace]) {
				this.namespaces[namespace] = io(namespace);
				this.namespaces[namespace].on("connection", function(socket){
					$rootScope.$broadcast("namespace "+namespace, socket);
				})
			}
			return this.namespaces[namespace];
		}
	}])
	.service('twSocketService', ["$q", "socket", function($q, socket){
		this.registry = {};
		socket.on("error", function(error){
			console.log(error);
			this.error = error;
		});
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
					//scope.value = ngModel.$modelValue;

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
