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
			this.test = {
				number: 8,
				connections: 100,
				concurrency: 5,
				data: "",
				started: false
			}
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

					$scope.nodes[nodeName].socket.on("test_data", function(data){

						if(data.node == nodeName){
							$scope.$apply(function(){
								$scope.nodes[nodeName].test.started = true;
								$scope.nodes[nodeName].test.data += data.data;
							});

						}
					});

					$scope.nodes[nodeName].socket.on("test_exit", function(data){
						if(data.node == nodeName){
							$scope.$apply(function(){
								$scope.nodes[nodeName].test.started = false;
							});

						}
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
		};

		$scope.stopAll = function(){
			for(var node in $scope.nodes){
				if($scope.nodes.hasOwnProperty(node)){
					$scope.nodes[node].socket.emit("exit");
				}
			}
		};

		$scope.startTest = function(nodeName, number, connections, concurrency){
			console.log($scope.nodes[nodeName]);
			if(arguments.length == 1){
				$scope.nodes[nodeName].socket
					.emit("test", {connections: $scope.nodes[nodeName].test.connections, concurrency: $scope.nodes[nodeName].test.concurrency, number: $scope.nodes[nodeName].test.number});
			} else {
				$scope.nodes[nodeName].socket
					.emit("test", {connections: connections, number: number, concurrency: concurrency});
			}

		};

		$scope.allNumber = 8;
		$scope.allConnections = 100;
		$scope.allConcurrency = 5;

		$scope.runAll = function(){
			console.log("Starting all tests");
			for(var node in $scope.nodes){
				if($scope.nodes.hasOwnProperty(node)){
					if($scope.nodes[node].started){

						$scope.startTest(node, $scope.allNumber, $scope.allConnections, $scope.allConcurrency)
					}
				}

			}
		}

		$scope.stopAll();
	}]);

