
var raf = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.setImmediate
    || function(cb) { return window.setTimeout(cb, 1000 / 60); };
var queue = [],
		timer,
		looping = false;

function Batch(){
}

Batch.push = function(fn){
	queue.push(fn);
	if(queue.length === 1){
		startTick();
	}
}

function startTick(){
		raf(tick);
}
	
function tick(){
	if(queue.length !== 0){
		raf(tick);
	}
	if(looping){
		return ;
	}
	var fn;
	while(queue.length > 0){
		fn = queue.shift();
		fn();
	}
	looping = true;
}
