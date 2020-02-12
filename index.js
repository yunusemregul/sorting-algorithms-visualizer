var svg = d3.select('svg');

var array = []; // Sample array

var rectCount; // Total rect count = array.length
var gap; // Gap between rects
var x, y; // x, y of graph
var rectW; // Width of rects
var tl; // Tall coefficient for rects
var totalW; // Total width of the graph

generateVariables(); // Generate initial values

// Generates a random number
function randomNumber()
{
	return Math.floor(Math.random() * 50) + 1;
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
	var text = '[' + array.join(', ') + ']';
	const regex = /\d+/gm;
	text = text.replace(regex, '<span class="input" contenteditable="true">$&</span>');
	$('#customArray').children('span.disabled').html(text);

	// size field
	$('#size').val(array.length); // Set value of size input
}

// Parses inputs and updates the chart
function parseInputs()
{
	var text = $('#customArray').children('span.disabled').html();
	const regex = /\D+/gm;
	text = text.replace(regex, ' ')
		.split(' ')
		.map(function (x)
		{
			return parseInt(x, 10);
		})
		.filter(function (val)
		{
			return !Number.isNaN(val);
		});
	array = text;

	var sizeVal = $('#size').val();
	console.log(sizeVal);
	console.log(array.length);

	if (sizeVal != array.length)
	{
		if (sizeVal > array.length)
		{
			for (var i = 1; i < sizeVal - array.length; i++)
			{
				array = array.push(randomNumber());
			}
		}
		else
		{
			for (var i = 1; i < array.length - sizeVal; i++)
				array.pop();
		}
	}
	updateChart();
}

// Updates the chart based on the variable 'array'
function updateChart()
{
	generateVariables();
	generateInputFields();

	var barChart = svg.selectAll('rect').data(array);
	barChart.exit().remove();
	barChart.enter()
		.append('rect')
		.attr('style', 'fill:#222;')
		.attr('width', rectW)
		.attr('height', function (d)
		{
			return d * tl;
		})
		.attr('transform', function (d, i)
		{
			var translate = [x + (rectW + gap) * i, y - d * tl];
			return 'translate(' + translate + ')';
		});
	barChart.transition()
		.duration(500)
		.attr('width', rectW)
		.attr('height', function (d)
		{
			return d * tl;
		})
		.attr('transform', function (d, i)
		{
			var translate = [x + (rectW + gap) * i, y - d * tl];
			return 'translate(' + translate + ')';
		});
}

// Generates a random array with the size input and updates the chart
function fillChartWithRandomArray()
{
	array = [];
	var current = 0;
	while (current < $('#size').val())
	{
		array[current] = randomNumber();
		current++;
	}
	updateChart();
}
$('#randomArray').click(fillChartWithRandomArray);
$('#generateArray').click(fillChartWithRandomArray);

$(document).on('focusout', '.input', function ()
{
	parseInputs();
});
$('#size').change(parseInputs);

$(document).on('keypress', '.input', function (e)
{
	return (e.which != 13) && (e.keyCode >= 48 && e.keyCode <= 57);
});

$(window).resize(function (event)
{
	updateChart();
});

$("#rect").mouseenter(function ()
{
	$(this).css("fill", "teal")
}).mouseout(function ()
{
	$(this).css("fill", "transparent")
})

updateChart();
