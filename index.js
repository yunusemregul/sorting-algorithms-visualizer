import * as selectionsort from '/algorithms/selectionsort.js';

let svg = d3.select('svg');

let array = []; // Main array

let rectCount; // Total rect count = array.length
let gap; // Gap between rects
let x, y; // x, y of graph
let rectW; // Width of rects
let tl; // Tall coefficient for rects
let totalW; // Total width of the graph

generateVariables(); // Generate initial values

// Generates a random number
function randomNumber(min=1, max=50)
{
	return Math.floor(Math.random() * max) + min;
}

// Generates variables like a single rect's width on chart, chart's total width, charts X position and so on..
function generateVariables()
{
	rectCount = array.length; // I like it this way even tho it is a bit stupid
	gap = 2;	
	rectW =
		(window.innerWidth * (200 / 1920)) * (7 / rectCount)
		- ((rectCount - 1) * gap) / rectCount; // Scale box width to rectCount and screen width
	rectW = Math.max(2, rectW); // Limit width with minimum value

	totalW = rectCount * rectW + ((rectCount - 1) * gap);
	x = window.innerWidth / 2 - totalW / 2;
	y = window.innerHeight / 1.25;
	tl = window.innerHeight / 2 / Math.max(...array);
}

// Generates the input fields to be equal to the chart
function generateInputFields()
{
	// array field
	let text = '[' + array.join(', ') + ']';
	const regex = /\d+/gm;
	text = text.replace(regex, '<span class="input" contenteditable="true">$&</span>');
	$('#customArray').children('span.disabled').html(text);

	// size field
	$('#size').val(array.length); // Set value of size input
}

// Parses inputs and updates the chart
function parseInputs()
{
	let text = $('#customArray').children('span.disabled').html();
	const regex = /\D+/gm;
	text = text.replace(regex, ' ')
		.split(' ')
		.map(x => parseInt(x, 10))
		.filter(val => !Number.isNaN(val));
	array = text;

	const sizeVal = $('#size').val();

	if (sizeVal != array.length)
	{
		let tempArrayLength = array.length;
		
		if (sizeVal > array.length)
			for (let i = 1; i <= sizeVal - tempArrayLength; i++)
				array.push(randomNumber());				
		else
			for (let i = 1; i <= tempArrayLength - sizeVal; i++)
				array.pop();
	}
	updateChart();
}

// Updates the chart based on the variable 'array'
function updateChart()
{
	generateVariables();
	generateInputFields();

	let barChart = svg.selectAll('rect').data(array);
	barChart.exit().remove();

	function transform(d, i)
	{
		let translate = [x + (rectW + gap) * i, y - d * tl];
		return 'translate(' + translate + ')';
	}

	barChart.enter()
		.append('rect')
		.attr('style', 'fill:#222;')
		.attr('width', rectW)
		.attr('height', d => d * tl)
		.attr('transform', transform);
	barChart.transition()
		.duration(500)
		.attr('width', rectW)
		.attr('height', d => d * tl)
		.attr('transform', transform);
}

// Generates a random array with the size input and updates the chart
function fillChartWithRandomArray(size)
{
	array = [];
	let current = 0;
	size = ((size==null || typeof(size)!='number') ? $('#size').val() : size);
	
	while (current < size)
	{
		array[current] = randomNumber();
		current++;
	}
	updateChart();
}
$('#randomArray').click(fillChartWithRandomArray);
$('#generateArray').click(fillChartWithRandomArray);

$(document).on('focusout', '.input', parseInputs);
$('#size').change(parseInputs);

// Block entering non digit inputs to array input
$(document).on('keypress', '.input', function (e)
{
	return (e.keyCode >= 48 && e.keyCode <= 57);
});

$(window).resize(updateChart);

// Initial
fillChartWithRandomArray(randomNumber(5,15));
updateChart();