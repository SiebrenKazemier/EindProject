// #############################################################################
//                                   PIE CHART
// #############################################################################
function pieChart(data) {
    // get container width and height
    var selection = d3.select(".containerGraph3")
                    .node().getBoundingClientRect()

    var height = selection["height"]
    var width = selection["width"]

    var margin = 150;
    var padding = 5;

    // format data
    var formatedData = data.values

    // persentages
    var persentageFailed = ((formatedData.Gezakt / (formatedData.Geslaagd + formatedData.Gezakt)) * 100).toFixed(1);
    var persentagePassed = ((formatedData.Geslaagd / (formatedData.Geslaagd + formatedData.Gezakt)) * 100).toFixed(1);

    // make svg
    const svg = d3.select(".containerGraph3")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "pieSVG")
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    // radius of the piechart
    var radius = (Math.min(width, height) / 2 - margin)

    // set the color scale
    var color = d3.scaleOrdinal()
                  .domain(formatedData)
                  .range(["#85DCB2", "#E8A87C"])

    // create layout for the data
    var pie = d3.pie()
                .value(function(d) {return d.value; })

    var layout = pie(d3.entries(formatedData))

    // build arc
    var arcGenerator = d3.arc()
              .innerRadius(0)
              .outerRadius(radius)

    // make pie chart
    svg.selectAll('pie')
        .data(layout)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d) { return(color(d.data.key)) })
        .attr("stroke", "#7DC2AF")
        .style("stroke-width", "3px")
        .style("stroke-opacity", 1)
        .on("mouseenter", handleMouseOverPie)
        .on("mouseout", handleMouseOutPie)


    // ############################ SECOND PIE ##############################
    // format secondData
    var secondFormatedData = data.values

    // radius of the piechart
    var secondRadius = radius + 100

    // set the color scale
    var secondColor = d3.scaleOrdinal()
                  .domain(formatedData)
                  .range(["#41B3A3", "#E27D60"])

    // create layout for the data
    var secondPie = d3.pie()
                .value(function(d) {return d.value; })


    var secondLayout = pie(d3.entries(secondFormatedData))


    // build arc
    var arcGenerator2 = d3.arc()
              .innerRadius(radius + padding)
              .outerRadius(secondRadius)

    // make pie chart
    svg.selectAll('pie2')
        .data(secondLayout)
        .enter()
        .append('path')
        .attr('d', arcGenerator2)
        .attr('fill', function(d) { return(secondColor(d.data.key)) })
        .attr("stroke", "#7DC2AF")
        .attr("class", "pathPie2")
        .style("stroke-width", "3px")
        .style("stroke-opacity", 1)
        .on("mouseenter", handleMouseOverPie)
        .on("mouseout", handleMouseOutPie)

    // append text
    svg.selectAll("pie2")
      .data(secondLayout)
      .enter()
      .append('text')
      .attr("class", "pieText")
      .text(function(d){ return d.data.key })
      .attr("transform", function(d) { return "translate(" + arcGenerator2.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17)
      .style('fill', 'white')
      .attr("font-family", "Arial")

      // append text
      svg.append('text')
        .text("Landelijk")
        .attr("transform", "translate(0,20)")
        .style("text-anchor", "middle")
        .style("font-size", 17)
        .style('fill', 'white')
        .attr("font-family", "Arial")

    // append text
    svg.append('text')
      .text("gemiddelde")
      .attr("transform", "translate(0,40)")
      .style("text-anchor", "middle")
      .style("font-size", 17)
      .style('fill', 'white')
      .attr("font-family", "Arial")

      // append text to pieChart
      function arcSVG(mx0, my0, r, larc, sweep, mx1, my1) {
          return 'M'+mx0+','+my0+' A'+r+','+r+' 0 '+larc+','+sweep+' '+mx1+','+my1;
      }

      // select g element
      var g = d3.select(".containerGraph3")
                  .select("svg")
                  .select("g")

      // get radius
      var r = height/2 - margin/2 + 36;

      // create path
      g.append('path')
      .attr("transform", "translate(0,0)")
      .attr('d', arcSVG(-r, 0, r, 1, 1, r, 0))
      .attr('id', 'second-label-path-title')
      .attr("class", "secondTitleLabel")
      .style('fill', 'none')
      .style('stroke', 'none');

      // append text to path
      g.append('text')
       .append('textPath')
       .attr("class", "secondTitleLabel")
       .attr('xlink:href', '#second-label-path-title')
       .attr('startOffset', '16%')
       .style('font-size', '24px')
       .style('fill', 'white')
       .text("Percentage geslaagden en gezakten")
       .transition()
       .duration(1000)
       .attr("opacity", 1);

    function handleMouseOverPie() {
       // remove old elements
       svg.selectAll(".persentage").remove();

       // get container width and height
       var selection = d3.select(".containerGraph3")
                       .node().getBoundingClientRect()

       var height = selection["height"]
       var width = selection["width"]


       d3.select(this)
           .attr("stroke", "white")
           .style("stroke-width", "3px")
           .style("stroke-opacity", 0.6)

       // append text to the side of the pie
       svg.append("text")
       .attr("class", "persentage")
       .text("Geslaagd: " + persentagePassed + "%")
       .attr("x", width / 5)
       .attr("y", -height / 2.3)
       .transition().duration(200)
       .attr("opacity", 0.9).attr("opacity", 0.9)

       // append text
       svg.append("text")
       .attr("class", "persentage")
       .text("Gezakt: " + persentageFailed + "%")
       .attr("x", width / 5)
       .attr("y", -height / 2.3+ 30)
       .transition().duration(200)
       .attr("opacity", 0.9).attr("opacity", 0.9)

       svg.attr("font-size", 24)
           .attr("font-family", "Arial")
           .attr("color", "white")
    }


    function handleMouseOutPie() {
       d3.select(this)
           .attr("stroke", "#7DC2AF")
           .style("stroke-width", "3px")
           .style("stroke-opacity", 1)

       svg.selectAll(".persentage")
           .transition().duration(500)
           .attr("opacity", 0)
           .remove()
    }
}
