/**
 * Created by twatson on 8/30/14.
 */
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var inspect = require("util").inspect;
chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

global.dump = function(something){
	console.log(inspect(something));
}