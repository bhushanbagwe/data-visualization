document.addEventListener('DOMContentLoaded', () => {
  var render = (selector, size, data) => {
    var margin = size.margin;
    var width = size.width - margin.left - margin.right;
    var height = size.height - margin.top - margin.bottom;
      
    var x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value))
      .range([0, width]);
    
    var y = d3.scaleBand()
      .domain(data.map(d => d.name))
      .rangeRound([0, height])
      .padding(0.2);
      
    var xAxis = d3.axisBottom(x)
      .tickSize(0);
    
    var yAxis = d3.axisLeft(y)
      .tickSize(0);
    
    var svg = d3.select(selector)
      .attr('width', size.width)
      .attr('height', size.height);
      
    var chart = svg.append('g')
      .attr('transform', `translate(${ margin.left }, ${ margin.top })`);
      
    var mouseOver = function handleMouseOver(d, i) {  
      d3.select(this).attr('fill', "#f37138");
    };  
    
    var mouseOut = function handleMouseOut(d, i) {  
      d3.select(this).attr('fill', "#768fa7");
    };      
    
    var bar = chart.selectAll('.bar')
      .data(data)
      .enter().append('rect')
        .attr('class', d => `bar ${ d.value < 0 ? 'negative': 'positive' }`)
        .attr('x', d => x(Math.min(0, d.value)))
        .attr('y', d => y(d.name))
        .attr('width', d => Math.abs(x(d.value) - x(0)))
        .attr('height', y.bandwidth())
        .attr('fill', "#768fa7")
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut);

    chart.append('g')
      .attr('transform', `translate(0, ${ height })`)
      .attr('class', 'axis x')
      .call(xAxis);
      
    chart.append('g')
      .attr('class', 'axis y')
      .attr('transform', `translate(${ x(-25) }, 0)`)
      .call(yAxis);
  };
  
  fetch('data.json')
    .then(data => data.json())
    .then(data => {
      var settings = {
        width: 500,
        height: 300,
        margin: {
          top: 20,
          right: 20,
          bottom: 30,
          left: 100
        }
      };
      
      render('#chart', settings, data);
    });
});