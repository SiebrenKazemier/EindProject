// #############################################################################
//                             circularPackingGraph
// #############################################################################
function circularPackingGraph(rootNode, bubbleData, TrueCheck, secondBarData, updatePieData, pieData, barData) {
    // var width = window.innerWidth;
    // var height = window.innerHeight;

    // var width = 932;                   // < ---------------------------------- zoooommm
    // var height = width;
    if (TrueCheck == true) {

        var selection = d3.select("#graph1")
                        .node().getBoundingClientRect()

        var height = selection["height"]
        var width = selection["width"]

        // get margins from container
        var margin = 40;
        var marginBottom = width * 0.08;

        var canvas = d3.select("#graph1")
                        .append("svg")
                        .attr("id", "circleSVG")
                        // .attr("viewBox", `-${width/2} -${height/2} ${width} ${height}`)
                        // .style("display", "block")
                        // .style("margin", "0 -14px")
                        // .style("background", "none")
                        // .style("cursor", "pointer")
                        // .on("click", function() {return zoom(nodes) } );    // < ---------------------------------- zoooommm

                        .attr("width", width)
                        .attr("height", height + margin)
                        .append("g")
                        .attr("transform", "translate(0," + (margin - marginBottom) + ")");
    }
    else {
        var selection = d3.select("#circleSVG")
                        .node().getBoundingClientRect()

        var height = selection["height"]
        var width = selection["width"]

        var canvas = d3.select("#circleSVG")
                        .select("g")
    }


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

    var node = canvas.selectAll(".node")
                    .data(nodes.descendants()) // <------------------------------- nodes.descendants().slice(1) removes rootnode
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"; });

    // append circle to nodes
    node.append("circle")
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
        .transition().duration(750)
        .attr("r", function(d) { return d.r; })
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

    //     .attr("pointer-events", d => !d.children ? "none" : null)
    //     .on("click", d => focus !== d && (zoom(d), d3.event.stopPropagation()));

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
    //
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
                .transition().duration(700)
                .attr("opacity", 1)
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
        .style('fill', 'white')
        .attr('xlink:href', '#label-path-' + i)
        .attr('startOffset', '50%')
        .style('font-size', '10px')
        .transition().duration(700)
        .attr("opacity", 1)
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
            .transition().duration(700)
            .attr("opacity", 1)
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
            .transition().duration(700)
            .attr("opacity", 1)
            .text("Totaal aantal examen kandidaten 2018");
		}

	});
    changeGraph(rootNode, bubbleData, secondBarData, updatePieData, pieData, barData);
    updateElements(barData, pieData);
}

// Create event for mouse over
function handleMouseEnter(d, i) {
    // change dot size
    d3.select(this)
        .attr("stroke", "white")
        .attr("stroke-width", "3")
        .style("stroke-opacity", 0.6);

    // // select width and height
    // var selection = d3.select("#circleSVG")
    //                 .node().getBoundingClientRect()
    //
    // var height = selection["height"]
    // var width = selection["width"]
    //
    // // select svg
    // var svg = d3.select("#graph1")
    //             .select("svg")
    //             .select("g")
    //
    // // remove old elements
    // svg.selectAll(".candidates")
    //     .remove()
    //
    // // append text
    // svg.append("text")
    //     .attr("class", "candidates")
    //     .style("fill", "white")
    //     .style('font-size', '20px')
    //     .attr("transform", "translate("+ (width - 180) + "," + 80 + ")")
    //     .text("Kandidaten: " + d.value)
};

// handles mouse out
function handleMouseOut(d, i) {
    // change size dots back to normal
    d3.select(this)
        .attr("stroke-width", 0)

    // select svg
    var svg = d3.select("#graph1")
                .select("svg")
                .select("g")

    // svg.selectAll(".candidates")
    //     .transition().duration(500)
    //     .style("opacity", 0)
    //     .remove()

};
