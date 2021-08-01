const btnstart	= document.querySelector(".button");
const btnfast	= document.querySelector(".select_fast");
const btnpush	= document.querySelector(".select_push");
const btnswap	= document.querySelector(".select_swap");
const circles	= document.querySelector(".circles");
const circle	= document.querySelector(".circle");

btnstart.addEventListener("click", Start);

function sleep(milliseconds) {  
	return new Promise(resolve => setTimeout(resolve, milliseconds));  
} 

async function Start(){
	const	amountOfCircles = document.querySelector(".input").value;
	const	sizeOfCircles = 100 / amountOfCircles;
	var	i = amountOfCircles;

	while (circles.children[0]) {
		circles.removeAttribute('style');
		circles.removeChild(circles.lastChild);
	}
	while (--i >= 0) {
		var newCircle = document.createElement("div");
		newCircle.classList.add("circle");
		newCircle.classList.add("circle_id" + i);
		newCircle.style.backgroundColor = "#" + getRandomColor();
		newCircle.style.width = sizeOfCircles + "%";
		newCircle.style.height = sizeOfCircles + "%";
		newCircle.style.left = (sizeOfCircles * i) + "%";
		newCircle.style.opacity = 1;
		circles.appendChild(newCircle);
	}
	await sleep(2000);
	i = amountOfCircles;
	while (--i >= 0) {
		var curCircle = getSmallestColor(i);
		curCircle.style.top = sizeOfCircles * 0.66 * i - 50 + "vh";
		curCircle.style.animation-name: "fast1";
	}
}

function getSmallestColor(object){
	return (circles.children[object]);
}

function getRandomColor() {
	return Math.floor(Math.random()*16777215).toString(16);
}
