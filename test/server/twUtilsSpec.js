/**
 * Created by twatson on 8/30/14.
 */

var twUtils = require("../../server/tw-utils.js");

xdescribe("tw utilities", function(){
	describe("splitStringIntoObject", function(){
		it("if given a string without a pattern, should throw an error", function() {
			var fn = function(){
				twUtils.splitStringIntoObject("test");
			};

			expect(fn).to.throw();
		});

		xit("if given a string with a pattern, where the pattern does not match the string, should return null", function(){
			var result = twUtils.splitStringIntoObject("/test");
			expect(result).to.equal(null);
		});

		it("if given a string with a pattern, where the pattern does match, should return an object", function(){
			var result = twUtils.splitStringIntoObject("name:test/child:name");
			expect(result).to.be.an("object");
		});

		it("if given a string with a pattern, where the pattern matches, should return an object for that pattern", function(){
			var result = twUtils.splitStringIntoObject("/test", "/name");
			expect(result.name).to.not.be.undefined;
			expect(result.name).to.equal("test");
		});

		it("if given a string with multiple parts, should be able to return nested objects", function(){
			var result = twUtils.splitStringIntoObject("/terrence/watson", "/name:child");
			expect(result.name).to.equal("terrence");
			expect(result.name.name).to.equal("watson");
		});
	});
});