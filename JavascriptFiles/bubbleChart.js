/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Final project
Context: This is the bubble chart class. In this class the bubble chart
         is created.
******************************************************************************/

// function that creates the chart
function bubblechart(data, secondBarData, updatePieData, circleData,  pieData, barData) {
    // get margins from container
    var margins = getMargins("#graph1")

    // select the svg from the bubbleChart
    var bubbleSVG = d3.select("svg")

    // set the color scale
    var color = d3.scaleOrdinal()
                  .domain(function(d) { return d.province})
                  .range(["#E27D60", "#37B5FF", "#E8A87C", "#C38D9E", "#FAC2C1", "#85DCB2", "#41B3A3", "F9FF49", "B5F569" ,"#EFE2BA", "#F4976C", "63FF53"])

    // Initialize the circle: all located at the center of the svg area
    var bubbleNode = bubbleSVG.select("g")
                              .selectAll("circle")
                              .data(data)
                              .enter()
                              .append("circle")
                              .attr("class", "bubble")
                              .attr("id", function(d) {
                                    var name = d.name
                                    name = name.replace(',', '');
                                    name = name.replace(/\s/g, '_');
                                    return name })
                              .style("fill", function(d) { return color(d.province)})
                              .attr("cx", margins.width / 2)
                              .attr("cy", margins.height / 2)

    // transition for the bubbles when created
    bubbleNode.transition()
              .duration(750)
              .attr("r", function(d) { return d.value / (margins.width / 14) })

    // create a tooltip
    var tooltip = bubbleSVG.append("g")
                           .attr("id", "tooltip")
                           .style("display", "none");

    // append interaction to the bubbles
    bubbleNode.call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended))
              .on("mouseenter", handleMouseEnterBubble)
              .on("mouseout", handleMouseOutBubble)
              .on("mouseover", function(d) {
                  tooltip.style("display", null);
                  // append text
                  tooltip.select("#tooltipText1").text(d.name);
                  tooltip.select("#tooltipText2").text(d.value + " kandidaten");
                  // changes width of rect
                  tooltip.select("rect")
                         .attr("width", function () {
                              // check if name "kandidaten" is longer
                              if (d.name.length < 14) {
                                  return (30 + 14 * 6);
                              }
                              else {
                                  return (30 + d.name.length * 6);
                              }
                        })
            })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] + 10;
                var yPosition = d3.mouse(this)[1] - 60;

                // change position corresponding to the possition of the mouse cursor
                if (xPosition > margins.width - (margins.width/4)) {
                    xPosition = xPosition - 50 - d.name.length * 6;
                }
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            });


    // add tooltip form as rect
    tooltip.append("rect")
           .attr("height", 36)
           .attr("fill", "white")
           .style("opacity", 0.3);

    // add tooltip text for school names
    tooltip.append("text")
           .attr("id", "tooltipText1")
           .attr("x", 10)
           .attr("dy", "1.2em")
           .attr("fill", "white")
           .attr("font-size", "12px")
           .attr("font-weight", "bold");

    // add tooltip text for amount
    tooltip.append("text")
           .attr("id", "tooltipText2")
           .attr("x", 10)
           .attr("dy", "2.6em")
           .attr("fill", "white")
           .attr("font-size", "12px")
           .attr("font-weight", "bold");

    // select information
    var information = d3.select("#info")

    // make invis circle for a better hover effect
    information.append("circle")
               .attr("r", 14)
               .attr("transform", "translate(3,-9)")
               .attr("opacity", 0)
               .attr("id", "invisCircle")
               .on("mouseenter", handleMouseEnterInfo2)
               .on("mouseleave", handleMouseLeaveInfo);

    // make a scale for the sort of the bubbles
    var ordinalScale = d3.scaleOrdinal()
        .domain(function(d) { return d.province})
        .range([(1/12 * margins.width), (2/12 * margins.width),
        (3/13 * margins.width), (4/13 * margins.width), (5/13 * margins.width),
        (6/13 * margins.width), (7/13 * margins.width), (8/13 * margins.width),
        (9/13 * margins.width), (10/13 * margins.width),
        (11/13 * margins.width) , (12/13 * margins.width)]);

    // create a simulation for the bubbles
    var simulation = d3.forceSimulation(data)
      .force('center', d3.forceCenter(margins.width / 2, margins.height / 2))
      .force('collision', d3.forceCollide().radius(function(d) {
        return d.value / (margins.width / 14);
    }))
      .on('tick', ticked);

    // create a movement function for bubbles
    function ticked() {
       var u = d3.select('#graph1')
                 .selectAll('.bubble')
                 .data(data)

       u.enter()
        .append('circle')
        .attr("class", "bubble")
        .merge(u)
        .attr('cx', function(d) {
           return d.x
        })
        .attr('cy', function(d) {
           return d.y
        })

       u.exit().remove()
     }

    // sort the bubble chart
    sortBubble(data)
    // update groupedBarChart
    updateElements2(secondBarData, updatePieData);
    // change bubble chart to circular chart
    changeGraph2(circleData, data, secondBarData)

    // change bubble chart to circle chart
    function changeGraph2(circleData, bubbleData, secondBarData) {
        d3.select("#toCircle").on("click", function() {
            var graph = this.getAttribute("value");
            var active = this.getAttribute("class");
            var duration = 750;

            // check if button is pressed
            if (active != "btn btn-info btn-secondary active") {
                // stop simulation
                simulation.stop();

                // remove sort button
                var button = d3.select("#sortButton")
                button.remove()

                // remove search button
                var searchButton = d3.select("#search")
                searchButton.remove()

                // select all circles
                var circleRemove = d3.selectAll(".bubble")

                // transition for all removing
                circleRemove.transition()
                            .duration(duration)
                            .style("opacity", 0)

                // remove text with callback function
                var textLabel = d3.select("#label-path-title-text")
                                  .transition()
                                  .duration(duration)
                                  .style("opacity", 0)
                                  .on("end", bubbleCalback)

                // remove second title from bargraph
                var secondTitle = d3.select(".secondLineTitle")
                                    .remove()

                // create callback function
                function bubbleCalback() {
                    // remove all circles
                    circleRemove.remove()

                    // remove text and path
                    var text = d3.select("#graph1")

                    text.selectAll("text")
                        .remove()

                    text.selectAll("path")
                        .remove()

                    // remove tooltip
                    text.select("#tooltip")
                        .remove()

                    // remove information legend
                    text.select("#info")
                        .remove()

                    // create circular graph
                    circularPackingGraph(circleData, bubbleData, false, secondBarData, updatePieData, pieData, barData);
                }
            }
        })
    }

    // function to sort the bubbles from the bubble graph
    function sortBubble(data) {
        d3.select("#sortButton").on("click", function() {
            // stop old simulation
            simulation.stop()

            // make new simulation for sorting
            var simulation2 = d3.forceSimulation(data)
              .force('center', d3.forceCenter(margins.width / 2, margins.height / 2))
              .force('collision', d3.forceCollide().radius(function(d) {
                return d.value / (margins.width / 14);
            }))
              .on('tick', ticked)
              .force('x', d3.forceX().strength(0.2).x(function(d) {
                          return ordinalScale(d.province);
            }));

            // select bubblechart svg
            var svg = d3.select("#graph1").select("svg")

            // make list of provinces
            var provinceList = [];
            for (var line of data) {
                if (provinceList.indexOf(line.province) < 0) {
                     provinceList.push(line.province)
                }
            }

            // change list to the right format
            provinceList.unshift(provinceList[11])
            provinceList.pop()

            // create function for province labels
            function appendText(x, province) {
                svg.append("text")
                    .attr("class", "provinceLabels")
                    .attr("transform", "translate (" + x + "," + (margins.height)+ ") rotate(-90)")
                    .attr("font-family", "Arial")
                    .style('font-size', 28)
                    .style("fill", "white")
                    .attr("opacity", "0.9")
                    .text(province);

            }
            // create the labels
            var counter = 80
            for (items of provinceList) {
                appendText(counter, items);
                counter += (margins.width/(provinceList.length + 1));
            }

            // slowly hide title text
            bubbleSVG.select("#label-path-title-text")
                     .transition().duration(2000)
                     .attr("opacity", 0)
                     .on("end", textCalback)

            // create callback function
            function textCalback() {
                // remove text and path
                var text = d3.select("#graph1")

                // stop new simulation and restard old
                simulation2.stop()
                simulation.restart()

                // move text of the screen
                text.selectAll("#label-path-title-text")
                    .attr("transform", "translate(" + (margins.width*3) + "," + (margins.height*3) + ")")
                // move text of the screen
                text.selectAll("#label-path-title")
                    .attr("transform", "translate(" + (margins.width*3) + "," + (margins.height*3) + ")")
            }
        })
    }

    // create function for dragging the circles
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    // create function for moving the dragged objects
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    // finish the drag simulation
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }

    // this function creates a circular arc for text
    function arcSVG(mx0, my0, r, larc, sweep, mx1, my1) {
        return 'M'+mx0+','+my0+' A'+r+','+r+' 0 '+larc+','+sweep+' '+mx1+','+my1;
    }

    // select g element from bubble chart
    var g = d3.select("#graph1")
              .select("svg")
              .select("g")

    // get radiuscreate a radius
    var r = margins.width/2.2;

    // append a path for the title of the graph
    g.append('path')
     .attr("transform", "translate(" + (margins.width/2) + "," + (margins.height/2) + ")")
     .attr('d', arcSVG(-r, 0, r, 1, 1, r, 0))
     .attr('id', 'label-path-title')
     .attr("class", "titleLabel")
     .style('fill', 'none')
     .style('stroke', 'none');

    // append text to the title path
    g.append('text')
     .append('textPath')
     .attr("id", "label-path-title-text")
     .attr("class", "titleLabel")
     .attr('xlink:href', '#label-path-title')
     .attr('startOffset', '25%')
     .style('font-size', '30px')
     .style('fill', 'white')
     .text("Totaal aantal examen kandidaten 2017")
     .transition()
     .duration(1000)
     .attr("opacity", 1);
}

// Create mouse over event
function handleMouseEnterBubble(d, i) {
    // change stroke of the cicles
    d3.select(this)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6);

};
// handles mouse out
function handleMouseOutBubble(d, i) {
    // change size dots back to normal
    d3.select(this)
      .attr("stroke-opacity", 0);

    // select the svg of the bubble chart
    var svg = d3.select("#graph1")
                .select("svg");

    // remove tooltip
    var tooltip = d3.select("#tooltip")
    tooltip.style("display", "none");
};

// create a function for the mouseover of the legend
function handleMouseEnterInfo2() {
    // create a white box for the info
    var information = d3.select("#info")
                        .append("rect")
                        .attr("width", 105)
                        .attr("height", 185)
                        .attr("fill", "white")
                        .attr("opacity", 0.3)
                        .attr("transform", "translate(-95,10)")
                        .attr("class", "infoRect")

    function schoolLevel(color, y, text) {
        // append rects to info box
        d3.select("#info").append("rect")
                          .attr("width", 10)
                          .attr("height", 10)
                          .attr("fill", color)
                          .attr("transform", "translate(-5," + (15 * y) + ")")
                          .attr("class", "infoRect")

        // append text to info box
        d3.select("#info").append("text")
                          .attr("x", -13)
                          .attr("y", 9 + 15 * y)
                          .attr("fill", "white")
                          .style("text-anchor", "end")
                          .attr("font-size", "10px")
                          .attr("font-weight", "bold")
                          .attr("class", "infoText")
                          .text(text)
    }
    // make all the boxes
    schoolLevel("#E27D60", 1, "Limburg")
    schoolLevel("#37B5FF", 2, "Overijsel")
    schoolLevel("#E8A87C", 3, "Zeeland")
    schoolLevel("#C38D9E", 4, "Zuid-Holland")
    schoolLevel("#FAC2C1", 5, "Noord-Brabant")
    schoolLevel("#85DCB2", 6, "Groningen")
    schoolLevel("#41B3A3", 7, "Noord-Holland")
    schoolLevel("#F9FF49", 8, "Utrecht")
    schoolLevel("#B5F569", 9, "Gelderland")
    schoolLevel("#EFE2BA", 10, "Drenthe")
    schoolLevel("#F4976C", 11, "Flevoland")
    schoolLevel("#63FF53", 12, "Friesland")
}
