# StarWarsWipe
Star Wars style image wipes using the canvas element in HTML

# Dependencies
No external dependencies required.

# Use
Create a div or any other container with the class "banner" than an inner container named "bannerImages" and include the .js file named swwipe.js and the 

```
<div class="banner">
	<div class="bannerImages">
		<img src="img/han.jpg" 	data-fadeDelay="1" 	data-fadeDuration="3" 	data-fadeType="cross-lr" 		data-fadeWidth=".1">
		<img src="img/kylo.jpg" data-fadeDelay="1" 	data-fadeDuration="3" 	data-fadeType="radial-btm" 		data-fadeWidth=".1">
		<img src="img/rey.jpg" 	data-fadeDelay="1" 	data-fadeDuration="3" 	data-fadeType="cross-du" 		data-fadeWidth=".1">
		<img src="img/leia.jpg" data-fadeDelay="1" 	data-fadeDuration="3" 	data-fadeType="diagonal-tl-br" 	data-fadeWidth=".1">
		<img src="img/finn.jpg" data-fadeDelay="1" 	data-fadeDuration="3" 	data-fadeType="radial-in" 		data-fadeWidth=".1">
		
	</div>
</div>
```
