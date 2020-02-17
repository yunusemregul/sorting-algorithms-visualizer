// Generates a random number
function randomNumber(min=1, max=50)
{
	return Math.floor(Math.random() * max) + min;
}

// https://stackoverflow.com/a/5650012/12734824
function mapRange(value, low1, high1, low2, high2) 
{
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

export {randomNumber, mapRange};