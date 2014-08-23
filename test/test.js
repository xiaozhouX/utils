define('test', ['utils'], function (_) {
	// var a = [1,2,3,4],
	// 	array = _.Array,
	// 	map = array.map(a, function(value) {
	// 		return value * 3;
	// 	}),
	// 	each = array.each(a, function(value) {
	// 		return value *3;
	// 	}),
	// 	reduce = array.reduce(a, function(memo, value) {
	// 		memo.push(value*5);
	// 		return memo;
	// 	}, []),
	// 	reduce1 = array.reduce(a, function(memo, value) {
	// 		return value + memo;
	// 	}),
	// 	value = array.pairs(a);
	// 	console.log(value);

/*	var testArrayData = (function(length){
		var i = 0,
			arrayData = [];
		for(; i < length; i++){
			arrayData[i] = i;
		}
		return arrayData;
	})(100),
	loop = function (fn, times) {
		var context = context || this,
			time = 0,
			i, now, then;
		for(i = 0; i < times; i++) {
			now = new Date();
			fn();
			then = new Date();
			time = time + (then - now);
		}
		return time / times;
	},
	valueFn = function() {
		results = array.reduce(testArrayData, function(memo, value) {
			memo.push(value*5);
			return memo;
		}, []);
	},
	array = _.Array,
	results, time;*/

	// time = loop(valueFn, 10);
	// console.log(time);

	var obj = {name:"xxz", age:12},
		ext = {name:"al", address:"WH"};
	var result = _.extend(obj, ext);
	console.log(result);
	console.log(obj);
});

var test = require('test');