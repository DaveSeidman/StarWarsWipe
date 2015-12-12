/*

TO Do:


*/

"use strict";

var SWWipe = (function(banner) {

	var sww = this;
	
	sww.banner = banner;	// div container 
	sww.images;				// array of img elements
	sww.imageArray = [];	// object containing all images and their properties
	sww.percent;			// percent completion of wipe, (ranges from 0 - fadeWidth to 1 + fadeWidth)
	sww.curImg;
	sww.nxtImg;

	sww.backCanvas;
	sww.foreCanvas;
	sww.backContext; 
	sww.foreContext;
	
	var index1 = -1;
	var index2 = 0;
	var WIDTH;				// width of container (banner)
	var HEIGHT;				// height of container
	var ASPECT;				// aspect ratio of container 


	function cacheElements() {

		sww.images = banner.getElementsByTagName("img");

		sww.backCanvas = document.createElement('canvas');
		sww.foreCanvas = document.createElement('canvas');
		sww.banner.appendChild(sww.backCanvas);
		sww.banner.appendChild(sww.foreCanvas);
		sww.backContext = sww.backCanvas.getContext("2d");
		sww.foreContext = sww.foreCanvas.getContext("2d");
	}


	function init() {

		cacheElements();

		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		ASPECT = WIDTH/HEIGHT;

		for(var i = 0; i < sww.images.length; i++) {

			var image = sww.images[i];
			var imageObject = {};
			imageObject.img = image;
			imageObject.aspect = image.width/image.height;
			imageObject.fadeDuration = Number(image.getAttribute("data-fadeDuration"));
			imageObject.fadeDelay = Number(image.getAttribute("data-fadeDelay"));
			imageObject.fadeType = image.getAttribute("data-fadeType");
			imageObject.fadeWidth = Number(image.getAttribute("data-fadeWidth"));

			sww.imageArray.push(imageObject);
		}

		nextFade();
		sww.resize();
	}


	function redraw() {
		
		sww.foreContext.save();
		sww.foreContext.clearRect(0,0,WIDTH,HEIGHT); 

		var fadeWidth = sww.curImg.fadeWidth;
		var gradient;

		switch(sww.curImg.fadeType) {

			case "cross-lr":
				gradient = sww.foreContext.createLinearGradient(
					(sww.percent * (1 + fadeWidth) - fadeWidth) * WIDTH,0,
					(sww.percent * (1 + fadeWidth) + fadeWidth) * WIDTH,0);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "cross-rl":
				gradient = sww.foreContext.createLinearGradient(
					((1 - sww.percent) * (1 + fadeWidth) + fadeWidth) * WIDTH,0,
					((1 - sww.percent) * (1 + fadeWidth) - fadeWidth) * WIDTH,0);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "cross-ud":
				gradient = sww.foreContext.createLinearGradient(
					0,(sww.percent * (1 + fadeWidth) - fadeWidth) * WIDTH,
					0,(sww.percent * (1 + fadeWidth) + fadeWidth) * WIDTH);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "cross-du":
				gradient = sww.foreContext.createLinearGradient(
					0,((1 - sww.percent) * (1 + fadeWidth) + fadeWidth) * WIDTH,
					0,((1 - sww.percent) * (1 + fadeWidth) - fadeWidth) * WIDTH);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "diagonal-tl-br": // DS: This diagonal not working properly

				gradient = sww.foreContext.createLinearGradient(
					(sww.percent * (2 + fadeWidth) - fadeWidth) * WIDTH,0,
					(sww.percent * (2 + fadeWidth) + fadeWidth) * WIDTH,fadeWidth * (WIDTH/(HEIGHT/2)) * WIDTH);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,WIDTH,HEIGHT);				

			break;

			case "diagonal-tr-bl":
				gradient = sww.foreContext.createLinearGradient(
					(sww.percent * (1 + fadeWidth) - fadeWidth) * WIDTH,0,
					(sww.percent * (1 + fadeWidth) + fadeWidth) * WIDTH + WIDTH,HEIGHT);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,WIDTH,HEIGHT);

			break;

			case "radial-btm":
							
				var segments = 300; // the amount of segments to split the semi circle into
				var fade = segments * fadeWidth; // how many of segments to fade through
				var len = Math.PI/segments;
				
				var rotate = Math.PI; // offset rotation 180 degrees for bottom arc
				var alpha = 1; // we should probably be setting alpha rather than reducing it

				var i = 0;
				var x = Math.cos(i + rotate) * (HEIGHT*2) + WIDTH/2;
				var y = Math.sin(i + rotate) * (HEIGHT*2) + HEIGHT;
				var x2 = Math.cos(i + 1 + rotate) * (HEIGHT*2) + WIDTH/2;
				var y2 = Math.sin(i + 1 + rotate) * (HEIGHT*2) + HEIGHT;

				for(i = 0; i < Math.PI; i += len) {

					if(i/Math.PI > sww.percent) alpha -= 1/fade;
					x = Math.cos(i + rotate) * (HEIGHT*2) + WIDTH/2;
					y = Math.sin(i + rotate) * (HEIGHT*2) + HEIGHT;
					x2 = Math.cos(i + len + rotate) * (HEIGHT*2) + WIDTH/2;
					y2 = Math.sin(i + len + rotate) * (HEIGHT*2) + HEIGHT;
					sww.foreContext.beginPath();
					sww.foreContext.moveTo(WIDTH/2 - 1,HEIGHT);
					sww.foreContext.lineTo(x,y);
					sww.foreContext.lineTo(x2,y2);
					sww.foreContext.lineTo(WIDTH/2 + 1, HEIGHT);
					sww.foreContext.fillStyle = 'rgba(0,0,0,'+alpha+')';
					sww.foreContext.fill();
				}
				
			break;

			case "radial-in":

				var innerRadius = ((sww.percent) * HEIGHT) - 100 < 0 ? .01 : ((sww.percent) * HEIGHT) - 100;
				var outerRadius = (sww.percent * HEIGHT) + 100
				gradient = sww.foreContext.createRadialGradient(WIDTH/2, HEIGHT/2, innerRadius, WIDTH/2, HEIGHT/2, outerRadius);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				sww.foreContext.fillStyle = gradient;
				sww.foreContext.fillRect(0,0,WIDTH,HEIGHT);

			break;

			case "radial-out":

				var innerRadius = ((sww.percent) * HEIGHT) - 100 < 0 ? .01 : ((sww.percent) * HEIGHT) - 100;
				var outerRadius = (sww.percent * HEIGHT) + 100
				gradient = sww.foreContext.createRadialGradient(WIDTH/2, HEIGHT/2, innerRadius, WIDTH/2, HEIGHT/2, outerRadius);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				sww.foreContext.fillStyle = gradient;
				sww.foreContext.fillRect(0,0,WIDTH,HEIGHT);

			break;


			default:
			
			break;
		}
		
		sww.foreContext.globalCompositeOperation = "source-in";

		if(ASPECT > sww.nxtImg.aspect) {

			sww.foreContext.drawImage(sww.nxtImg.img, 
			0, 
			(HEIGHT - (WIDTH / sww.nxtImg.aspect))/2, 
			WIDTH, 
			WIDTH / sww.nxtImg.aspect);	
		}
		else {

			sww.foreContext.drawImage(sww.nxtImg.img, 
			(WIDTH - (HEIGHT * sww.nxtImg.aspect))/2, 
			0, 
			HEIGHT * sww.nxtImg.aspect, 
			HEIGHT);	
		}
		
		sww.foreContext.restore();

		sww.percent += .01;
		if(sww.percent <= 1 + sww.curImg.fadeWidth) requestAnimationFrame(redraw);
		else setTimeout(nextFade, sww.curImg.fadeDelay * 1000);
	}

	function nextFade() {

		// advance indices
		index1++;
		if(index1 == sww.images.length) index1 = 0;
		sww.curImg = sww.imageArray[index1];

		index2 = index1 + 1;
		if(index2 == sww.images.length) index2 = 0;
		sww.nxtImg = sww.imageArray[index2];

		//backContext.clearRect(0,0,WIDTH,HEIGHT);

		if(ASPECT > sww.curImg.aspect) {

			sww.backContext.drawImage(
				sww.curImg.img, 
				0, 
				(HEIGHT - (WIDTH / sww.curImg.aspect))/2, 
				WIDTH, 
				WIDTH / sww.curImg.aspect);	
		}
		else {

			sww.backContext.drawImage(
				sww.curImg.img, 
				(WIDTH - (HEIGHT * sww.curImg.aspect))/2, 
				0, 
				HEIGHT * sww.curImg.aspect, 
				HEIGHT);	
		}

		// clear the foreground
		sww.foreContext.clearRect(0,0, WIDTH, HEIGHT);

		// setup and start the fade
		sww.percent = -sww.curImg.fadeWidth;
		redraw();
	}

	this.resize = function() {

		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		ASPECT = WIDTH/HEIGHT;

		sww.backContext.canvas.width = WIDTH;
		sww.backContext.canvas.height = HEIGHT;

		sww.foreContext.canvas.width = WIDTH;
		sww.foreContext.canvas.height = HEIGHT;

		if(ASPECT > sww.curImg.aspect) {

			sww.backContext.drawImage(
				sww.curImg.img, 
				0, 
				(HEIGHT - (WIDTH / sww.curImg.aspect))/2, 
				WIDTH, 
				WIDTH / sww.curImg.aspect);	
		}
		else {

			sww.backContext.drawImage(
				sww.curImg.img, 
				(WIDTH - (HEIGHT * sww.curImg.aspect))/2, 
				0, 
				HEIGHT * sww.curImg.aspect, 
				HEIGHT);	
		}
	};

	function Fade(type,width,amount) {

		this.type = type;
		this.width = width;
		this.amount = 0;
	}


	init();

	return sww;

});