/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Final project
Context: This is the bubble chart class. In this class the bubble chart
         graph is created. 
******************************************************************************/

function bubblechart(data, secondBarData, updatePieData, circleData,  pieData, barData) {
    // get margins from container
    var selection = d3.select("#graph1")
                    .node().getBoundingClientRect()

    var height = selection["height"]
    var width = selection["width"]

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
        .attr("cx", width / 2)
        .attr("cy", height / 2)

    bubbleNode.transition()
        .duration(750)
        .attr("r", function(d) { return d.value / (width / 14) })

    // create a tooltip
    var tooltip = bubbleSVG.append("g")
                     .attr("id", "tooltip")
                     .style("display", "none");

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
                            // check if name kandidates is longer
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
                if (xPosition > width - (width/4)) {
                    xPosition = xPosition - 50 - d.name.length * 6;
                }
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            });


    // add tooltip form to rect
    tooltip.append("rect")
        .attr("height", 36)
        .attr("fill", "white")
        .style("opacity", 0.3);

    // add tooltip text
    tooltip.append("text")
        .attr("id", "tooltipText1")
        .attr("x", 10)
        .attr("dy", "1.2em")
        .attr("fill", "white")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

    // add tooltip text
    tooltip.append("text")
        .attr("id", "tooltipText2")
        .attr("x", 10)
        .attr("dy", "2.6em")
        .attr("fill", "white")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

    var information = d3.select("#info")

    // make invis box for a more easy hover effect
    information.append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("opacity", 0)
                .attr("id", "invisRect")
                .attr("transform", "translate(-9,-16)")
                .on("mouseenter", handleMouseEnterInfo2)
                .on("mouseleave", handleMouseLeaveInfo);

    var ordinalScale = d3.scaleOrdinal()
        .domain(function(d) { return d.province})
        .range([(1/12 * width), (2/12 * width), (3/13 * width), (4/13 * width),
        (5/13 * width), (6/13 * width), (7/13 * width), (8/13 * width),
        (9/13 * width), (10/13 * width), (11/13 * width) , (12/13 * width)]);

    var simulation = d3.forceSimulation(data)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(function(d) {
        return d.value / (width / 14);
    }))
      .on('tick', ticked);

    function ticked() {
       var u = d3.select('#graph1')
         .selectAll('circle')
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

    // sort graph
    sortBubble(data)
    // update groupedBarChart
    updateElements2(secondBarData, updatePieData);
    // change graph
    changeGraph2(circleData, data, secondBarData)

    // change graph to circleData
    function changeGraph2(circleData, bubbleData, secondBarData) {
        d3.select("#toCircle").on("click", function() {
            var graph = this.getAttribute("value");
            var active = this.getAttribute("class");
            var duration = 750;

            if (active != "btn btn-info btn-secondary active") {
                // stop simulation
                simulation.stop();

                // remove button
                var button = d3.select("#sortButton")
                button.remove()

                var searchButton = d3.select("#search")
                searchButton.remove()

                // remove all circles
                var circleRemove = d3.selectAll("circle")

                circleRemove.transition()
                            .duration(duration)
                            .style("opacity", 0)

                // remove text
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

                    // remove information
                    text.select("#info")
                        .remove()

                    circularPackingGraph(circleData, bubbleData, false, secondBarData, updatePieData, pieData, barData);
                }
            }
        })
    }

    function sortBubble(data) {
        d3.select("#sortButton").on("click", function() {
            var active = this.getAttribute("aria-pressed");

            // stop old simulation
            simulation.stop()


            // make new simulation
            var simulation2 = d3.forceSimulation(data)
              .force('center', d3.forceCenter(width / 2, height / 2))
              .force('collision', d3.forceCollide().radius(function(d) {
                return d.value / (width / 14);
            }))
              .on('tick', ticked)
              .force('x', d3.forceX().strength(0.2).x(function(d) {
                          return ordinalScale(d.province);
            }));

            var svg = d3.select("#graph1").select("svg")
            // make list of provinces
            var provinceList = [];
            for (var line of data) {
                if (provinceList.indexOf(line.province) < 0) {
                     provinceList.push(line.province)
                }
            }
            // get the right format
            provinceList.unshift(provinceList[11])
            provinceList.pop()

            // make province labels
            function appendText(x, province) {
                svg.append("text")
                    .attr("class", "provinceLabels")
                    .attr("transform", "translate (" + x + "," + (height)+ ") rotate(-90)")
                    .attr("font-family", "Arial")
                    .style('font-size', 28)
                    .style("fill", "white")
                    .attr("opacity", "0.9")
                    .text(province);

            }
            var counter = 80
            for (items of provinceList) {
                appendText(counter, items);
                counter += (width/(provinceList.length + 1));
            }

            // hide text
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
                    .attr("transform", "translate(" + (width*3) + "," + (height*3) + ")")
                // move text of the screen
                text.selectAll("#label-path-title")
                    .attr("transform", "translate(" + (width*3) + "," + (height*3) + ")")
            }



        })
    }

     function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }

    function types(d){
        d.gdp = +d.gdp;
        d.size = +d.gdp / sizeDivisor;
        d.size < 3 ? d.radius = 3 : d.radius = d.size;
        return d;
    }

    // append text to bubblechart
    function arcSVG(mx0, my0, r, larc, sweep, mx1, my1) {
        return 'M'+mx0+','+my0+' A'+r+','+r+' 0 '+larc+','+sweep+' '+mx1+','+my1;
    }

    // select g element
    var g = d3.select("#graph1")
                .select("svg")
                .select("g")

    // get radius
    var r = width/2.2;

    // create path
    g.append('path')
    .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")")
    .attr('d', arcSVG(-r, 0, r, 1, 1, r, 0))
    .attr('id', 'label-path-title')
    .attr("class", "titleLabel")
    .style('fill', 'none')
    .style('stroke', 'none');

    // append text to path
    g.append('text')
     .append('textPath')
     .attr("id", "label-path-title-text")
     .attr("class", "titleLabel")
     .attr('xlink:href', '#label-path-title')
     .attr('startOffset', '25%')
     .style('font-size', '30px')
     .style('fill', 'white')
     .text("Totaal aantal examen kandidaten 2018")
     .transition()
     .duration(1000)
     .attr("opacity", 1);

}

// Create event for mouse over
function handleMouseEnterBubble(d, i) {
    // change stroke
    d3.select(this)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.6);

};
// handles mouse out
function handleMouseOutBubble(d, i) {
    // change size dots back to normal
    d3.select(this)
        // .attr("stroke", "#41B3A3")
        .attr("stroke-opacity", 0);

    // removes text slowly
    var svg = d3.select("#graph1")
                .select("svg");

    // remove tooltip
    var tooltip = d3.select("#tooltip")
    tooltip.style("display", "none");
};

function handleMouseEnterInfo2() {
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
