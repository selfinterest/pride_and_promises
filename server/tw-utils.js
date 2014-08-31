/**
 *
 * @param str
 * @param pattern
 */
exports.splitStringIntoObject = function(str){
	if(!pattern) throw new Error("Pattern is required");


	//var result = {};
	//Pattern: "/:name", splits on strings, assigns string to name property
	var splitStr = pattern.charAt(0);
	var stringParts = str.split(splitStr);

	if(stringParts.length == 1 && stringParts[0] == str){
		return null;
	}

	var patternParts = pattern.split(splitStr).slice(1);
	stringParts = stringParts.slice(1);

	//Make a JSON string!
	var json = "";
	var prevPattern;

	stringParts.forEach(function(stringPart, i){
		var patternPart;
		if(typeof patternParts[i] === "undefined") {
			patternPart = prevPattern;
		} else {
			patternPart = patternParts[i];
		}

		json += ' { "' + patternPart + '": "' + stringPart + '"';
		prevPattern = patternPart;
	});


	for(var x = 0; x < stringParts.length; x++){
		json += " } ";
	}

	try {
		return JSON.parse(json);
	} catch (e){
		console.log(json);
	}




};