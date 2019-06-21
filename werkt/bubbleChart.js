// #############################################################################
//                             BUBBLE CHART
// #############################################################################
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


    bubbleNode.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
            .on("mouseenter", handleMouseEnterBubble)
            .on("mouseout", handleMouseOutBubble);

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
         .append('circle') //<----------------------------------------------------------
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
        d3.select("#toCircle")
        .on("click", function() {
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

                var result = d3.select(".list-group")
                                .remove()

                // remove all circles
                var circleRemove = d3.selectAll("circle")

                circleRemove.transition()
                            .duration(duration)
                            .style("opacity", 0)
                            // .on("end", bubbleCalback)

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
                    // remove circles
                    var circleRemove = d3.selectAll(".bubble")
                    circleRemove.remove()

                    // remove text and path
                    var text = d3.select("#graph1")

                    text.selectAll("text")
                        .remove()

                    text.selectAll("path")
                        .remove()

                    circularPackingGraph(circleData, bubbleData, false, secondBarData, updatePieData, pieData, barData);
                }
            }
        })
    }

    function sortBubble(data) {
        d3.select("#sortButton").on("click", function() {

            var active = this.getAttribute("aria-pressed");

            if (active == "false") {
                // change simulation
                simulation.force('x', d3.forceX().strength(0.2).x(function(d) {
                            return ordinalScale(d.province);
                        }))

            // restart simulation
            simulation.restart();

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
                            .transition().duration(500)
                            .attr("opacity", 0)
                            .on("end", textCalback)

                // create callback function
                function textCalback() {
                    // remove text and path
                    var text = d3.select("#graph1")

                    text.selectAll("#label-path-title-text")
                        .remove()

                    text.selectAll("#label-path-title")
                        .remove()
                }


                // change button text
                // var button = d3.select(".btn-group")
                //                 .select("#sortButton")

                // button.text("Fun!") //<-----------------------------------------------------------------------------------
            }

            // if (active != "false") {
            //
            //     simulation.force('x', d3.forceX().strength(0.2).x(function(d) {
            //         if (d.value == 2204) {
            //             return 400;
            //         }
            //         else if (d.value == 1246) {
            //             return 200;
            //         }
            //         else {
            //             return ordinalScale(d.province);
            //         }
            //     }))
            //     .force('y', d3.forceY().strength(0.2).y(function(d) {
            //         if (d.value == 2204) {
            //             return -200;
            //         }
            //         else if (d.value == 1246) {
            //             return -200;
            //         }
            //         else {
            //             return 100;
            //         }
            //     }))
            //     simulation.restart()
            // }
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
    // get margins from container
    var selection = d3.select("#graph1")
                    .node().getBoundingClientRect()

    var height = selection["height"]
    var width = selection["width"]

    // removes text
    var svg = d3.select("#graph1")
                .select("svg");

    svg.selectAll(".school").remove();

    // change stroke
    d3.select(this)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("stroke-opacity", 0.6);

        var svg = d3.select("#graph1")
                    .select("svg")

        // add grade text
        svg.append("text")
           .attr("class", "school")
           .attr("text-anchor", "middle")
           .attr("x", width/2)
           .attr("y", height /15)
           .attr("font-size", function() {
               if (d.name.length > 23) {
                   return width / 16;
               }
               else {
                   return width / 12;
               }
           })
           .attr("font-family", "Arial")
           .transition()
           .duration(50)
           .attr("opacity", 0.9)
           .text(d.name)
};
// handles mouse out
function handleMouseOutBubble(d, i) {
    // change size dots back to normal
    d3.select(this)
        // .attr("stroke", "#41B3A3")
        .style("stroke-opacity", 0);

    // removes text slowly
    var svg = d3.select("#graph1")
                .select("svg");

    svg.selectAll(".school")
       .transition()
       .duration(1000)
       .attr("opacity", 0).remove();
};
