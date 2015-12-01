var constellation;
var sky;

$(document).on("ready", function() {

	sky = $("#sky");

	//constellation = new Constellation(sky);

	// Init plugin
	sky.constellation({
		star: {
			width: 3
		},
		line: {
			color: 'rgba(250, 230, 45, .5)'
		},
		radius: 250
	});

});
