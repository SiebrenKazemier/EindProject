/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Assignment week 4, Creating a bar graph
******************************************************************************/
window.onload = function() {
    importData();
}

function importData() {
    //
    d3.json("circleData.json").then(function(data) {
        d3.json("bubbleData.json").then(function(data2) {
            d3.json("groupedBarChart.json").then(function(data3) {
                d3.json("pieChart.json").then(function(data4) {
                    circularPackingGraph(data, data2);
                    groupedBarChart(data3);
                    pieChart(data4);
                })
            })
        })
    })

    // d3.json("groupedBarChart.json").then(function(data) {
    //     // console.log(data);
    //     groupedBarChart(data);
    // })

    // d3.json("pieChart.json").then(function(data) {
    //     // console.log(data);
    //     pieChart(data);
    // })

    // d3.json("bubbleData.json").then(function(data) {
    //     console.log(data);
    //     bubblechart(data);
    // })
}


// #############################################################################
//                             PIE CHART
// #############################################################################
function pieChart(data) {
    // get container width and height
    var selection = d3.select("#graph2")
                    .node().getBoundingClientRect()

    var height = selection["height"]
    var width = selection["width"]

    // var width = 800;
    // var height = 600;
    var margin = 150;
    var padding = 5;

    // format data
    var formatedData = data.values

    // make svg
    const svg = d3.select("#graph2")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
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
    //
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
    var secondFormatedData = data.Drenthe.values

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
        .style("stroke-width", "3px")
        .style("stroke-opacity", 1)
        .on("mouseenter", handleMouseOverPie)
        .on("mouseout", handleMouseOutPie)


    svg.selectAll("pie2")
      .data(secondLayout)
      .enter()
      .append('text')
      .text(function(d){ return d.data.key})
      .attr("transform", function(d) { return "translate(" + arcGenerator2.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17)
      .style('fill', 'white')

// ##################################### UPDATE PIE ############################

  // // update pieChart
  // d3.selectAll('.circleChart').on('click', function(d) {
  //       var duration = 750;
  //       var changedData;
  //       var provinceName;
  //       var DataChange;
  //
  //       if (d.depth == 0) {
  //         // reform data
  //           dataChange = data.values;
  //       }
  //       else if (d.depth == 1) {
  //           // change to the right data
  //           provinceName = d.data.name;
  //           dataChange = data[provinceName].values
  //       }
  //       // else if (d.depth == 2) {
  //       //     provinceName = d.parent.data.name;
  //       //     levelName = d.data.name;
  //       //     changeData = data[provinceName][levelName]
  //         // console.log(changeData)
  //       // })
  //
  //       // update layout for the data
  //       layout = pie(d3.entries(dataChange))
  //       console.log(dataChange)
  //
  //       // select the pie
  //       var updatePie = svg.selectAll('pie2')
  //                           .data(layout)
  //
  //       updatePie.enter()
  //               .append('path')
  //               .merge(updatePie)
  //               .transition()
  //               .duration(1000)
  //               .attr('d', arcGenerator2)
  //               .attr('fill', function(d) { return(secondColor(d.data.key)) })
  //               .attr("stroke", "white")
  //               .style("stroke-width", "2px")
  //               .style("stroke-opacity", 0.6)
  //
  //       svg.selectAll("pie2")
  //             .data(layout)
  //             .enter()
  //             .append('text')
  //             .text(function(d){ return d.data.key})
  //             .attr("transform", function(d) { return "translate(" + arcGenerator2.centroid(d) + ")";  })
  //             .style("text-anchor", "middle")
  //             .style("font-size", 17)
  //    })


    function handleMouseOverPie() {
        d3.select(this)
            .attr("stroke", "white")
            .style("stroke-width", "3px")
            .style("stroke-opacity", 0.6)
    }
    function handleMouseOutPie() {
        d3.select(this)
            .attr("stroke", "#7DC2AF")
            .style("stroke-width", "3px")
            .style("stroke-opacity", 1)
    }

}






// #############################################################################
//                             GROUPED BARCHART
// #############################################################################

function reformData(data) {
    var list = [];
    for (var i = 0; i < Object.values(data.values).length; i++) {
        var dict = {}
        dict["name"] = Object.keys(data.values)[i];
        dict["field1"] = Object.values(data.values)[i][0];
        dict["field2"] = Object.values(data.values)[i][1];
        dict["field3"] = Object.values(data.values)[i][2];
        list.push(dict);
    }
    return list;
}


function groupedBarChart(data) {
    // get margins from container
    var selection = d3.select("#graph2")
                    .node().getBoundingClientRect()

    var height = selection["height"]
    var width = selection["width"]

    // var width = 800;
    // var height = 600;
    const padding = 0.25/ 2
    const margin = {top: 80, bottom: 180, right: 40, left: 90};

    // make svg
    const svg = d3.select("#graph2")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g");

    // gets names for x-axis
    var names = [];
    for (name of Object.keys(data.values)) {
        names.push(name)
    }

    // reform data
    var reformedData = reformData(data);

    // Create a scale for x-axis
    var xScale = d3.scaleBand()
                   .domain(names)
                   .range([margin.left, width - margin.right])
                   .paddingInner(padding);

    // Create a scale for x-axis
    var xScale1 = d3.scaleBand()
                    .domain(['field1', 'field2', 'field3'])
                    .range([0, xScale.bandwidth()])
                    .padding(0.2);


    // Create a scale for y-axis
    var yScale = d3.scaleLinear()
                 .domain([0, 10])
                 .range([height - margin.bottom, margin.top]);


    // Create a color scale
    // var colorScale = d3.scaleLinear()
    //                    .domain([0, 10])
    //                    .range(["#8c510a","#01665e"]) <---------------------------------- COLORSCALE!!!!!

    // Create y-axis
    const yAxis = d3.axisLeft()
                   .scale(yScale);

    // Create x-axis
    const xAxis = d3.axisBottom()
                   .scale(xScale);

   var barGroup = svg.selectAll(".barGroup")
     .data(reformedData)
     .enter().append("g")
     .attr("class", "barGroup")
     .attr("transform", function(d) { return "translate(" + xScale(d.name) + "," + margin.top + ")"});

    function makeBarGroup(number, color) {
        /* Add field1 bars */
        barGroup.selectAll(".bar.field" + number)
            .data(function(d) { return [d] })
            .enter()
            .append("rect")
            .attr("class", "bar field" + number)
            .style("fill", color)
            .attr("x", function(d) { return xScale1('field'+ number)})
            .attr("y", function(d) { return yScale(d["field" + number])  - margin.top })
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.bottom - yScale(d["field" + number])
            })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("stroke-opacity", 0)
            .on("mouseenter", handleMouseOverBar)
            .on("mouseout", handleMouseOutBar);
    }
    // make bars
    makeBarGroup("1", "#E8A87C")
    makeBarGroup("2", "#85DCB2")
    makeBarGroup("3", "#41B3A3")

   // add correct margins to x axis
   svg.append("g")
       .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
       .attr("class", "xAxis")
       .call(xAxis)
       .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)" );

  // add correct margins to y axis
   svg.append("g")
       .attr('transform', 'translate('+ (margin.left) + ',0)')
       .attr("class", "yAxis")
       .call(yAxis);

    // update barChart
    d3.selectAll('.circleChart').on('click', function(d) {
        console.log(d)
        var duration = 1000;
        var changedData;
        var provinceName;
        var changeData;

        if (d.depth == 0) {
            // reform data
            dataChange = reformData(data);
        }
        else if (d.depth == 1) {
            provinceName = d.data.name;
            changeData = data[provinceName]
            // change to the right data
            dataChange = reformData(changeData)
            // console.log(changeData)
        }
        else if (d.depth == 2) {
            provinceName = d.parent.data.name;
            levelName = d.data.name;
            changeData = data[provinceName][levelName]
            // console.log(changeData)

            function reformData2(data) {
                var list = [];
                for (var i = 0; i < Object.values(data).length; i++) {
                    var dict = {}
                    dict["name"] = Object.keys(data)[i];
                    dict["field1"] = Object.values(data)[i][0];
                    dict["field2"] = Object.values(data)[i][1];
                    dict["field3"] = Object.values(data)[i][2];
                    list.push(dict);
                }
                return list;
            }
            dataChange = reformData2(changeData)

        }

        // update names for x-axis
        var names = [];
        for (var name of dataChange) {
          names.push(name.name)
        }

        // update scale for x-axis
        xScale.domain(names)
             .range([margin.left, width - margin.right])
             .paddingInner(padding);

        // update bar data
        svg.selectAll(".barGroup")
               .data(dataChange)
               .enter().append("g")
               .attr("class", "barGroup")
               .attr("transform", function(d) { return "translate(" + xScale(d.name) + "," + margin.top + ")"});

        // change the x axis
        svg.select(".xAxis").transition()
            .duration(duration)
            .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
            .call(xAxis)
            .selectAll("text")
                 .style("text-anchor", "end")
                 .attr("dx", "-.8em")
                 .attr("dy", ".15em")
                 .attr("transform", "rotate(-45)" );

        // update bars
        function updateBarGroup(number, color) {

            barGroup.selectAll(".bar.field" + number)
                    .data(function(d) { return [d] })
                    // .enter()
                    .transition()
                    .duration(duration)
                    .attr("x", function(d) { return xScale1('field'+ number) })
                    .attr("y", function(d) { return yScale(d["field" + number]) - margin.top})
                    .attr("width", xScale1.bandwidth())
                    .attr("height", d => {
                        return height - margin.bottom - yScale(d["field" + number])
                });

            // Remove old rects as needed.
            barGroup.exit().remove();
        }
        // make bars
        updateBarGroup("1", "#E8A87C")
        updateBarGroup("2", "#85DCB2")
        updateBarGroup("3", "#41B3A3")

    })

    function handleMouseOverBar() {
        d3.select(this)
            .style("stroke-opacity", 0.8)
    }
    function handleMouseOutBar() {
        d3.select(this)
            .style("stroke-opacity", 0)
    }

}

// #############################################################################
//                             circularPackingGraph
// #############################################################################

function circularPackingGraph(rootNode, bubbleData) {
    // get margins from container
    var margin = 40;
    var selection = d3.select("#graph1")
                    .node().getBoundingClientRect()

    var height = selection["height"]
    var width = selection["width"]


    // var width = window.innerWidth;
    // var height = window.innerHeight;

    // var width = 932;                   // < ---------------------------------- zoooommm
    // var height = width;

    // create layout
    var layout = d3.pack()
                .size([width, height])
                .padding(0);

     // assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(rootNode, function(d) {
        return d.children;
    });

    // maps the node data to the pack layout
    nodes = layout(nodes);

    var canvas = d3.select("#graph1")
                    .append("svg")
                    // .attr("viewBox", `-${width/2} -${height/2} ${width} ${height}`)
                    // .style("display", "block")
                    // .style("margin", "0 -14px")
                    // .style("background", "none")
                    // .style("cursor", "pointer")
                    // .on("click", function() {return zoom(nodes) } );    // < ---------------------------------- zoooommm

                    .attr("width", width)
                    .attr("height", height + margin)
                    .append("g")
                    .attr("transform", "translate(0," + margin + ")");



    var node = canvas.selectAll(".node")
                    .data(nodes.descendants()) // <------------------------------- nodes.descendants().slice(1) removes rootnode
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"; });

    // append circle to nodes
    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .attr("fill", function(d) {
            if (d.depth == 2) {
                if (d.data.name == "VWO") {
                    return "#E27D60"
                }
                else if (d.data.name == "HAVO") {
                    return "#85DCB2"
                }
                else if (d.data.name == "VMBO-KL") {
                    return "#37B5FF"
                }
                else if (d.data.name == "VMBO-BL") {
                    return "#C38D9E"
                }
                else if (d.data.name == "VMBO-TL") {
                    return "#FAC2C1"
                }
                else if (d.data.name == "VMBO-GL") {
                    return "#E8A87C"
                }
            }
            else if (d.depth == 1) {
                return "#41B3A3"
            }
            else {
                return "#41B3A3"
            }
        })
        .attr("class", "circleChart")
        .attr("opacity", function(d) {
            if (d.depth > 0) {
                return 1;
            }
            else {
                return 0.4;
            }
        })
        .attr("stroke", "#41B3A3")
        .attr("stroke-width", "s2")

    // var node = canvas.append("g")
    //   .selectAll("circle")
    //   .data(nodes.descendants())
    //   .join("circle")
    //   .attr("fill", function(d) {
    //       if (d.depth == 2) {
    //           if (d.data.name == "VWO") {
    //               return "#E27D60"
    //           }
    //           else if (d.data.name == "HAVO") {
    //               return "#85DCB2"
    //           }
    //           else if (d.data.name == "VMBO-KL") {
    //               return "#37B5FF"
    //           }
    //           else if (d.data.name == "VMBO-BL") {
    //               return "#C38D9E"
    //           }
    //           else if (d.data.name == "VMBO-TL") {
    //               return "#FAC2C1"
    //           }
    //           else if (d.data.name == "VMBO-GL") {
    //               return "#E8A87C"
    //           }
    //       }
    //       else if (d.depth == 1) {
    //           return "#41B3A3"
    //       }
    //       else {
    //           return "#41B3A3"
    //       }
    //   })
    //   .attr("opacity", function(d) {
    //       if (d.depth > 0) {
    //           return 1;
    //       }
    //       else {
    //           return 0.4;
    //       }
    //   })
    //   .attr("stroke", "#41B3A3")
    //   .attr("stroke-width", "s2")
        // .attr("pointer-events", d => !d.children ? "none" : null)
        // .on("click", d => focus !== d && (zoom(d), d3.event.stopPropagation()));


    // select circles
    var circle = canvas.selectAll("circle")

    circle.on("mouseenter", handleMouseEnter)
            .on("mouseout", handleMouseOut)

    // circle.on("click", d => focus !== d && (zoom(d), d3.event.stopPropagation())); // <----------- ZOOOOM


                            // APPLY zoooom
// ###########################################################################

    // zoomTo([nodes.x, nodes.y, nodes.r * 2]);
    //
    //
    // function zoomTo(v) {
    //     const k = width / v[2];
    //
    //     view = v;
    //
    //     // label.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")" });
    //     node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")" });
    //     node.attr("r", function(d) { return d.r * k });
    // }
    //
    // function zoom(d) {
    //     const focus0 = focus;
    //
    //     focus = d;
    //     console.log(d)
    //     const transition = canvas.transition()
    //                     .duration(d3.event.altKey ? 7500 : 750)
    //                     .tween("zoom", d => {
    //     const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
    //     return t => zoomTo(i(t));
    // });

    // label.filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
    //     .transition(transition)
    //     .style("fill-opacity", d => d.parent === focus ? 1 : 0)
    //     .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
    //     .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    // }


                            // APPLY TEXT!!!
// ###########################################################################

    function arcSVG(mx0, my0, r, larc, sweep, mx1, my1) {
        return 'M'+mx0+','+my0+' A'+r+','+r+' 0 '+larc+','+sweep+' '+mx1+','+my1;
    }

    node.each(function(d, i) {
		var g = d3.select(this);

		var label = d.depth === 0 ? '' : d.depth === 3 ? d.data.value : d.data.name;

		if(d.depth == 2) {
			g.append('text')
				.style('font-size', d3.min([2 * d.r / label.length, 16]))
                .attr("text-anchor", "middle")
				.attr('dy', '0.3em')
                .style("fill", "white")
				.text(label);
		}
        if(d.depth == 1) {
			var r = d.r - 10;
			g.append('path')
        .attr('d', arcSVG(-r, 0, r, 1, 1, r, 0))
        .attr('id', 'label-path-' + i)
        .style('fill', 'none')
        .style('stroke', 'none');

       g.append('text')
       	.append('textPath')
        .attr('xlink:href', '#label-path-' + i)
        .attr('startOffset', '50%')
        .style('font-size', '10px')
        .style('fill', 'white')
        .text(d.data.name);
		}
        if(d.depth == 0) {
    		var r = d.r - 14;
    		g.append('path')
            .attr('d', arcSVG(-r, 0, r, 1, 1, r, 0))
            .attr('id', 'label-path-' + i)
            .style('fill', 'none')
            .style('stroke', 'none');

           g.append('text')
           	.append('textPath')
            .attr('xlink:href', '#label-path-' + i)
            .attr('startOffset', '47%')
            .style('font-size', '16px')
            .style('fill', 'white')
            .text(d.data.name);

            r = d.r + 10;
            g.append('path')
            .attr('d', arcSVG(-r, 0, r, 1, 1, r, 0))
            .attr('id', 'label-path-title' + i)
            .style('fill', 'none')
            .style('stroke', 'none');

           g.append('text')
            .append('textPath')
            .attr('xlink:href', '#label-path-title' + i)
            .attr('startOffset', '26%')
            .style('font-size', '30px')
            .style('fill', 'white')
            .text("Totaal aantal examen kandidaten 2018");
		}

	});
    changeGraph(nodes, bubbleData)

}

// Create event for mouse over
function handleMouseEnter(d, i) {
    // change dot size
    d3.select(this)
        .attr("stroke", "white")
        .attr("stroke-width", "3")
        .style("stroke-opacity", 0.6);
};

// handles mouse out
function handleMouseOut(d, i) {
    // change size dots back to normal
    d3.select(this)
        .attr("stroke-width", 0)
};

function changeGraph(circleData, bubbleData) {
    var duration = 750;
    var count = 0;

    d3.selectAll(".btn-info")
    .on("click", function() {
        var graph = this.getAttribute("value");
        var active = this.getAttribute("class");

        if (active != "btn btn-info btn-secondary active") {
            if (graph == "scholen") {
                var remove = d3.selectAll(".node")
                var removeCircle = d3.selectAll("circle")
                var removeText = remove.selectAll("text")
                var counter = 0;

                // does callback only 1 time
                function callback() {
                    if (counter == 0) {
                        remove.remove()
                        bubblechart(bubbleData);
                        counter = counter +1;
                    }
                }
                // remove circles
                removeCircle.transition()
                            .duration(duration)
                            .attr("opacity", 0)
                // remove text
                removeText.transition()
                            .duration(duration)
                            .style("opacity", 0)
                            .on("end", callback)

                // create button
                var button = d3.select(".btn-group")
                                .append("button")
                // create button
                button.text("Sorteren")
                    .attr("class", "btn btn-info")
                    .attr("type", "button")
                    .attr("id", "sortButton")
                    .attr("aria-pressed", "false")
            }
        }
        if (graph == "niveau") {
            // remove button
            var button = d3.select("#sortButton")
            button.remove()

            console.log(graph)
            var circleRemove = d3.selectAll("circle")
            circleRemove.remove()
            // d3.force.stop()
            // circleRemove.remove()
            // circularPackingGraph(circleData)
            // removeCircle.remove()
        }
    })
}


// #############################################################################
//                             BUBBLE CHART
// #############################################################################

function bubblechart(data) {
    // get margins from container
    var selection = d3.select("#graph1")
                    .node().getBoundingClientRect()

    var height = selection["height"]
    var width = selection["width"]

    var bubbleSVG = d3.select("svg")

    // set the color scale
    var color = d3.scaleOrdinal()
                  .domain(function(d) { return d.province})
                  .range(["#E27D60", "#37B5FF", "#E8A87C", "#C38D9E", "#FAC2C1", "#85DCB2", "#41B3A3", "F9FF49", "B5F569" ,"FFAD5F", "white", "63FF53"])


    // Initialize the circle: all located at the center of the svg area
    var bubbleNode = bubbleSVG.select("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .style("fill", function(d) { return color(d.province)})
        .attr("cx", width / 2)
        .attr("cy", height / 2)

    bubbleNode.transition()
        .duration(750)
        .attr("r", function(d) { return d.value / (width / 14) })
        // .attr("stroke", "#41B3A3")
        // .style("stroke-width", 2);

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
      // .force('charge', d3.forceManyBody().strength(1))
      .force('center', d3.forceCenter(width / 2, height / 2))
      // .force('x', d3.forceX().x(function(d) {
      //     return ordinalScale(d.province);
      //   }))
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
         .attr('r', 5)
         .merge(u)
         .attr('cx', function(d) {
           return d.x
         })
         .attr('cy', function(d) {
           return d.y
         })

       u.exit().remove()
     }

     sortBubble()

     function sortBubble() {
         d3.select("#sortButton")
            .on("click", function() {
                var active = this.getAttribute("aria-pressed");
                console.log(active)

                if (active == "false") {
                    // Update and restart the simulation.
                    // simulation.nodes(nodes);

                    simulation.force('x', d3.forceX().strength(0.2).x(function(d) {
                              return ordinalScale(d.province);
                          }))

                          // .force('center', d3.forceCenter(width / 2, height / 2))

                            // .force('y', d3.forceY().y(function(d) {
                            //     return ordinalScale(d.province)
                            // }))
                    simulation.restart();
                }
                // else {
                //     // simulation.force.stop()
                //     simulation.force('x', d3.forceX().strength(0.2).x(width/2))
                //
                //             // .force('center', d3.forceCenter(width / 2, height / 2));
                //     simulation.restart();
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
    // Create event for mouse over
    function handleMouseEnterBubble(d, i) {
        // change dot size
        d3.select(this)
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .style("stroke-opacity", 0.6);
    };

    // handles mouse out
    function handleMouseOutBubble(d, i) {
        // change size dots back to normal
        d3.select(this)
            // .attr("stroke", "#41B3A3")
            .style("stroke-opacity", 0);
    };

}



// #############################################################################
//                              VRAGEN!!!!
// #############################################################################

// 1. Hoe meer children toevoegen zonder dat hij te langzaam word?
// 2. jinja?
