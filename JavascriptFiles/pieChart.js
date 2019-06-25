/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Final project
Context: This is the stacked pie chart class. In this class the stacked pie
         chart is created.
******************************************************************************/
function pieChart(data) {
    // get margins from container
    var margins = getMargins(".containerGraph3")

    var margin = 150;
    var padding = 5;

    // format data
    var formatedData = data.values

    // get the percentages for the piechart
    var percentageFailed = ((formatedData.Gezakt / (formatedData.Geslaagd + formatedData.Gezakt)) * 100).toFixed(1);
    var percentagePassed = ((formatedData.Geslaagd / (formatedData.Geslaagd + formatedData.Gezakt)) * 100).toFixed(1);

    // create svg element
    const svg = d3.select(".containerGraph3")
                  .append("svg")
                  .attr("width", margins.width)
                  .attr("height", margins.height)
                  .attr("class", "pieSVG")
                  .append("g")
                  .attr("transform", "translate(" + margins.width / 2 + "," + margins.height / 2 + ")")

    // radius of the piechart
    var radius = (Math.min(margins.width, margins.height) / 2 - margin)

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

    // create the pie chart
    svg.selectAll('pie')
       .data(layout)
       .enter()
       .append('path')
       .attr('d', arcGenerator)
       .attr('fill', function(d) { return(color(d.data.key)) })
       .on("mouseenter", handleMouseOverPie)
       .on("mouseout", handleMouseOutPie)


    // ############################ SECOND PIE ##############################
    // radius of the piechart
    var secondRadius = radius + 100

    // set the color scale
    var secondColor = d3.scaleOrdinal()
                        .domain(formatedData)
                        .range(["#41B3A3", "#E27D60"])

    // build arc
    var arcGenerator2 = d3.arc()
                          .innerRadius(radius + padding)
                          .outerRadius(secondRadius)

    // make pie chart
    svg.selectAll('pie2')
       .data(layout)
       .enter()
       .append('path')
       .attr('d', arcGenerator2)
       .attr('fill', function(d) { return(secondColor(d.data.key)) })
       .attr("class", "pathPie2")
       .on("mouseenter", handleMouseOverPie)
       .on("mouseout", handleMouseOutPie)

    // append passed or failed text
    svg.selectAll("pie2")
       .data(layout)
       .enter()
       .append('text')
       .attr("class", "pieText")
       .text(function(d){ return d.data.key })
       .attr("transform", function(d) { return "translate(" + arcGenerator2.centroid(d) + ")";  })
       .style("text-anchor", "middle")
       .style("font-size", 17)
       .style('fill', 'white')
       .attr("font-family", "Arial")

    // append "landelijk" text
    svg.append('text')
       .text("Landelijk")
       .attr("transform", "translate(0,20)")
       .style("text-anchor", "middle")
       .style("font-size", 17)
       .style('fill', 'white')
       .attr("font-family", "Arial")

    // append "gemiddelde" text
    svg.append('text')
       .text("gemiddelde")
       .attr("transform", "translate(0,40)")
       .style("text-anchor", "middle")
       .style("font-size", 17)
       .style('fill', 'white')
       .attr("font-family", "Arial")

      // this function creates a arc path for text
      function arcSVG(mx0, my0, r, larc, sweep, mx1, my1) {
          return 'M'+mx0+','+my0+' A'+r+','+r+' 0 '+larc+','+sweep+' '+mx1+','+my1;
      }

      // select g element
      var g = d3.select(".containerGraph3")
                  .select("svg")
                  .select("g")

      // get radius
      var r = margins.height/2 - margin/2 + 36;

      // create path for title
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

    // this function creates a mouseover event for the piechart
    function handleMouseOverPie() {
       // remove old mouse event elements
       svg.selectAll(".percentage").remove();

       // get margins from container
       var margins = getMargins(".containerGraph3")

       // select this item
       d3.select(this)
         .attr("stroke", "white")
         .style("stroke-width", "3px")
         .style("stroke-opacity", 0.6)

       // append text to the side of the pie with the percentages
       svg.append("text")
          .attr("class", "percentage")
          .text("Geslaagd: " + percentagePassed + "%")
          .attr("x", margins.width / 5)
          .attr("y", -margins.height / 2.3)
          .attr("font-size", 24)
          .attr("font-family", "Arial")
          .attr("fill", "white")
          .transition().duration(200)
          .attr("opacity", 0.9)

       // append text
       svg.append("text")
          .attr("class", "percentage")
          .text("Gezakt: " + percentageFailed + "%")
          .attr("x", margins.width / 5)
          .attr("y", -margins.height / 2.3+ 30)
          .attr("font-size", 24)
          .attr("font-family", "Arial")
          .attr("fill", "white")
          .transition().duration(200)
          .attr("opacity", 0.9)
    }

    // this function creates a mouse event
    function handleMouseOutPie() {
        // removes stroke
        d3.select(this)
          .attr("stroke", "none")

        // fade out text
        svg.selectAll(".percentage")
           .transition().duration(500)
           .attr("opacity", 0)
           .remove()
    }
}
