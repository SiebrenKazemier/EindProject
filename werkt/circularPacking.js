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
    d3.json("pieChart.json").then(function(data) {
        console.log(data);
        pieChart(data);
    })

    d3.json("groupedBarChart.json").then(function(data) {
        // console.log(data);
        groupedBarChart(data);
    })

    d3.json("circleData.json").then(function(data) {
        // console.log(data);
        circularPackingGraph(data);
    })

    d3.json("bubbleData.json").then(function(data) {
        console.log(data);
        // bubblechart(data);
    })
}
// #############################################################################
//                             BUBBLE CHART
// #############################################################################

// function bubblechart(data) {
    // set the dimensions and margins of the graph
    var width = 800;
    var height = 600;

    // append the svg object to the body of the page
    var svg = d3.select("body")
      .append("svg")
        .attr("width", width)
        .attr("height", height)

    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("r", 5)
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", "#69b3a2")
        .style("fill-opacity", 0.3)
        .attr("stroke", "#69a2b2")
        .style("stroke-width", 4)

// function(d) { return d.value / 50}
        // constants used in the simulation
        var center = {x: width / 2, y: height / 2};
        var forceStrength = 0.01;

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        // .force('x', d3.forceX().strength(forceStrength).x(center.x))
        // .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(2).radius(5)) // Force that avoids circle overlapping




    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
          node
              .attr("cx", function(d){ return d.x; })
              .attr("cy", function(d){ return d.y; })
        });
}


// #############################################################################
//                             PIE CHART
// #############################################################################
function pieChart(data) {
    var width = 800;
    var height = 600;
    var margin = 200;
    var padding = 5;

    // format data
    var formatedData = data.values

    // make svg
    const svg = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // radius of the piechart
    var radius = (Math.min(width, height) / 2 - margin)

    // set the color scale
    var color = d3.scaleOrdinal()
                  .domain(formatedData)
                  .range(["#E85A4F", "#8E8D8A"])

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
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // ############################ SECOND PIE ##############################

    // format secondData
    var secondFormatedData = data.Drenthe.values

    // radius of the piechart
    var secondRadius = radius + 100

    // set the color scale
    var secondColor = d3.scaleOrdinal()
                  .domain(formatedData)
                  .range(["#E85A4F", "#8E8D8A"])

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
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)


    function arcSVG(mx0, my0, r, larc, sweep, mx1, my1) {
        return 'M'+mx0+','+my0+' A'+r+','+r+' 0 '+larc+','+sweep+' '+mx1+','+my1;
    }

    svg.selectAll("pie2")
      .data(secondLayout)
      .enter()
      .append('text')
      .text(function(d){ return d.data.key})
      .attr("transform", function(d) { return "translate(" + arcGenerator2.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17)

}






// #############################################################################
//                             GROUPED BARCHART
// #############################################################################

function reformData(data) {
    var list = [];
    for (var i = 0; i < Object.values(data.values).length; i++) {
        var dict = {}
        dict["model_name"] = Object.keys(data.values)[i];
        dict["field1"] = Object.values(data.values)[i][0];
        dict["field2"] = Object.values(data.values)[i][1];
        dict["field3"] = Object.values(data.values)[i][2];
        list.push(dict);
    }
    return list;
}


function groupedBarChart(data) {

    var width = 800;
    var height = 600;
    const padding = 0.25
    const margin = {top: 80, bottom: 180, right: 40, left: 80};

    // make svg
    const svg = d3.select("body")
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

    var xScale1 = d3.scaleBand()
                    .domain(['field1', 'field2', 'field3'])
                    .range([0, xScale.bandwidth()])

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
     .attr("transform", function(d) { return "translate(" + xScale(d.model_name) + "," + margin.top + ")"});

    /* Add field1 bars */
    barGroup.selectAll(".bar.field1")
        .data(function(d) { return [d] })
        .enter()
        .append("rect")
        .attr("class", "bar field1")
        .style("fill","#D8C3A5")
        .attr("x", function(d) { return xScale1('field1') })
        .attr("y", function(d) { return yScale(d.field1) })
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.field1)
    });

    /* Add field1 bars */
    barGroup.selectAll(".bar.field2")
        .data(function(d) { return [d] })
        .enter()
        .append("rect")
        .attr("class", "bar field2")
        .style("fill","#E98074")
        .attr("x", function(d) { return xScale1('field2') })
        .attr("y", function(d) { return yScale(d.field2) })
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.field2)
    });

    barGroup.selectAll(".bar.field3")
        .data(function(d) { return [d] })
        .enter()
        .append("rect")
        .attr("class", "bar field3")
        .style("fill","#E85A4F")
        .attr("x", function(d) { return xScale1('field3') })
        .attr("y", function(d) { return yScale(d.field3) })
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.field3)
    });

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
}

// #############################################################################
//                             circularPackingGraph
// #############################################################################

function circularPackingGraph(rootNode) {

    var margin = 50;
    var width = window.innerWidth;
    var height = window.innerHeight;


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

    // const root2 = nodes
    // let focus = root2;      // < ---------------------------------- zoooommm
    // let view;

    var canvas = d3.select("body")
                    .append("svg")
                    // .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
                    // .style("display", "block")
                    // .style("margin", "0 -14px")
                    // .style("background", "none")
                    // .style("cursor", "pointer")
                    // .on("click", () => zoom(root2));    // < ---------------------------------- zoooommm

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
        .attr("fill", "#E98074")
        .attr("opacity", 0.3)
        .attr("stroke", "#ADADAD")
        .attr("stroke-width", "s2")

    // select circles
    var circle = canvas.selectAll("circle")

    circle.on("mouseenter", handleMouseEnter)
            .on("mouseout", handleMouseOut)
            // .on("click", function(d) { return (zoom(d), d3.event.stopPropagation()) }); // < --------- zoooommm


    // select root node
    var root = canvas.select(".node")

    // console.log(nodes)

                            // APPLY zoooom
// ###########################################################################
    // console.log(root2)
    // console.log(root2.x)
    // zoomTo([root2.x, root2.y, root2.r * 2]);
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
    //
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
	});
}

// Create event for mouse over
function handleMouseEnter(d, i) {
    // change dot size
    d3.select(this)
        .attr("opacity", 0.4)
        .attr("stroke", "#E85A4F")
        .attr("stroke-width", "3")
        // .style("stroke", "black");
};

// handles mouse out
function handleMouseOut(d, i) {
    // change size dots back to normal
    d3.select(this)
        .attr("opacity", 0.25)
        .attr("stroke", "#ADADAD")
        .attr("stroke-width", "s2")
};



// #############################################################################
//                              VRAGEN!!!!
// #############################################################################

// 1. Hoe meer children toevoegen zonder dat hij te langzaam word?
// 2. jinja?
