/**
 * Created by twatson on 8/31/14.
 */
var LinkedList = require("./LinkedList.js");

function TreeNode(parent, name){
	if(this instanceof TreeNode){
		this.parent = parent;
		this.children = null;
		this.name = name;
		if(this.parent instanceof TreeNode){
			if(this.parent.children == null) this.parent.children = {};
			this.parent.children[name] = this;
		}
	} else {
		return new TreeNode(arguments);
	}

}


TreeNode.prototype.findChildren = function(){
	//var map = {};
	//var result = [];
	//if(!this.children) return result;
	//if(depth == 0) return result;


	if(!this.children) return [];
	var result = [];

	for(childName in this.children){
		result.push(this.children[childName]);
		if(this.children[childName].children){
			result = result.concat(this.children[childName].findChildren());
		}
	}


	return result;


	//var queue = new LinkedList();
	//queue.add(this);






		/*if(treeNode.children){
			for(var child in treeNode.children){
				var childNode = treeNode.children[child];
				if(childNode){
					var children = childNode.findChildren();
					result = result.concat(children);
					queue.addAll(children);
				}

				//result.push(treeNode.children[child]);
			}
		}

		//var key = mindTapNode.getHenleyNodeName();
		//if(mindTapNode.children){
		//mindTapNode.children.forEach(function(child, index){
		//	mindTapNode.children[index] = new MindtapNode(child);
		//});
		//}


		//if(key){
		//	map[key] = mindTapNode;
		//}

	}

	return result;


	/*function getChildrenKeys(node){
		if(node.children != null ){
			return Object.keys(node.children);
		} else {
			return [];
		}

	}*/



	/*if(depth === 0) {
		return null;
	}

	var children = [];

	for(var x = depth; x >= 0; x--){
		var depth = this.findToDepth(x);
		if(depth !== null){
			children = children.concat(depth);
		}
	}

	return children;*/


}
module.exports = TreeNode;