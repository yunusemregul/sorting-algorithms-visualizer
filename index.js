/*$('div[id^="nav"]').children('.button-big').click(function(){
  if($(this).attr('clicked')=='1')
  {
    $(this).parent().children(':not(:first)').fadeOut(200);
    $(this).attr('clicked', '0')
  }
  else {
    $(this).parent().children(':not(:first)').fadeIn(200);
    $(this).attr('clicked', '1');
  }
})*/

var wd;

var svg = d3.select('svg');
var array = [1,5,2,3,7,9,10,20,40];
var itemcount = array.length
var gap = 5;
updateWidth();
var totalwd = itemcount*wd+((itemcount-1)*gap);
var totaltl;
var tl = 10;
var x = window.innerWidth/2-totalwd/2;
var y = window.innerHeight/2+(Math.max.apply(null,array)*10)/2;

function updateWidth()
{
  wd = (window.innerWidth*(200/1920))*(7/itemcount)-((itemcount-1)*gap)/itemcount; // scale box width based on itemcount and screen width
  wd = Math.max(1,wd); // limit width to be minimum 1
}

function updateChart()
{
  itemcount = array.length;
  $('#customArray').children('input').val('['+array.join(', ')+']');
  $('#customArray').children('input').css('width',$('#customArray').children('input').val().length+1+'ch');
  updateWidth();
  var barChart = svg.selectAll('rect').data(array);
  barChart.exit().remove();
  barChart.enter()
    .append('rect')
    .attr('style','fill:#222;')
    .attr('width',wd)
    .attr('height',function(d){
      return d*tl;
    })
    .attr('transform',function(d,i){
      var translate = [x+(wd+gap)*i,y-d*tl];
      return 'translate('+translate+')';
    });
  barChart.transition()
    .duration(500)
    .attr('width',wd)
    .attr('height',function(d){
      return d*tl;
    })
    .attr('transform',function(d,i){
      var translate = [x+(wd+gap)*i,y-d*tl];
      return 'translate('+translate+')';
    });
}

$('#customArray').children('input').keypress(function() {
  $(this).css('width',$(this).val().length+3+'ch');
});

$('#randomArray').click(function(){
  array = [];
  var current = 0;
  while(current<$('#size').val())
  {
    array[current] = Math.floor(Math.random() * 50) + 1;
    current++;
  }
  updateChart();
})

$("#rect").mouseenter(function() {
  $(this).css("fill", "teal")
}).mouseout(function(){
  $(this).css("fill","transparent")
})

var barChart = svg.selectAll('rect')
  .data(array)
  .enter()
  .append('rect')
  .attr('style','fill:#222;')
  .attr('width',wd)
  .attr('height',function(d){
    return d*tl;
  })
  .attr('transform',function(d,i){
    var translate = [x+(wd+gap)*i,y-d*tl];
    return 'translate('+translate+')';
  })
