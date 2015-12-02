var wipe;

$(document).on("ready", function() {

	wipe = new SWWipe($('.banner')[0]);
});


$(window).on("resize", function() {

	wipe.resize();
});