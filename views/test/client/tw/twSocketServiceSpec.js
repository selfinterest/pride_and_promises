/**
 * Created by twatson on 8/30/14.
 */

/* jshint expr: true */ //for chai expect syntax

describe("tw socket service", function(){
	beforeEach(function(){
		module("tw");
	});

	it("should exist", inject(function(twSocketService){
		expect(twSocketService).to.not.be.undefined;
		expect(twSocketService.registry).to.not.be.undefined;
	}));

	it("should have a method to register with a socket by name", function(done){
		inject(function(twSocketService, $rootScope){
			twSocketService.registerWithSocket("test").then(function(v){
				expect(twSocketService.registry.test).to.not.be.undefined;
				done();
			});
			$rootScope.$apply();        //this flushes the promise queue
		});
	});
});

