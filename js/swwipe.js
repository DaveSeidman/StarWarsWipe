/*

TO Do:


*/

"use strict";

var SWWipe = (function(banner) {

	//var sww = this;
	var _this = this;
	
	_this.banner = banner;	// div container 
	_this.images;				// array of img elements
	_this.imageArray = [];	// object containing all images and their properties
	_this.percent;			// percent completion of wipe, (ranges from 0 - fadeWidth to 1 + fadeWidth)
	_this.step;				// the amount to increment _this.percent every frame, varies based on fadeDuration
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

	var fadeWidth;
	var gradient;

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

		nextFade();
		_this.resize();
	}


	function redraw() {
		
		_this.foreContext.save();
		_this.foreContext.clearRect(0,0,WIDTH,HEIGHT); 

		currentTime = new Date;
		elapsed = currentTime - startTime;


		fadeWidth = _this.curImg.fadeWidth;
		
		switch(_this.curImg.fadeType) {

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

				var segments = 300; // the amount of segments to split the semi circle into, DS: adjust this for performance
				//var fade = segments * fadeWidth; // how many of segments to fade through
				var len = Math.PI/segments;
				var step = 1/segments;

				var rotate = Math.PI; // offset rotation 180 degrees for bottom arc
				//var alpha = 1; // we should probably be setting alpha rather than reducing it

				//var i;
				//var x1 = Math.cos(i + rotate) * (HEIGHT*2) + WIDTH/2;
				//var y1 = Math.sin(i + rotate) * (HEIGHT*2) + HEIGHT;
				//var x2 = Math.cos(i + 1 + rotate) * (HEIGHT*2) + WIDTH/2;
				//var y2 = Math.sin(i + 1 + rotate) * (HEIGHT*2) + HEIGHT;
				
				//var fadeWidthRad = fadeWidth * Math.PI;
				//var percentRad = (_this.percent * (Math.PI + fadeWidthRad * 2)) - fadeWidthRad;
				
				// expand percent to cover fadeWidth
				var adjustedPercent = (_this.percent * (1 + fadeWidth)) - fadeWidth;

				// iterate a percent
				for(var percent = -fadeWidth; percent < 1 + fadeWidth; percent += step) {

					// convert percent to angle
					var angle = percent * Math.PI;
					
					// calculate coordinates for wedge
					var x1 = Math.cos(angle + rotate) * (HEIGHT*2) + WIDTH/2;
					var y1 = Math.sin(angle + rotate) * (HEIGHT*2) + HEIGHT;
					var x2 = Math.cos(angle + len + rotate) * (HEIGHT*2) + WIDTH/2;
					var y2 = Math.sin(angle + len + rotate) * (HEIGHT*2) + HEIGHT;

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

			_this.foreContext.globalCompositeOperation = "source-in";

			if(ASPECT > _this.nxtImg.aspect) {

				_this.foreContext.drawImage(_this.nxtImg.img, 
					0, 
					(HEIGHT - (WIDTH / _this.nxtImg.aspect))/2, 
					WIDTH, 
					WIDTH / _this.nxtImg.aspect);	
			}
			else {

				_this.foreContext.drawImage(_this.nxtImg.img, 
					(WIDTH - (HEIGHT * _this.nxtImg.aspect))/2, 
					0, 
					HEIGHT * _this.nxtImg.aspect, 
					HEIGHT);	
			}

			_this.foreContext.restore();

			_this.percent = elapsed / _this.curImg.fadeDuration;
			if(elapsed < _this.curImg.fadeDuration) requestAnimFrame(redraw);
			else setTimeout(nextFade, _this.curImg.fadeDelay);
		}

		function nextFade() {

		// advance indices
		index1++;
		if(index1 == _this.images.length) index1 = 0;
		_this.curImg = _this.imageArray[index1];

		index2 = index1 + 1;
		if(index2 == _this.images.length) index2 = 0;
		_this.nxtImg = _this.imageArray[index2];

		//backContext.clearRect(0,0,WIDTH,HEIGHT);

		if(ASPECT > _this.curImg.aspect) {

			_this.backContext.drawImage(
				_this.curImg.img, 
				0, 
				(HEIGHT - (WIDTH / _this.curImg.aspect))/2, 
				WIDTH, 
				WIDTH / _this.curImg.aspect);	
		}
		else {

			_this.backContext.drawImage(
				_this.curImg.img, 
				(WIDTH - (HEIGHT * _this.curImg.aspect))/2, 
				0, 
				HEIGHT * _this.curImg.aspect, 
				HEIGHT);	
		}

		// clear the foreground
		_this.foreContext.clearRect(0,0, WIDTH, HEIGHT);

		// setup and start the fade
		_this.percent = -_this.curImg.fadeWidth;
		_this.step = 1/(_this.curImg.fadeDuration * 1000);
		startTime = new Date;
		redraw();
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

			_this.backContext.drawImage(
				_this.curImg.img, 
				0, 
				(HEIGHT - (WIDTH / _this.curImg.aspect))/2, 
				WIDTH, 
				WIDTH / _this.curImg.aspect);	
		}
		else {

			_this.backContext.drawImage(
				_this.curImg.img, 
				(WIDTH - (HEIGHT * _this.curImg.aspect))/2, 
				0, 
				HEIGHT * _this.curImg.aspect, 
				HEIGHT);	
		}
	};


	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	})();


	init();

	return _this;

});