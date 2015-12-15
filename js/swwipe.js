/*

	To Do
	------------------------------------------
	Fix diagonal wipe
	fix radial wipe
	grow variables reset at wrong time
	grow should respect img aspect, right now it's square



*/

"use strict";

var SWWipe = (function(banner) {

	var _this = this;
	
	_this.banner = banner;	// div container 
	_this.images;				// array of img elements
	_this.imageArray = [];	// object containing all images and their properties
	_this.percent;			// percent completion of wipe, (ranges from 0 - fadeWidth to 1 + fadeWidth)
	_this.curImg;
	_this.nxtImg;

	_this.backCanvas;
	_this.foreCanvas;
	_this.backContext; 
	_this.foreContext;
	
	var index1 = -1;
	var index2 = 0;
	var WIDTH;				// width of container (banner)
	var HEIGHT;				// height of container
	var ASPECT;				// aspect ratio of container 
	var startTime;
	var currentTime;
	var elapsed;

	var growSpeed = .33;
	var grow1 = 0;
	var grow2 = 0;
	var curImgLeft;
	var curImgTop;
	var curImgWidth;
	var curImgHeight;
	var nxtImgLeft;
	var nxtImgTop;
	var nxtImgWidth;
	var nxtImgHeight;

	var fadeWidth;
	var gradient;
	var stopped = false;

	function cacheElements() {

		_this.images = banner.getElementsByTagName("img");

		_this.backCanvas = document.createElement('canvas');
		_this.foreCanvas = document.createElement('canvas');
		_this.banner.appendChild(_this.backCanvas);
		_this.banner.appendChild(_this.foreCanvas);
		_this.backContext = _this.backCanvas.getContext("2d");
		_this.foreContext = _this.foreCanvas.getContext("2d");
	}


	function init() {

		cacheElements();

		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		ASPECT = WIDTH/HEIGHT;

		for(var i = 0; i < _this.images.length; i++) {

			var image = _this.images[i];
			var imageObject = {};
			imageObject.img = image;
			imageObject.aspect = image.width/image.height;
			imageObject.fadeDuration = image.hasAttribute("data-fadeDuration") ? Number(image.getAttribute("data-fadeDuration")) * 1000 : 1000;
			imageObject.fadeDelay = image.hasAttribute("data-fadeDelay") ? Number(image.getAttribute("data-fadeDelay")) * 1000 : 1000;
			imageObject.fadeType = image.hasAttribute("data-fadeType") ? image.getAttribute("data-fadeType") : "cross-lr";
			imageObject.fadeWidth = image.hasAttribute("data-fadeWidth") ? Number(image.getAttribute("data-fadeWidth")) : .1;

			_this.imageArray.push(imageObject);
		}

		nextWipe();
		_this.resize();
	}



	function nextWipe() {

		// advance indices
		index1++;
		if(index1 == _this.images.length) index1 = 0;
		_this.curImg = _this.imageArray[index1];

		index2 = index1 + 1;
		if(index2 == _this.images.length) index2 = 0;
		_this.nxtImg = _this.imageArray[index2];

		// setup and start the fade
		fadeWidth = _this.curImg.fadeWidth;
		_this.percent = 0;
		startTime = new Date;
		
		redraw();
	}

	function redraw() {
		


		_this.backContext.drawImage(_this.curImg.img, curImgLeft - (grow1/2), curImgTop - ((grow1 / _this.curImg.aspect)/2), curImgWidth + grow1, curImgHeight + (grow1 / _this.curImg.aspect));

		// clear the foreground canvas
		_this.foreContext.save();
		_this.foreContext.clearRect(0,0,WIDTH,HEIGHT); 
		// draw different gradients based on fadeType
		drawGradient(_this.curImg.fadeType); // DS: maybe this should only return the gradient and we draw it here
		// draw nxtImg into gradient
		_this.foreContext.globalCompositeOperation = "source-in";
		_this.foreContext.drawImage(_this.nxtImg.img, nxtImgLeft - (grow2/2), nxtImgTop - ((grow2 / _this.curImg.aspect)/2), nxtImgWidth + grow2, nxtImgHeight + (grow2 / _this.curImg.aspect));
		_this.foreContext.restore();

		// calculate percent completion of wipe
		currentTime = new Date;
		elapsed = currentTime - startTime;
		_this.percent = elapsed / _this.curImg.fadeDuration > 1 ? 1 : elapsed / _this.curImg.fadeDuration;

		// expand image
		grow1 += growSpeed;
		grow2 += growSpeed;

		if(elapsed >= _this.curImg.fadeDuration + _this.curImg.fadeDelay) {
			grow1 = grow2;
			grow2 = 0;
			nextWipe();
		}
		else requestAnimFrame(redraw);
	}

	function drawGradient(fadeType) {

		switch(fadeType) {

			case "cross-lr":
				gradient = _this.foreContext.createLinearGradient(
					(_this.percent * (1 + fadeWidth) - fadeWidth) * WIDTH,0,
					(_this.percent * (1 + fadeWidth) + fadeWidth) * WIDTH,0);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				_this.foreContext.fillStyle = gradient;
				_this.foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "cross-rl":
				gradient = _this.foreContext.createLinearGradient(
					((1 - _this.percent) * (1 + fadeWidth) + fadeWidth) * WIDTH,0,
					((1 - _this.percent) * (1 + fadeWidth) - fadeWidth) * WIDTH,0);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				_this.foreContext.fillStyle = gradient;
				_this.foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "cross-ud":
				gradient = _this.foreContext.createLinearGradient(
					0,(_this.percent * (1 + fadeWidth) - fadeWidth) * WIDTH,
					0,(_this.percent * (1 + fadeWidth) + fadeWidth) * WIDTH);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				_this.foreContext.fillStyle = gradient;
				_this.foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "cross-du":
				gradient = _this.foreContext.createLinearGradient(
					0,((1 - _this.percent) * (1 + fadeWidth) + fadeWidth) * WIDTH,
					0,((1 - _this.percent) * (1 + fadeWidth) - fadeWidth) * WIDTH);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				_this.foreContext.fillStyle = gradient;
				_this.foreContext.fillRect(0,0,WIDTH,HEIGHT);
			break;

			case "diagonal-tl-br": // DS: This diagonal not working properly

				gradient = _this.foreContext.createLinearGradient(
					(_this.percent * (2 + fadeWidth) - fadeWidth) * WIDTH,0,
					(_this.percent * (2 + fadeWidth) + fadeWidth) * WIDTH,fadeWidth * (WIDTH/(HEIGHT/2)) * WIDTH);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				_this.foreContext.fillStyle = gradient;
				_this.foreContext.fillRect(0,0,WIDTH,HEIGHT);				

			break;

			case "diagonal-tr-bl":
				gradient = _this.foreContext.createLinearGradient(
					(_this.percent * (1 + fadeWidth) - fadeWidth) * WIDTH,0,
					(_this.percent * (1 + fadeWidth) + fadeWidth) * WIDTH + WIDTH,HEIGHT);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				_this.foreContext.fillStyle = gradient;
				_this.foreContext.fillRect(0,0,WIDTH,HEIGHT);

			break;

			case "radial-btm":

				var segments = 500; // the amount of segments to split the semi circle into, DS: adjust this for performance
				var len = Math.PI/segments;
				var step = 1/segments;

				// expand percent to cover fadeWidth
				var adjustedPercent = (_this.percent * (1 + fadeWidth)) - fadeWidth;

				// iterate a percent
				for(var percent = -fadeWidth; percent < 1 + fadeWidth; percent += step) {

					// convert percent to angle
					var angle = percent * Math.PI;
					
					// calculate coordinates for wedge
					var x1 = Math.cos(angle + Math.PI) * (HEIGHT*2) + WIDTH/2;
					var y1 = Math.sin(angle + Math.PI) * (HEIGHT*2) + HEIGHT;
					var x2 = Math.cos(angle + len + Math.PI) * (HEIGHT*2) + WIDTH/2;
					var y2 = Math.sin(angle + len + Math.PI) * (HEIGHT*2) + HEIGHT;

					// calculate alpha for wedge
					var alpha = (adjustedPercent - percent + fadeWidth)/fadeWidth;
					
					// draw wedge 
					_this.foreContext.beginPath();
					_this.foreContext.moveTo(WIDTH/2-2,HEIGHT);
					_this.foreContext.lineTo(x1,y1);
					_this.foreContext.lineTo(x2,y2);
					_this.foreContext.lineTo(WIDTH/2+2, HEIGHT);
					_this.foreContext.fillStyle = 'rgba(0,0,0,'+alpha+')';
					_this.foreContext.fill();
				}
				
			break;

			case "radial-top":

				var segments = 500; // the amount of segments to split the semi circle into, DS: adjust this for performance
				var len = Math.PI/segments;
				var step = 1/segments;

				// expand percent to cover fadeWidth
				var adjustedPercent = (_this.percent * (1 + fadeWidth)) - fadeWidth;

				// iterate a percent
				for(var percent = -fadeWidth; percent < 1 + fadeWidth; percent += step) {

					// convert percent to angle
					var angle = percent * Math.PI;
					
					// calculate coordinates for wedge
					var x1 = Math.cos(angle + len + (2*Math.PI)) * (HEIGHT*2) + WIDTH/2;
					var y1 = Math.sin(angle + len + (2*Math.PI)) * (HEIGHT*2);
					var x2 = Math.cos(angle + (2*Math.PI)) * (HEIGHT*2) + WIDTH/2;
					var y2 = Math.sin(angle + (2*Math.PI)) * (HEIGHT*2);
					

					// calculate alpha for wedge
					var alpha = (adjustedPercent - percent + fadeWidth)/fadeWidth;
					
					// draw wedge 
					_this.foreContext.beginPath();
					_this.foreContext.moveTo(WIDTH/2-2,0);
					_this.foreContext.lineTo(x1,y1);
					_this.foreContext.lineTo(x2,y2);
					_this.foreContext.lineTo(WIDTH/2+2,0);
					_this.foreContext.fillStyle = 'rgba(0,0,0,'+alpha+')';
					_this.foreContext.fill();
				}
				
			break;

			case "radial-in":

				var innerRadius = ((_this.percent) * HEIGHT) - 100 < 0 ? .01 : ((_this.percent) * HEIGHT) - 100;
				var outerRadius = (_this.percent * HEIGHT) + 100
				gradient = _this.foreContext.createRadialGradient(WIDTH/2, HEIGHT/2, innerRadius, WIDTH/2, HEIGHT/2, outerRadius);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				_this.foreContext.fillStyle = gradient;
				_this.foreContext.fillRect(0,0,WIDTH,HEIGHT);

			break;

			case "radial-out":

				var innerRadius = ((_this.percent) * HEIGHT) - 100 < 0 ? .01 : ((_this.percent) * HEIGHT) - 100;
				var outerRadius = (_this.percent * HEIGHT) + 100
				gradient = _this.foreContext.createRadialGradient(WIDTH/2, HEIGHT/2, innerRadius, WIDTH/2, HEIGHT/2, outerRadius);
				gradient.addColorStop(0.0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
				_this.foreContext.fillStyle = gradient;
				_this.foreContext.fillRect(0,0,WIDTH,HEIGHT);

			break;


			default:

			break;

		}
	}

	_this.resize = function() {

		WIDTH = window.innerWidth;
		//HEIGHT = window.innerHeight;
		HEIGHT = document.documentElement.clientHeight; // DS: fix for iOS 9 bug
		ASPECT = WIDTH/HEIGHT;

		_this.backContext.canvas.width = WIDTH;
		_this.backContext.canvas.height = HEIGHT;

		_this.foreContext.canvas.width = WIDTH;
		_this.foreContext.canvas.height = HEIGHT;

		if(ASPECT > _this.curImg.aspect) {

			curImgLeft = 0;
			curImgTop = (HEIGHT - (WIDTH / _this.nxtImg.aspect))/2;
			curImgWidth = WIDTH;
			curImgHeight = WIDTH / _this.nxtImg.aspect;	
		}
		else {

			curImgLeft = (WIDTH - (HEIGHT * _this.nxtImg.aspect))/2;
			curImgTop = 0;
			curImgWidth = HEIGHT * _this.nxtImg.aspect;
			curImgHeight = HEIGHT;
		}

		if(ASPECT > _this.nxtImg.aspect) {

			nxtImgLeft = 0;
			nxtImgTop = (HEIGHT - (WIDTH / _this.nxtImg.aspect))/2;
			nxtImgWidth = WIDTH;
			nxtImgHeight = WIDTH / _this.nxtImg.aspect;	
		}
		else {

			nxtImgLeft = (WIDTH - (HEIGHT * _this.nxtImg.aspect))/2;
			nxtImgTop = 0;
			nxtImgWidth = HEIGHT * _this.nxtImg.aspect;
			nxtImgHeight = HEIGHT;
		}

		_this.backContext.drawImage(_this.curImg.img, curImgLeft - (grow1/2), curImgTop - (grow1/2), curImgWidth + grow1, curImgHeight + grow1);

	};


	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame   ||
		window.mozRequestAnimationFrame      ||
		function( callback ) { window.setTimeout(callback, 1000 / 60); };
	})();


	init();

	return _this;

});
