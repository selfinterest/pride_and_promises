/**
 * Created by twatson on 8/31/14.
 */


describe("TreeNode", function(){
	var TreeNode;
	beforeEach(function(){
		TreeNode = require("../../../server/class/TreeNode.js");
	});

	it("should be able to create a root node", function(){
		var rootNode = new TreeNode(null, "root");

		expect(rootNode.name).to.equal("root");
		expect(rootNode.parent).to.equal(null);
		expect(rootNode.children).to.equal(null);
	});

	describe("child nodes", function(){
		var rootNode;
		beforeEach(function(){
			rootNode = new TreeNode(null, "root");
		});

		it("should be able to create a child node, and traverse from the root node to the child", function(){
			var childNode = new TreeNode(rootNode, "child");
			expect(rootNode.children.child).to.not.be.undefined;
			expect(rootNode.children.child.name).to.equal("child");
			expect(childNode.parent).to.equal(rootNode);
			expect(childNode).to.equal(rootNode.children.child);

		});
	});

	describe("findChildren method", function(){
		var rootNode, childNode, grandchildNode, grandchildNode2;

		beforeEach(function(){
			rootNode = new TreeNode(null, "root");
			childNode = new TreeNode(rootNode, "child");
			grandchildNode = new TreeNode(childNode, "grandchild");
			grandchildNode2 = new TreeNode(childNode, "grandchild2");
		});

		it("should have a way to get from the root node to the grandchild node", function(){
			var children = rootNode.findChildren();
			expect(children.length).to.equal(3);
			children = childNode.findChildren();
			expect(children.length).to.equal(2);
			//var grandChildren = childNode.findToDepth(1);
			//dump(grandChildren);

		});
	});
});