/**
 * Created by twatson on 8/30/14.
 */
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;