const btnstart	= document.querySelector(".button");
const btnfast	= document.querySelector(".select_fast");
const btnpush	= document.querySelector(".select_push");
const btnswap	= document.querySelector(".select_swap");
const circles	= document.querySelector(".circles");
const input = document.getElementById('amount');
var   isAnimating = 1;
var		animationMode = 0;
SetAnimationModeFast();

//		Fast - 0
//		Push - 1
//		Swap - 2

function sleep(milliseconds) {  
	return new Promise(resolve => setTimeout(resolve, milliseconds));  
}

setTimeout(() => {  isAnimating = 0; }, 1000);

btnstart.addEventListener("click", Start);
btnfast.addEventListener("click", SetAnimationModeFast);
btnpush.addEventListener("click", SetAnimationModePush);
btnswap.addEventListener("click", SetAnimationModeSwap);

function SetAnimationModeFast() {
	btnswap.style.backgroundColor = "white";
	btnpush.style.backgroundColor = "white";
	btnfast.style.backgroundColor = "gray";
	animationMode = 0;
};

function SetAnimationModePush() {
	btnfast.style.backgroundColor = "white";
	btnswap.style.backgroundColor = "white";
	btnpush.style.backgroundColor = "gray";
	animationMode = 1;
};

function SetAnimationModeSwap() {
	btnfast.style.backgroundColor = "white";
	btnpush.style.backgroundColor = "white";
	btnswap.style.backgroundColor = "gray";
	animationMode = 2;
};

// Converts an rgb() value returned from Jquery
// into an integer value for comparison.
function rgbToInt(color) {
  var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
  if (digits == null)
  	return (16777216);
  var red = parseInt(digits[2]);
  var green = parseInt(digits[3]);
  var blue = parseInt(digits[4]);
  return (parseInt((blue | (green << 8) | (red << 16)), 10));
};

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

async function Start() {
	Fast();
}

async function Fast(){
	var	amountOfCircles = document.querySelector(".input").value;
	var	sizeOfCircles = 90 / amountOfCircles;
	var	i = -1;

	console.clear();
	if (isAnimating == 1)
		return;
	if (amountOfCircles == 0)
		return;
	if (amountOfCircles > 256) {
		console.log("Amount Of cicles is too high, decrease this value to 256");
		amountOfCircles = 256;
		sizeOfCircles = 90 / amountOfCircles;
	}
	input.readOnly = true;
	btnstart.disabled = true;
	input.style.backgroundColor = "gray";
	btnstart.style.backgroundColor = "gray";
	isAnimating = 1;
	while (circles.children[++i]) {
		circles.children[i].style.animationDuration = "0.5s";
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
		newCircle.style.animationDuration = "1.5s";
		newCircle.style.opacity = 1;
		circles.appendChild(newCircle);
	}
	IndexCircles(amountOfCircles);
	await sleep(1500);
	i = amountOfCircles;
	while (--i >= 0) {
		var curCircle = document.querySelector(".color_id" + i);

		curCircle.style.top = ((sizeOfCircles * i) - (sizeOfCircles / 2 * amountOfCircles) + sizeOfCircles / 2) + "vh"
		curCircle.style.animationName = "fast1";
	}
	await sleep(1500);
	i = amountOfCircles;
	while (--i >= 0) {
		var curCircle = document.querySelector(".color_id" + i);

		curCircle.animate([
			{ left: ((sizeOfCircles * curCircle.id) + "vh")},
			{ left: ((sizeOfCircles * i) + "vh")}
			], {
				duration: 1500,
				iterations: 1,
				easing: "ease"
			});
		curCircle.style.left = (sizeOfCircles * i) + "vh";
	}
	await sleep(1500);
	i = amountOfCircles;
	while (--i >= 0) {
		var curCircle = document.querySelector(".color_id" + i);

		curCircle.style.animationName = "fast2";
	}
	await sleep(1500);
	i = amountOfCircles;
	while (--i >= 0) {
		var curCircle = document.querySelector(".color_id" + i);

		curCircle.style.top = 0;
	}
	input.readOnly = false;
	btnstart.disabled = false;
	btnstart.style.backgroundColor = "white";
	input.style.backgroundColor = "white";
	isAnimating = 0;
}

function getRandomColor() {
	//console.log(Math.floor(Math.random() * 16777216).toString(16));
	//console.log((Math.floor(Math.random() * 256) << 16).toString(16));
	var color = Math.floor(Math.random() * 16777216).toString(16);
	while (color.length != 6) {
		color = "0" + color ;
	}
	color = "#" + color;
	//console.log(color);
	return (color);
}
