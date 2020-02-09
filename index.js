var rectW;

var svg = d3.select('svg');

var array = [1,5,2,3,7,9,10,20,40];
$('#customSize').children('input').val(array.length);

var rectCount = array.length
var gap = 5;
updateWidth();
var totalW = rectCount*rectW+((rectCount-1)*gap);
var totalT;
var tl = 10;
var x = window.innerWidth/2-totalW/2;
var y = window.innerHeight/1.25;

function updateWidth()
{
  rectCount = array.length;
  gap = 2;
  rectW = (window.innerWidth*(200/1920))*(7/rectCount)-((rectCount-1)*gap)/rectCount; // scale box width based on rectCount and screen width
  rectW = Math.max(2,rectW); // limit width to be minimum 1

  totalW = rectCount*rectW+((rectCount-1)*gap);
  x = window.innerWidth/2-totalW/2;
}

function updateCustomArrayInput()
{
  var text = '['+array.join(', ')+']';
  const regex = /\d+/gm;
  text = text.replace(regex,'<span class="input" contenteditable="true">$&</span>');
  $('#customArray').children('span.disabled').html(text);
}

function updateArrayWithCustomInput()
{
  var text = $('#customArray').children('span.disabled').html();
  const regex = /\D+/gm;
  text = text.replace(regex,' ')
    .split(' ')
    .map(function(x){
      return parseInt(x,10);
    })
    .filter(function(val){
      return !Number.isNaN(val);
    });
  array = text;
  $('#size').val(array.length);
  updateChart();
}

function updateChart()
{
  updateWidth();
  updateCustomArrayInput();
  var barChart = svg.selectAll('rect').data(array);
  barChart.exit().remove();
  barChart.enter()
    .append('rect')
    .attr('style','fill:#222;')
    .attr('width',rectW)
    .attr('height',function(d){
      return d*tl;
    })
    .attr('transform',function(d,i){
      var translate = [x+(rectW+gap)*i,y-d*tl];
      return 'translate('+translate+')';
    });
  barChart.transition()
    .duration(500)
    .attr('width',rectW)
    .attr('height',function(d){
      return d*tl;
    })
    .attr('transform',function(d,i){
      var translate = [x+(rectW+gap)*i,y-d*tl];
      return 'translate('+translate+')';
    });
}

function fillChartWithRandomArray()
{
    array = [];
    var current = 0;
    while(current<$('#size').val())
    {
      array[current] = Math.floor(Math.random() * 50) + 1;
      current++;
    }
    updateChart();
}
$('#randomArray').click(fillChartWithRandomArray);
$('#generateArray').click(fillChartWithRandomArray);

$(document).on('focusout', '.input', function(){
  updateArrayWithCustomInput();
});
$(document).on('keypress', '.input', function(e){
    return (e.which != 13) && (e.keyCode >= 48 && e.keyCode <= 57);
});

$("#rect").mouseenter(function() {
  $(this).css("fill", "teal")
}).mouseout(function(){
  $(this).css("fill","transparent")
})

updateChart();
