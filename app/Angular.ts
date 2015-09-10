/// <reference path="./lodash.d.ts" />
/// <reference path="./Angular.d.ts" />

var Angular: Angular = {
	isArrayLike: function(obj: any): boolean {
		if(_.isNull(obj) || _.isUndefined(obj)) {
			return false;
		}
		var length = obj.length;
		return length === 0 ||
			(_.isNumber(length) && length > 0 && (length - 1) in obj); 
	}
};