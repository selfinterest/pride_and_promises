

/**
 * Created by twatson on 8/31/14.
 */
function LinkedList(item){
	this.items = [];
	if(item) {
		this.items.push(item);
	}
}

LinkedList.prototype.remove = function(){
	//Remove the item at the front of the list. Shift the list over.
	return this.items.shift();

};

LinkedList.prototype.add = function(item){
	this.items.push(item);


};

LinkedList.prototype.addAll = function(items){
	/*items.forEach(function(item){
	 this.add(item);
	 }.bind(this));*/
	this.items = this.items.concat(items);
};

LinkedList.prototype.isEmpty = function(){
	return this.items.length < 1;
};

module.exports = LinkedList;