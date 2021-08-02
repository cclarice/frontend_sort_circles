const btnstart	= document.querySelector(".button");
const buttons	= document.querySelector(".buttons");
const btncolor = document.querySelector(".color_mode");
const btnanime = document.querySelector(".anime_mode");
const btnspeed = document.querySelector(".speed_mode");
const circles	= document.querySelector(".circles");
const input = document.getElementById('amount');
var		animaMode = 0;	// 0 - Fast   1 - Swap   2 - Push
var		colorMode = 0;	// 0 - RGB   1 - Mono   2 - Red   3 - Green   4 - Blue
var		speedMode = 750; // 125ms 250ms 500ms 750ms 1s 2s

//	Set 8 as undefined
input.value = 8;

// Sleep in millisecond
function sleep(milliseconds) {  
	return new Promise(resolve => setTimeout(resolve, milliseconds));  
}

//
EasingFunctions = {
	// accelerating from zero velocity 
  easeInCubic: t => t*t*t,
  // decelerating to zero velocity 
  easeOutCubic: t => (--t)*t*t+1
}

btnstart.addEventListener("click", Start);

// Toggle animation, color and speed modes
btnanime.addEventListener("click", ToggleAnimationMode);
function ToggleAnimationMode() {
	if (animaMode == 2)
		animaMode = 0;
	else
		animaMode++;
	if (animaMode == 0)
		btnanime.textContent = "Mode: Fast";
	if (animaMode == 1)
		btnanime.textContent = "Mode: Swap";
	if (animaMode == 2)
		btnanime.textContent = "Mode: Push";
	console.log("Mode:" + animaMode);
}

btncolor.addEventListener("click", ToggleColorMode);
function ToggleColorMode() {
	if (colorMode == 4)
		colorMode = 0;
	else
		colorMode++;
	if (colorMode == 0)
		btncolor.textContent = "Color: RGB";
	if (colorMode == 1)
		btncolor.textContent = "Color: Mono";
	if (colorMode == 2)
		btncolor.textContent = "Color: Red";
	if (colorMode == 3)
		btncolor.textContent = "Color: Green";
	if (colorMode == 4)
		btncolor.textContent = "Color: Blue";
	console.log("Color:" + colorMode);
}

btnspeed.addEventListener("click", ToggleSpeedMode);
function ToggleSpeedMode() {
	if (speedMode == 500)
		speedMode = 750;
	else if (speedMode == 750)
		speedMode = 1000;
	else if (speedMode == 2000)
		speedMode = 125;
	else
		speedMode *= 2;
	if (speedMode == 125)
		btnspeed.textContent = "Speed: 125ms";
	if (speedMode == 250)
		btnspeed.textContent = "Speed: 250ms";
	if (speedMode == 500)
		btnspeed.textContent = "Speed: 500ms";
	if (speedMode == 750)
		btnspeed.textContent = "Speed: 750ms";
	if (speedMode == 1000)
		btnspeed.textContent = "Speed: 1s";
	if (speedMode == 2000)
		btnspeed.textContent = "Speed: 2s";
	console.log("Speed:" + speedMode + "ms");
}

// Converts RGB to Integer
function rgbToInt(color) {
  var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
  if (digits == null)
  	return (16777216);
  var red = parseInt(digits[2]);
  var green = parseInt(digits[3]);
  var blue = parseInt(digits[4]);
  return (parseInt((blue | (green << 8) | (red << 16)), 10));
}

// Return Smallest Avaleble color
function GetColor(amountOfCircles){
	var i = amountOfCircles;
	var	retColor = null;

	while (--i >= 0) {
		if (retColor == null && !circles.children[i].classList.contains('has_color')) {
			retColor = circles.children[i];
		}
		if (retColor != null && !circles.children[i].classList.contains('has_color') && 
			rgbToInt(retColor.style.backgroundColor) >=
				rgbToInt(circles.children[i].style.backgroundColor)) {
			retColor = circles.children[i];
		}
	}
	return (retColor);
}

// Index Cicles, give to all cicles them color_id
function IndexCircles(amountOfCircles) {
	var i = amountOfCircles;
	var curColor = null;

	while (--i >= 0) {
		curColor = GetColor(amountOfCircles);
		if (curColor != null) {
			curColor.classList.add("has_color");
			curColor.classList.add("color_id" + i);
		}
		else {
			console.log("Something Wrong!");
		}
	}
}

//	Lock All Input
async function LockInput() {
	input.readOnly = true;
	btnspeed.disabled = true;
	btnstart.disabled = true;
	btncolor.disabled = true;
	btnanime.disabled = true;
	buttons.animate([
			{ opacity: (1)},
			{ opacity: (0.1)}
			], {
				duration: 500,
				iterations: 1,
				easing: "ease"
			});
	buttons.style.opacity = 0.1;
}

//	Unlock All Input
async function unlockInput() {
	input.readOnly = false;
	btnspeed.disabled = false;
	btnstart.disabled = false;
	btncolor.disabled = false;
	btnanime.disabled = false;
	buttons.animate([
			{ opacity: (0.1)},
			{ opacity: (1)}
			], {
				duration: 500,
				iterations: 1,
				easing: "ease"
			});
	buttons.style.opacity = 1;
}

//	Start Sorting
async function Start() {
	var	amountOfCircles = input.value;
	var	sizeOfCircles = 90 / amountOfCircles;

	console.clear();
	// Decrease amount of cicles if it is too high
	if (amountOfCircles > 256) {
		console.log("Amount of cicles is too high, decrease this value to 256");
		amountOfCircles = 256;
		sizeOfCircles = 90 / amountOfCircles;
	}
	if (amountOfCircles <= 0)
		return;
	LockInput();
	await GenerateCircles(amountOfCircles, sizeOfCircles);
	if (amountOfCircles == 1) {
		unlockInput();
		return;
	}
	if (animaMode == 0)
		await Fast(amountOfCircles, sizeOfCircles);
	else if (animaMode == 1)
		await Swap(amountOfCircles, sizeOfCircles);
	else if (animaMode == 2)
		await Push(amountOfCircles, sizeOfCircles);
	unlockInput();
}

//	Generate a row circles with random color value
async function GenerateCircles(amountOfCircles, sizeOfCircles) {
	var	i = -1;

	while (circles.children[++i]) {
		circles.children[i].style.animationDuration = "500ms";
		circles.children[i].style.animationName = "disappear";
	}
	await sleep(500);
	while (circles.children[0]) {
		circles.removeAttribute('style');
		circles.removeChild(circles.lastChild);
	}
	i = amountOfCircles;
	while (--i >= 0) {
		var newCircle = document.createElement("div");
		newCircle.classList.add("circle");
		newCircle.id = i;
		newCircle.style.backgroundColor = getRandomColor();
		newCircle.style.width = sizeOfCircles + "vh";
		newCircle.style.height = sizeOfCircles + "vh";
		newCircle.style.left = (sizeOfCircles * i) + "vh";
		newCircle.style.animationDuration = speedMode + "ms";
		newCircle.style.opacity = 1;
		circles.appendChild(newCircle);
	}
	IndexCircles(amountOfCircles);
	await sleep(speedMode);
}

//	Amination of Sorting Fast
async function Fast(amountOfCircles, sizeOfCircles) {
	var i;

	// Move Circles to his high
	i = amountOfCircles;
	while (--i >= 0) {
		var curCircle = document.querySelector(".color_id" + i);

		curCircle.style.top = ((sizeOfCircles * i) - (sizeOfCircles / 2 * amountOfCircles) + sizeOfCircles / 2) + "vh";
		curCircle.style.animationName = "fast1";
	}
	await sleep(speedMode);

	// Move Circles to his index place
	i = amountOfCircles;
	while (--i >= 0) {
		var curCircle = document.querySelector(".color_id" + i);

		curCircle.animate([
			{ left: ((sizeOfCircles * curCircle.id) + "vh")},
			{ left: ((sizeOfCircles * i) + "vh")}
			], {
				duration: speedMode,
				iterations: 1,
				easing: "ease"
			});
		curCircle.style.left = (sizeOfCircles * i) + "vh";
	}
	await sleep(speedMode);

	// Move Circles down to row
	i = amountOfCircles;
	while (--i >= 0) {
		var curCircle = document.querySelector(".color_id" + i);

		curCircle.style.animationName = "fast2";
	}
	await sleep(speedMode);
	i = amountOfCircles;
	while (--i >= 0) {
		var curCircle = document.querySelector(".color_id" + i);

		curCircle.style.top = 0;
	}
}

async	function SwapTwo(one, two, sizeOfCircles) {
	var temp;
	var swapcool;

	temp = one.id;
	one.id = two.id;
	two.id = temp;
	if (one.id % 2 == 1)
		swapcool = 1;
	else
		swapcool = -1;
	one.animate([
			{ left: one.style.left },
			{ left: parseInt(one.style.left) + sizeOfCircles + "vh" }],
		{duration: speedMode, iterations: 1, easing: "ease-in-out"});
	one.animate([
			{ top: 0 },
			{ top: +swapcool * sizeOfCircles / 2 + "vh" }],
		{duration: speedMode / 2, iterations: 1, easing: "ease-out"});
	two.animate([
			{ left: two.style.left },
			{ left: parseInt(two.style.left) - sizeOfCircles + "vh" }],
		{duration: speedMode, iterations: 1, easing: "ease-in-out"});
	two.animate([
			{ top: 0 },
			{ top: -swapcool * sizeOfCircles / 2 + "vh" }],
		{duration: speedMode / 2, iterations: 1, easing: "ease-out"});
	two.style.left = parseFloat(two.style.left) - sizeOfCircles + "vh";
	two.style.top = -swapcool * sizeOfCircles / 2 + "vh";
	one.style.left = parseFloat(one.style.left) + sizeOfCircles + "vh";
	one.style.top = +swapcool * sizeOfCircles / 2 + "vh";
	await sleep (speedMode / 2);
	one.animate([
			{ top: one.style.top },
			{ top: 0 }],
		{duration: speedMode / 2, iterations: 1, easing: "ease-in"});
	one.style.top = 0;
	two.animate([
			{ top: two.style.top },
			{ top: 0 }],
		{duration: speedMode / 2, iterations: 1, easing: "ease-in"});
	two.style.top = 0;
	await sleep (speedMode / 2);
}

async function Swap(amountOfCircles, sizeOfCircles) {
	var i;

	i = -1;
	while (++i != amountOfCircles) {
		var curCircle = document.querySelector(".color_id" + i);

		//console.log(".color_id" + i);
		while (curCircle.id != i) {
			//console.log(curCircle.id + " != " + i);
			if (curCircle.id > i)
				await SwapTwo(document.getElementById(curCircle.id - 1) ,curCircle, sizeOfCircles);
			else if (curCircle.id < i)
				await SwapTwo(curCircle, document.getElementById(curCircle.id + 1), sizeOfCircles);
		}
	}
}

async function Push(amountOfCircles, sizeOfCircles) {
	var i;

	i = -1;
	if (amountOfCircles == 2)
		return;
	while (++i != amountOfCircles) {
		circles.children[i].animate([
			{ top: 0 },
			{ top: sizeOfCircles + "vh" }],
		{duration: speedMode / 2, iterations: 1, easing: "ease"});
		await sleep(speedMode / amountOfCircles);
		circles.children[i].style.top = sizeOfCircles + "vh";
	}
	await sleep(speedMode / 2);
	i = -1;
	while (++i != amountOfCircles) {
		var curCircle = document.querySelector(".color_id" + i);

		curCircle.animate([
			{ top: sizeOfCircles + "vh" },
			{ top: 0 }],
		{duration: speedMode / 3, iterations: 1, easing: "ease"});
		curCircle.style.top = 0;
		await sleep(speedMode / 3);
		curCircle.animate([
			{ left: curCircle.style.left },
			{ left: i * sizeOfCircles + "vh" }],
		{duration: speedMode / 3, iterations: 1, easing: "ease"});
		curCircle.style.left = i * sizeOfCircles + "vh";
		await sleep(speedMode / 3);
		curCircle.animate([
			{ top: 0 },
			{ top: -sizeOfCircles + "vh" }],
		{duration: speedMode / 3, iterations: 1, easing: "ease"});
		curCircle.style.top = -sizeOfCircles + "vh";
		await sleep(speedMode / 3);
	}
	await sleep(speedMode / 2);
	i = -1;
	while (++i != amountOfCircles) {
		circles.children[i].animate([
			{ top: -sizeOfCircles + "vh" },
			{ top: 0 }],
		{duration: speedMode / 2, iterations: 1, easing: "ease"});
		await sleep(speedMode / amountOfCircles);
		circles.children[i].style.top = 0;
	}
	await sleep(speedMode / 2);
}

// Return Random Color With Using color mode
function getRandomColor() {
	var color;

	if (colorMode == 0)
		color = Math.floor(Math.random() * 16777216).toString(16);
	if (colorMode == 1) {
		color = Math.floor(Math.random() * 256).toString(16);
		while (color.length != 2)
			color = "0" + color ;
		color = color + color + color;
	}
	if (colorMode == 2) {
		color = Math.floor(Math.random() * 256).toString(16) + "0000";
	}
	if (colorMode == 3)
		color = Math.floor(Math.random() * 256).toString(16) + "00";
	if (colorMode == 4)
		color = Math.floor(Math.random() * 256).toString(16);
	while (color.length != 6) {
		color = "0" + color ;
	}
	color = "#" + color;
	//console.log(color);
	return (color);
}
