var wipe;

$(window).on("load", function() {

	wipe = new SWWipe($('.banner')[0]);
});


$(window).on("resize", function() {

	wipe.resize();
});