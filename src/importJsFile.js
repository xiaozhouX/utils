function importJs(url){
	var script = document.createElement('script')
	script.src = url;
	document.body.appendChild(script)
}

importJs('http://news.dolphin.com/newslist.script.1.min.js?v=405fb849b037f860463394b869e5d10d')