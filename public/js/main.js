/**
 * Created by twatson on 8/29/14.
 */
angular.module("BlockingDemo", ["tw"])
	.controller("PromisesController", ["$scope", function($scope){
		$scope.output = "test";
	}])
	.controller("NodesController", ["$scope", "socket", "twSocketManager", function($scope, socket, twSocketManager){
		function Node(nodeName){
			this.name = nodeName;
			this.socket = io("/"+nodeName);
			this.started = false;
		}

		var nodeSocket = twSocketManager.namespace("/nodes");
		$scope.nodes = {};

		nodeSocket.on("nodes", function(data){
			$scope.$apply(function(){
				var nodeNames = angular.fromJson(data);
				nodeNames.forEach(function(nodeName){
					$scope.nodes[nodeName] = new Node(nodeName);
					$scope.nodes[nodeName].socket.on("data", function(data){
						console.log("Started");
						$scope.$apply(function(){
							$scope.nodes[nodeName].started = true;
						});

					});

					$scope.nodes[nodeName].socket.on("error", function(error){
						console.log(error);
					});

					$scope.nodes[nodeName].socket.on("exit", function(){
						$scope.$apply(function(){
							$scope.nodes[nodeName].started = false;
						});

					});
				});
			})
		});


		/*socket.on("nodes", function(data){
			$scope.$apply(function(){

			});
		});*/

		$scope.startNode = function(node){
			console.log(node);
			$scope.nodes[node].socket.emit("start");
		}

		$scope.stopAll = function(){
			for(var node in $scope.nodes){
				if($scope.nodes.hasOwnProperty(node)){
					$scope.nodes[node].socket.emit("exit");
				}
			}
		}
	}]);

