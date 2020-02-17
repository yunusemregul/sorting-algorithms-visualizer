import * as selectionsort from './algorithms/selectionsort.js';
import * as bubblesort from './algorithms/bubblesort.js';
import * as actionutils from './actions.js';
import {randomNumber, mapRange} from './utils.js';

let actions; // Variable that will hold actions returned from selected sorting algorithm
let algorithms = [];
let selectedAlgorithm;

function addAlgorithm(alg)
{
	algorithms[alg.name] = alg.sort;
	$('#navbar-algorithms')
		.append('<a href="#" class="button-medium">'+alg.name+'</a> ');
}

addAlgorithm(selectionsort);
addAlgorithm(bubblesort);

$('#navbar-algorithms').children('.button-medium')
	.click(function()
	{
		if(isSorting)
			return;
		
		selectedAlgorithm = algorithms[this.text];
		$('#navbar-algorithms').children('.button-medium').removeClass('button-hovered');
		$(this).addClass('button-hovered');
	});

let svg = d3.select('svg');

let array = []; // Main array that will hold numbers
let colors = {
	compare: '#8E44AD',
	swap: '#27AE60'
};

let rectCount; // Total rect count = array.length
let gap; // Gap between rects
let x, y; // x, y of graph
let rectW; // Width of rects
let tl; // Tall coefficient for rects
let totalW; // Total width of the graph

let timeTaken = 100; // Time taken by each action (swapping, comparing) in millis
let isSorting = false;

generateVariables(); // Generate initial values

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
	text = text.replace(regex, '<span'+(isSorting ? '': ' class="input" contentEditable="true"')+'>$&</span>');
	$('#customArray').children('span.disabled').html(text);

	// size field
	$('#size').val(array.length); // Set value of size input
}

function parseArrayInput()
{
	if(isSorting)
		return;

	let text = $('#customArray').children('span.disabled').html();
	const regex = /\D+/gm;
	text = text.replace(regex, ' ')
		.split(' ')
		.map(x => parseInt(x, 10))
		.filter(val => !Number.isNaN(val));
	array = text;

	updateChart();
}

function parseSizeInput()
{
	if(isSorting)
		return;

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

		updateChart();
	}		
}

function parseSpeedInput()
{
	let speed = parseInt($('#speed').val());
	timeTaken = mapRange(speed, 1, 10, 500, 50);
}

// Updates the chart with the array data
function updateChart()
{
	generateVariables();
	generateInputFields();

	let parents = svg.selectAll('g').data(array);
	parents.exit().remove();

	let enteredParents = parents.enter()
		.append('g')
		.attr('id',(d,i)=>'g'+i);

	function barchartTransform(d, i)
	{
		let translate = [x + (rectW + gap) * i, y - d * tl];
		return 'translate(' + translate + ')';
	}

	function textsTransform(d, i)
	{
		let translate = [x + (rectW + gap) * i + rectW/2 - this.getBBox().width/2, y+16];
		return 'translate(' + translate + ')';		
	}	

	enteredParents.append('rect')
	.attr('fill','#222')
	.attr('width', rectW)
	.attr('height', d => d * tl)
	.attr('transform', barchartTransform);

	enteredParents.append('text')
	.text(d => d)
	.attr('fill','#ddd')	
	.attr('transform', textsTransform);
	
	let rects = svg.selectAll('rect').data(array);
	let texts = svg.selectAll('text').data(array);

	rects.transition()
		.duration(timeTaken)
		.attr('width', rectW)
		.attr('height', d => d * tl)
		.attr('transform', barchartTransform);

	texts.transition()
		.duration(timeTaken)
		.text(d => d)
		.attr('transform', textsTransform)
		.attr('display', () => rectW<12 ? 'none' : '');

}

// Generates a random array with the size parameter and updates the chart
function fillChartWithRandomArray(size)
{
	if(isSorting)
		return;

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

function handleActions()
{
	updateChart();
	
	// no action left
	if(actions.length==0)
	{
		stopSort();
		return;
	}

	let action = actions[0];

	if(action.arguments)
	{
		var a = d3.select('#g'+action.arguments[0]).select('rect');
		var aColor = a.attr('fill');
		var b = d3.select('#g'+action.arguments[1]).select('rect');
		var bColor = b.attr('fill');
	}
	
	if(action.operation=='compare')
	{
		a.attr('fill',colors.compare);
		b.attr('fill',colors.compare);
	}
	if(action.operation=='swap')
	{
		/*
			TODO:
				Add move animation
		*/
		actionutils.swap(array, action.arguments[0], action.arguments[1]);
		
		a.attr('fill',colors.swap);
		b.attr('fill',colors.swap);
	}

	setTimeout(function(){
		a.attr('fill',aColor);
		b.attr('fill',bColor);
	}, timeTaken);

	actions.shift();
	setTimeout(handleActions, timeTaken);
}

function stopSort()
{
	isSorting = false;
	$('#sort').text('~ Sort ~');
	$('span.disabled').children().attr('contentEditable',true);
	$('span.disabled').children().addClass('input');

	actions = [];
}

function startSort()
{
	isSorting = true;
	$('#sort').text('Stop');
	$('span.disabled').children().attr('contentEditable',false);
	$('span.disabled').children().removeClass('input');	

	actions = selectedAlgorithm(array);
	handleActions();
}

$('#sort').click(function()
{
	if(isSorting)
		stopSort();
	else
		startSort();
});

$(document).on('focusout', '.input', parseArrayInput);
$('#size').change(parseSizeInput);
$('#speed').change(parseSpeedInput);

// Block entering non digit inputs to array input
$(document).on('keypress', '.input', function (e)
{
	if(e.keyCode==13)
		parseArrayInput();

	return (e.keyCode >= 48 && e.keyCode <= 57);
});

$(window).resize(updateChart);

// Initial
$(function()
{
	fillChartWithRandomArray(randomNumber(5,15));
	updateChart();
	$('#navbar-algorithms').children('.button-medium').first().click();	
});