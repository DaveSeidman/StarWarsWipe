/*

TO Do:
Test with different shaped images
Test with images that are slow to load.
Not using fade1 object properly, create new for each?

*/
"use strict";

var SWWipe = (function(banner) {

	var _this = this;

	var images;
	var index1 = -1, index2 = 0;
	var curImg, nxtImg;
	var gradient;

	var banner;
	var backCanvas, foreCanvas, backContext, foreContext;

	var fade1 = new Fade("leftToRight", .1, 0);

	var WIDTH,HEIGHT,ASPECT,OFFSETX,OFFSETY;

	function cacheElements() {

		images = $(".bannerImages img");

		banner = $($('.banner')[0]);

		backCanvas = $('<canvas id="backCanvas">')[0];
		foreCanvas = $('<canvas id="foreCanvas">')[0];

		banner.append(backCanvas);
		banner.append(foreCanvas);

		backContext = backCanvas.getContext("2d");
		foreContext = foreCanvas.getContext("2d");
	}


	function init() {

		cacheElements();
		//backContext.drawImage(images[index1],0,0,WIDTH,HEIGHT);

		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		ASPECT = WIDTH/HEIGHT;
		images.each(function() {

			var img = $(this);
			img.data({
				"aspect":this.width/this.height,
				"fadeDuration":img.attr("data-fadeDuration"),
				"fadeDelay":img.attr("data-fadeDelay"),
				"fadeType":img.attr("data-fadeType"),
				"fadeWidth":Number(img.attr("data-fadeWidth"))});

			console.log(img.data("aspect"));
		});

		nextFade();

		_this.resize();
	}


	function redraw() {
		
		foreContext.save();
		foreContext.clearRect(0,0,WIDTH,HEIGHT); 

		var fadeWidth = curImg.data("fadeWidth");

		switch(curImg.data("fadeType")) {

			case "cross-lr":
				gradient = foreContext.createLinearGradient(
					(fade1.amount * (1 + fadeWidth) - fadeWidth) * WIDTH,0,
					(fade1.amount * (1 + fadeWidth) + fadeWidth) * WIDTH,0);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					foreContext.fillStyle = gradient;
					foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "cross-rl":
				gradient = foreContext.createLinearGradient(
					((1 - fade1.amount) * (1 + fadeWidth) + fadeWidth) * WIDTH,0,
					((1 - fade1.amount) * (1 + fadeWidth) - fadeWidth) * WIDTH,0);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					foreContext.fillStyle = gradient;
					foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "cross-ud":
				gradient = foreContext.createLinearGradient(
					0,(fade1.amount * (1 + fadeWidth) - fadeWidth) * WIDTH,
					0,(fade1.amount * (1 + fadeWidth) + fadeWidth) * WIDTH);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					foreContext.fillStyle = gradient;
					foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "cross-du":
				gradient = foreContext.createLinearGradient(
					0,((1 - fade1.amount) * (1 + fadeWidth) + fadeWidth) * WIDTH,
					0,((1 - fade1.amount) * (1 + fadeWidth) - fadeWidth) * WIDTH);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					foreContext.fillStyle = gradient;
					foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "diagonal-tl-br":
				gradient = foreContext.createLinearGradient(
					(fade1.amount * (2 + fadeWidth) - fadeWidth) * WIDTH,0,
					(fade1.amount * (2 + fadeWidth) + fadeWidth) * WIDTH,fadeWidth * (WIDTH/(HEIGHT/2)) * WIDTH);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					foreContext.fillStyle = gradient;
					foreContext.fillRect(0,0,WIDTH,HEIGHT);				

			break;

			case "diagonal-tr-bl":
				gradient = foreContext.createLinearGradient(
					(fade1.amount * (1 + fadeWidth) - fadeWidth) * WIDTH,0,
					(fade1.amount * (1 + fadeWidth) + fadeWidth) * WIDTH + WIDTH,HEIGHT);
					gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
					gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
					foreContext.fillStyle = gradient;
					foreContext.fillRect(0,0,WIDTH,HEIGHT);

			break;

			case "radial-btm":
				foreContext.beginPath();
				foreContext.arc(WIDTH/2, HEIGHT, HEIGHT, Math.PI, Math.PI + (Math.PI * fade1.amount));
				foreContext.lineWidth=HEIGHT*2;
				foreContext.stroke();
				//boxBlurCanvasRGB( "foreCanvas", 0, 0, WIDTH, HEIGHT,5, 2 );

			break;

			case "radial-out":
			
			break;


			default:
			
			break;
		}
		
		

		foreContext.globalCompositeOperation = "source-in";

		if(ASPECT > nxtImg.data("aspect")) {

			foreContext.drawImage(nxtImg[0], 
			0, 
			(HEIGHT - (WIDTH / nxtImg.data("aspect")))/2, 
			WIDTH, 
			WIDTH / nxtImg.data("aspect"));	
		}
		else {

			foreContext.drawImage(nxtImg[0], 
			(WIDTH - (HEIGHT * nxtImg.data("aspect")))/2, 
			0, 
			HEIGHT * nxtImg.data("aspect"), 
			HEIGHT);	
		}
		
		foreContext.restore();
	}

	function nextFade() {

		// advance indices
		index1++;
		if(index1 == images.length) index1 = 0;
		curImg = $(images[index1]);

		index2 = index1 + 1;
		if(index2 == images.length) index2 = 0;
		nxtImg = $(images[index2]);

		//backContext.clearRect(0,0,WIDTH,HEIGHT);

		if(ASPECT > curImg.data("aspect")) {

			backContext.drawImage(
				curImg[0], 
				0, 
				(HEIGHT - (WIDTH / curImg.data("aspect")))/2, 
				WIDTH, 
				WIDTH / curImg.data("aspect"));	
		}
		else {

			backContext.drawImage(
				curImg[0], 
				(WIDTH - (HEIGHT * curImg.data("aspect")))/2, 
				0, 
				HEIGHT * curImg.data("aspect"), 
				HEIGHT);	
		}

		// clear the foreground
		foreContext.clearRect(0,0, WIDTH, HEIGHT);

		// setup and start the fade
		fade1.amount = -fade1.width;
		TweenMax.to(fade1, curImg.data("fadeDuration"), { 
			amount:1+fade1.width, 
			delay:curImg.data("fadeDelay"), 
			onUpdate:redraw, 
			onComplete:nextFade 
		});
	}

	this.resize = function() {

		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		ASPECT = WIDTH/HEIGHT;

		backContext.canvas.width = WIDTH;
		backContext.canvas.height = HEIGHT;

		foreContext.canvas.width = WIDTH;
		foreContext.canvas.height = HEIGHT;

		if(ASPECT > curImg.data("aspect")) {

			backContext.drawImage(
				curImg[0], 
				0, 
				(HEIGHT - (WIDTH / curImg.data("aspect")))/2, 
				WIDTH, 
				WIDTH / curImg.data("aspect"));	
		}
		else {

			backContext.drawImage(
				curImg[0], 
				(WIDTH - (HEIGHT * curImg.data("aspect")))/2, 
				0, 
				HEIGHT * curImg.data("aspect"), 
				HEIGHT);	
		}
	};

	function Fade(type,width,amount) {

		this.type = type;
		this.width = width;
		this.amount = 0;
	}


	init();

	return _this;

});