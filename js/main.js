var wipe;

window.onload = function() {

	wipe = new SWWipe(document.getElementsByClassName("banner")[0]);
}

window.onresize = function() {

	wipe.resize();
}