/*

TO Do:
Test with different shaped images
Test with images that are slow to load.
Not using fade1 object properly, create new for each?

*/
"use strict";

var SWWipe = (function(banner) {

	var sww = this;
	
	sww.banner = banner;	// div container 
	sww.images;	// array of img elements
	sww.imageArray = [];
	sww.index1 = -1;
	sww.index2 = 0;
	sww.curImg;
	sww.nxtImg;
	//sww.gradient; // can probably remove this

	sww.backCanvas;
	sww.foreCanvas;
	sww.backContext; 
	sww.foreContext;

	sww.fade1 = new Fade("leftToRight", .1, 0);

	sww.WIDTH;
	sww.HEIGHT;
	sww.ASPECT;
	sww.OFFSETX;
	sww.OFFSETY;

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

		sww.WIDTH = window.innerWidth;
		sww.HEIGHT = window.innerHeight;
		sww.ASPECT = sww.WIDTH/sww.HEIGHT;

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
		sww.foreContext.clearRect(0,0,sww.WIDTH,sww.HEIGHT); 

		var fadeWidth = sww.curImg.fadeWidth;
		var gradient;

		switch(sww.curImg.fadeType) {

			case "cross-lr":
				gradient = sww.foreContext.createLinearGradient(
					(sww.fade1.amount * (1 + fadeWidth) - fadeWidth) * sww.WIDTH,0,
					(sww.fade1.amount * (1 + fadeWidth) + fadeWidth) * sww.WIDTH,0);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,sww.WIDTH,sww.HEIGHT);
			break;

			case "cross-rl":
				gradient = sww.foreContext.createLinearGradient(
					((1 - sww.fade1.amount) * (1 + fadeWidth) + fadeWidth) * sww.WIDTH,0,
					((1 - sww.fade1.amount) * (1 + fadeWidth) - fadeWidth) * sww.WIDTH,0);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,sww.WIDTH,sww.HEIGHT);
			break;

			case "cross-ud":
				gradient = sww.foreContext.createLinearGradient(
					0,(sww.fade1.amount * (1 + fadeWidth) - fadeWidth) * sww.WIDTH,
					0,(sww.fade1.amount * (1 + fadeWidth) + fadeWidth) * sww.WIDTH);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,sww.WIDTH,sww.HEIGHT);
			break;

			case "cross-du":
				gradient = sww.foreContext.createLinearGradient(
					0,((1 - sww.fade1.amount) * (1 + fadeWidth) + fadeWidth) * sww.WIDTH,
					0,((1 - sww.fade1.amount) * (1 + fadeWidth) - fadeWidth) * sww.WIDTH);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,sww.WIDTH,sww.HEIGHT);
			break;

			case "diagonal-tl-br": // DS: This diagonal not working properly

				gradient = sww.foreContext.createLinearGradient(
					(sww.fade1.amount * (2 + fadeWidth) - fadeWidth) * sww.WIDTH,0,
					(sww.fade1.amount * (2 + fadeWidth) + fadeWidth) * sww.WIDTH,fadeWidth * (sww.WIDTH/(sww.HEIGHT/2)) * sww.WIDTH);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,sww.WIDTH,sww.HEIGHT);				

			break;

			case "diagonal-tr-bl":
				gradient = sww.foreContext.createLinearGradient(
					(sww.fade1.amount * (1 + fadeWidth) - fadeWidth) * sww.WIDTH,0,
					(sww.fade1.amount * (1 + fadeWidth) + fadeWidth) * sww.WIDTH + sww.WIDTH,sww.HEIGHT);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					sww.foreContext.fillStyle = gradient;
					sww.foreContext.fillRect(0,0,sww.WIDTH,sww.HEIGHT);

			break;

			case "radial-btm":
							
				var segments = 360; // the amount of segments to split the semi circle into
				var fade = 50; // how many of segments to fade through
				var len = Math.PI/segments;
				
				var rotate = Math.PI; // offset rotation 180 degrees for bottom arc
				var alpha = 1; // we should probably be setting alpha rather than reducing it

				var i = 0;
				var x = Math.cos(i + rotate) * (sww.HEIGHT*2) + sww.WIDTH/2;
				var y = Math.sin(i + rotate) * (sww.HEIGHT*2) + sww.HEIGHT;
				var x2 = Math.cos(i + 1 + rotate) * (sww.HEIGHT*2) + sww.WIDTH/2;
				var y2 = Math.sin(i + 1 + rotate) * (sww.HEIGHT*2) + sww.HEIGHT;

				for(i = 0; i < Math.PI; i += len) {

					if(i/Math.PI > sww.fade1.amount) alpha -= 1/fade;
					x = Math.cos(i + rotate) * (sww.HEIGHT*2) + sww.WIDTH/2;
					y = Math.sin(i + rotate) * (sww.HEIGHT*2) + sww.HEIGHT;
					x2 = Math.cos(i + len + rotate) * (sww.HEIGHT*2) + sww.WIDTH/2;
					y2 = Math.sin(i + len + rotate) * (sww.HEIGHT*2) + sww.HEIGHT;
					sww.foreContext.beginPath();
					sww.foreContext.moveTo(sww.WIDTH/2 - 1,sww.HEIGHT);
					sww.foreContext.lineTo(x,y);
					sww.foreContext.lineTo(x2,y2);
					sww.foreContext.lineTo(sww.WIDTH/2 + 1, sww.HEIGHT);
					sww.foreContext.fillStyle = 'rgba(0,0,0,'+alpha+')';
					sww.foreContext.fill();
				}
				
			break;

			case "radial-in":

				var innerRadius = ((sww.fade1.amount) * sww.HEIGHT) - 100 < 0 ? .01 : ((sww.fade1.amount) * sww.HEIGHT) - 100;
				var outerRadius = (sww.fade1.amount * sww.HEIGHT) + 100

				gradient = sww.foreContext.createRadialGradient(sww.WIDTH/2, sww.HEIGHT/2, innerRadius, sww.WIDTH/2, sww.HEIGHT/2, outerRadius);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				sww.foreContext.fillStyle = gradient;
				sww.foreContext.fillRect(0,0,sww.WIDTH,sww.HEIGHT);

			break;

			case "radial-out":

				var innerRadius = ((sww.fade1.amount) * sww.HEIGHT) - 100 < 0 ? .01 : ((sww.fade1.amount) * sww.HEIGHT) - 100;
				var outerRadius = (sww.fade1.amount * sww.HEIGHT) + 100

				gradient = sww.foreContext.createRadialGradient(sww.WIDTH/2, sww.HEIGHT/2, innerRadius, sww.WIDTH/2, sww.HEIGHT/2, outerRadius);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				sww.foreContext.fillStyle = gradient;
				sww.foreContext.fillRect(0,0,sww.WIDTH,sww.HEIGHT);

			break;


			default:
			
			break;
		}
		

		sww.foreContext.globalCompositeOperation = "source-in";

		if(sww.ASPECT > sww.nxtImg.aspect) {

			sww.foreContext.drawImage(sww.nxtImg.img, 
			0, 
			(sww.HEIGHT - (sww.WIDTH / sww.nxtImg.aspect))/2, 
			sww.WIDTH, 
			sww.WIDTH / sww.nxtImg.aspect);	
		}
		else {

			sww.foreContext.drawImage(sww.nxtImg.img, 
			(sww.WIDTH - (sww.HEIGHT * sww.nxtImg.aspect))/2, 
			0, 
			sww.HEIGHT * sww.nxtImg.aspect, 
			sww.HEIGHT);	
		}
		
		sww.foreContext.restore();
	}

	function nextFade() {

		// advance indices
		sww.index1++;
		if(sww.index1 == sww.images.length) sww.index1 = 0;
		sww.curImg = sww.imageArray[sww.index1];

		sww.index2 = sww.index1 + 1;
		if(sww.index2 == sww.images.length) sww.index2 = 0;
		sww.nxtImg = sww.imageArray[sww.index2];

		//backContext.clearRect(0,0,WIDTH,HEIGHT);

		if(sww.ASPECT > sww.curImg.aspect) {

			sww.backContext.drawImage(
				sww.curImg.img, 
				0, 
				(sww.HEIGHT - (sww.WIDTH / sww.curImg.aspect))/2, 
				sww.WIDTH, 
				sww.WIDTH / sww.curImg.aspect);	
		}
		else {

			sww.backContext.drawImage(
				sww.curImg.img, 
				(sww.WIDTH - (sww.HEIGHT * sww.curImg.aspect))/2, 
				0, 
				sww.HEIGHT * sww.curImg.aspect, 
				sww.HEIGHT);	
		}

		// clear the foreground
		sww.foreContext.clearRect(0,0, sww.WIDTH, sww.HEIGHT);
		//foreContext.lineWidth = HEIGHT*2;

		// setup and start the fade
		sww.fade1.amount = -sww.fade1.width;
		TweenMax.to(sww.fade1, sww.curImg.fadeDuration, { 
			amount:1+sww.fade1.width, 
			delay:sww.curImg.fadeDelay, 
			onUpdate:redraw, 
			onComplete:nextFade 
		});
	}

	this.resize = function() {

		sww.WIDTH = window.innerWidth;
		sww.HEIGHT = window.innerHeight;
		sww.ASPECT = sww.WIDTH/sww.HEIGHT;

		sww.backContext.canvas.width = sww.WIDTH;
		sww.backContext.canvas.height = sww.HEIGHT;

		sww.foreContext.canvas.width = sww.WIDTH;
		sww.foreContext.canvas.height = sww.HEIGHT;

		if(sww.ASPECT > sww.curImg.aspect) {

			sww.backContext.drawImage(
				sww.curImg.img, 
				0, 
				(sww.HEIGHT - (sww.WIDTH / sww.curImg.aspect))/2, 
				sww.WIDTH, 
				sww.WIDTH / sww.curImg.aspect);	
		}
		else {

			sww.backContext.drawImage(
				sww.curImg.img, 
				(sww.WIDTH - (sww.HEIGHT * sww.curImg.aspect))/2, 
				0, 
				sww.HEIGHT * sww.curImg.aspect, 
				sww.HEIGHT);	
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