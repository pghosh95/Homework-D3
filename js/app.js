//Chart set up
var svgWidth = 700;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left:60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


//Create SVG wrapper and append onto chart
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    
var chartGroup = svg.append("g")
    .attr("transform", "translate(" +margin.left + "," + margin.top + ")")

//Create axes labels
svg.select("g").append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("transform", `translate(${width/2}, ${height+margin.right})`)
    .attr("text-anchor", "middle")
    .text("Poverty (%)");

svg.select("g").append("text")
    .attr("transform", `translate(${-margin.right}, ${height/2})rotate(-90)`)
    .attr("text-anchor", "middle")
    .text("Healthcare (%)");

 //Import data from csv
 d3.csv("assets/data/data.csv").then(function(healthData){

    healthData.forEach(function (data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

     //create scales
     var xScale = d3.scaleLinear()
         .domain([d3.min(healthData, d => (d.poverty *0.95)),d3.max(healthData, d=>(d.poverty *1.05))])
         .range([0, width]);

    var bottomAxis = d3.axisBottom(xScale);

     var yScale = d3.scaleLinear()
         .domain([0, d3.max(healthData, d => d.healthcare)])
         .range([height,0]);

    var leftAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);
   

     //create dots for plot
     var circleGroup = chartGroup.selectAll('circle')
        .data(healthData)
        .enter()

     circleGroup.append("circle")
         .attr("cx", function(d){ return xScale(d.poverty);})
         .attr("cy", function(d) {return yScale(d.healthcare);})
         .attr("r", 7)
         .attr("class", "stateCircle")

    //Add labels to dots
    circleGroup.append("text")
        .attr("dx", d => xScale(d.poverty))
        .attr("dy", d => yScale(d.healthcare - 0.1))
        .text(d => d.abbr)
        .attr("class", "stateText")
        .attr("font-size", 7)
});
