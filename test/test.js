define('test', ['utils', 'event/delegate'], function(_, Delegate) {
  // var a = [1,2,3,4],
  // 	test2 = {name:'allen', age:22},
  // 	b = [],
  // 	map = _.map(test2, function(value) {
  // 		return value + '2';
  // 	}),
  // 	each = _.each(a, function(value, key) {
  // 		b[key] = value *3;
  // 		return value *3;
  // 	});
  // console.log(b);
  // console.log(map);
  // 	reduce = _.reduce(a, function(memo, value) {
  // 		memo.push(value*5);
  // 		return memo;
  // 	}, []),
  // 	reduce1 = _.reduce(a, function(memo, value) {
  // 		return value + memo;
  // 	}),
  // 	value = _.pairs(a);
  // 	console.log(value);
  // var testArrayData = (function(length){
  // 	var i = 0,
  // 		arrayData = [];
  // 	for(; i < length; i++){
  // 		arrayData[i] = i;
  // 	}
  // 	return arrayData;
  // })(100),
  // loop = function (fn, times) {
  // 	var context = context || this,
  // 		time = 0,
  // 		i, now, then;
  // 	for(i = 0; i < times; i++) {
  // 		now = new Date();
  // 		fn();
  // 		then = new Date();
  // 		time = time + (then - now);
  // 	}
  // 	return time / times;
  // },
  // valueFn = function() {
  // 	results = _.reduce(testArrayData, function(memo, value) {
  // 		memo.push(value*5);
  // 		return memo;
  // 	}, []);
  // },
  // results, time;
  // time = loop(valueFn, 10);
  // console.log(time);
  // var obj = {name:345, age:12},
  // 	obj2 = {name:789, address:33};
  // console.log(_.max(obj));
  // console.log(_.max(obj, function(value, index){
  // 	return obj2[index];
  // }));
  // console.log(_.max(obj, function(value, index){
  // 	return this[index];
  // }, obj2));
  // console.log(_.values({nanme:'allen', age:22}));
  // console.log(_.values([2,3,4,5,6]));
  // var odds = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
  // console.log(odds);
  // console.log(_.flatten([1, [2], [3, [[[4]]]]]));
  // console.log(_.last([5, 4, 3, 2, 1], 6));
  // 	var add = function(a, b, c, d) { return a * 2 + b - c + d; };
  // add5 = _.partial(add, 5, 20);
  // console.log(add5(10, 5));
  // console.log(_.slice([1,2,3,4,5], 2));
  var root = new Delegate('#root');
  root.on('click', 'li', function(e){
    console.log(e);
  });
});
var test = require('test');