/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Final project
Context: This is the initializer class. In this class all the date get loaded
         and the update functions are created.
******************************************************************************/

// import data wheb window is loaded
window.onload = function() {
    importData();
}

// load data
function importData() {
    d3.json("./Data/updatePieData.json").then(function(data6) {
        d3.json("./Data/groupedBarChart2.json").then(function(data5) {
            d3.json("./Data/circleData.json").then(function(data) {
                d3.json("./Data/bubbleData.json").then(function(data2) {
                    d3.json("./Data/groupedBarChart.json").then(function(data3) {
                        d3.json("./Data/pieChart.json").then(function(data4) {
                            circularPackingGraph(data, data2, true, data5, data6, data4, data3);
                            groupedBarChart(data3, data4);
                            pieChart(data4);
                        })
                    })
                })
            })
        })
    })
}

// this function changes the circularChart to the bubbleChart
function changeGraph(circleData, bubbleData, secondBarData, updatePieData, pieData, barData) {
    var duration = 750;
    var count = 0;

    // selects the change button
    d3.select("#toBubble").on("click", function() {
        var graph = this.getAttribute("value");
        var active = this.getAttribute("class");

        // checks if the button is not active
        if (active != "btn btn-info btn-secondary active") {
            var remove = d3.selectAll(".node")
            var removeCircle = d3.selectAll(".circleChart")
            var removeText = remove.selectAll(".circleText")
            var invisCircle = d3.select("#invisCircle")
            var counter = 0;

            // does callback only 1 time
            function callback() {
                if (counter == 0) {
                    remove.remove()
                    // removeText.remove()
                    bubblechart(bubbleData, secondBarData, updatePieData, circleData, pieData, barData);
                    counter = counter +1;

                    // remove tooltip
                    var tooltip = d3.select("#tooltip")
                                    .remove()
                }
            }
            // removes legend
            invisCircle.remove()

            // remove all circles
            removeCircle.transition()
                        .duration(duration)
                        .attr("opacity", 0)

            // remove all text
            removeText.transition()
                      .duration(duration)
                      .style("opacity", 0)
                      .on("end", callback)

            // create button for sorting the bubbleGraph
            var button = d3.select(".btn-group")
                           .append("button")

            // append atribute to the button
            button.text("Sorteren")
                .attr("class", "btn btn-info")
                .attr("type", "button")
                .attr("id", "sortButton")
                .attr("aria-pressed", "false")

            // create search button
            var searchButton = d3.select(".btn-group")
                                 .append("input")

            // append atributes to the searchbar
            searchButton.attr("placeholder", "Zoek school")
                        .attr("type", "text")
                        .attr("name", "search")
                        .attr("id", "search")
                        .attr("class", "form-control")

            // add result for searchbar
            var result = d3.select(".resultDiv")

            // append atributes to searchbar
            result.attr("class", "list-group")
                  .attr("id", "result")

            // add searchBar
            searchBar(secondBarData, updatePieData);
        }
    })
}

// searches school or province in database for searchbar
function searchBar(secondBarData, updatePieData) {
    $(document).ready(function() {
        $('#search').keyup(function() {
            $('#result').html('');
            var searchField = $('#search').val();
            var expression = new RegExp(searchField, "i");
            var lala;
            d3.json("./Data/bubbleData.json").then(function(data) {
                $.each(data, function(key, value) {
                    // shows the search result
                    if (value.name.search(expression) != -1 || value.province.search(expression) != -1) {
                        $('#result').append('<li class="list-group-item" value="'+value.name+'"> '+value.name+' | <span class="text-muted"> '+value.province+' </span></li>');
                    }
                })
                // append onclick function for search results
                selectSchool(secondBarData, updatePieData)
            })
        })
    })
}

// creates a on click function to the search results
// this function changes the graphs according to the chosen school
function selectSchool(secondBarData, updatePieData) {
    // select all listed schools
    d3.selectAll(".list-group-item").on("click", function(d) {

        // get the selected name
        var nameClass = this.getAttribute("value");
        var selector = "#" + nameClass;
        selector = selector.replace(/\s/g, '_');
        selector = selector.replace(",", "");

        // remove all search results after selection
        var ul = d3.selectAll(".list-group-item")
                    .remove()

        // changes bar and pie graph
        udatePieAndBar(secondBarData, updatePieData, nameClass)

        // select corresponding bubble of selection
        var bubble = d3.select(selector)

        // shows selection in bubblechart
        bubble.attr("opacity", 1)
                .style("fill", "white")
    })
}

// update from bubble graph
function updateElements2(secondBarData, updatePieData) {
    d3.selectAll(".bubble").on("click", function(d) {
        // selected name
        var name = d.name;

        // changes bar and pie graph
        udatePieAndBar(secondBarData, updatePieData, name, d)

        // show selected bubble
        d3.select(this)
            .attr("opacity", 1)
            .style("fill", "white")
    })
}

// get the margins from an object
function getMargins(graph) {
    // get margins from container
    var selection = d3.select(graph)
                      .node()
                      .getBoundingClientRect()

    var margins = {}
    var height = selection["height"]
    var width = selection["width"]

    // put margins in dict
    margins["height"] = height
    margins["width"] = width

    return margins;
}
// getMargins("#graph1")


// changes the pie and bar chart according to the selection
function udatePieAndBar(secondBarData, updatePieData, name, d) {
    // get margins from container
    var margins = getMargins("#graph1")

    // set the color scale
    var color = d3.scaleOrdinal()
                  .domain(function(d) { return d.province})
                  .range(["#E27D60", "#37B5FF", "#E8A87C", "#C38D9E", "#FAC2C1", "#85DCB2", "#41B3A3", "F9FF49", "B5F569" ,"#EFE2BA", "#F4976C", "63FF53"])

    // change opacity and reset color to old colorscale
    var bub = d3.selectAll(".bubble")
    bub.attr("opacity", 0.5)
       .style("fill", function(d) { return color(d.province)})

    // select barchart svg
    var svg = d3.select(".containerGraph2")
                .select("svg")
                .select("g");

    // change barchart title
    svg.select(".title")
       .text(name);

    // remove old title of barGraph
    svg.select(".secondLineTitle")
       .remove()

    // add second title barGraph
    svg.append("text")
       .attr("class", "secondLineTitle")
       .attr("y", 45)
       .attr("x", 130)
       .text("Eindexamen cijfers van het:")
       .attr("font-size", 22)
       .style("fill", "white")
       .attr("opacity", 0.9)

    // select the bubblechart svg
    var svgBubble = d3.select("#graph1")
                      .select("svg")

    // remove old school title from the bubblechart
    svgBubble.selectAll(".school")
             .remove();

    // append attributes to school title
    svgBubble.append("text")
             .attr("class", "school")
             .attr("text-anchor", "middle")
             .attr("x", margins.width/2)
             .attr("y", margins.height /15)
             .attr("font-size", function() {
                 if (name.length > 23) {
                     return margins.width / 16;
                 }
                 else {
                     return margins.width / 12;
                 }
             })
             .attr("font-family", "Arial")
             .transition()
             .duration(500)
             .attr("opacity", 0.9)
             .text(name)

    // change data for barchart
    var formattedData = reformData2(secondBarData[name])

    // update bar and pie chart
    makeBarGraphUpdate(formattedData)
    updatePie(updatePieData[name])
}

// reform data for bubble chart
function reformData2(data) {
    var list = [];
    for (var i = 0; i < Object.values(data).length; i++) {
        var dict = {}
        dict["name"] = Object.keys(data)[i];
        dict["field1"] = Object.values(data)[i][0];
        dict["field2"] = Object.values(data)[i][1];
        dict["field3"] = Object.values(data)[i][2];
        dict["field4"] = Object.values(data)[i][3];
        list.push(dict);
    }
    return list;
}

// update bar and pie chart from circular chart
function updateElements(data, data4) {
    // select all nodes from circle chart
    d3.selectAll('.node').on('click', function(d) {
        // select barchart svg
        var svg = d3.select(".containerGraph2")
                    .select("svg")
                    .select("g")

        // change title from barchart
        var title = svg.select(".title")

        // check depth of circular chart
        if (d.depth == 0) {
            // changes bargraph title
            title.text("Eindexamen cijfers van Nederland")
            // reform data
            dataChange = reformData(data);
        }
        else if (d.depth == 1) {
            // changes bargraph title
            title.text("Eindexamen cijfers van " + d.data.name)
            // change data to the correct format
            provinceName = d.data.name;
            changeData = data[provinceName]
            dataChange = reformData(changeData)
        }
        else if (d.depth == 2) {
            // changes bargraph title
            title.text(d.data.name + " eindexamen cijfers van " + d.parent.data.name)
            // change data to the correct format
            provinceName = d.parent.data.name;
            var levelName = d.data.name;
            changeData = data[provinceName][levelName]
            dataChange = reformData2(changeData)
        }
        // updates the bar and pie chart
        makeBarGraphUpdate(dataChange)
        checkPieDepth(d, data4)
    })
}


// updates the bargraph
function makeBarGraphUpdate(dataChange) {
    // get margins from container
    var margins = getMargins(".containerGraph2")

    const padding = 0.25/ 2
    const margin = {top: 80, bottom: 180, right: 0, left: 120};

    var duration = 1000;
    var changedData;
    var provinceName;
    var dataChange;

    // select barchart svg
    var svg = d3.select(".containerGraph2")
                .select("svg")
                .select("g")

    // update names for x-axis
    var names = [];
    for (var name of dataChange) {
      names.push(name.name)
    }

    // Create a scale for x-axis
    var xScale = d3.scaleBand()
                   .domain(names)
                   .range([margin.left, margins.width - margin.right])
                   .paddingInner(padding);

    // Create a second scale for x-axis
    var xScale1 = d3.scaleBand()
                    .domain(['field1', 'field2', 'field3', 'field4'])
                    .range([0, xScale.bandwidth()])
                    .padding(0.2);

    // Create a scale for y-axis
    var yScale = d3.scaleLinear()
                 .domain([0, 10])
                 .range([margins.height - margin.bottom, margin.top]);

    // Create x-axis
    const xAxis = d3.axisBottom()
                    .scale(xScale);

    // appand atributes to the xAxis
    svg.select(".xAxis")
       .transition()
       .duration(duration)
       .attr('transform', 'translate(0, ' + (margins.height - margin.bottom) + ')')
       .call(xAxis)
       .selectAll("text")
       .style("text-anchor", "end")
       .attr("dx", "-.8em")
       .attr("dy", ".15em")
       .attr("transform", "rotate(-45)" );


    // update old bars data
    var updateGroup = svg.selectAll(".barGroup")
                         .data(dataChange);

    // appand new g elements
    updateGroup.enter().append("g")
                       .attr("class", "barGroup")
                       .merge(updateGroup)
                       .attr("transform", function(d) { return "translate(" + xScale(d.name) + "," + margin.top + ")"})

    // function to update the bars
    function updateBarGroup(number, color) {
        // appand new g elements
        var updateGroup = svg.selectAll(".barGroup")
                             .data(dataChange);

        updateGroup.enter().append("g")
                        .merge(updateGroup)

        // update data for bargroups
        var uBars = updateGroup.selectAll(".field" + number)
                               .data(function(d) { return [d] })

        // append new bars to new bargroups
        uBars.enter().append("rect")
                     .attr("class", "bar field" + number)
                     .merge(uBars)
                     .style("fill", color)
                     .attr("x", function(d) { return xScale1('field'+ number) })
                     .transition()
                     .duration(duration)
                     .attr("height", d => {
                         return margins.height - margin.bottom - yScale(d["field" + number])
                     })
                     .attr("y", function(d) { return yScale(d["field" + number]) - margin.top})
                     .attr("width", xScale1.bandwidth());

        // append mouse effects
        updateGroup.selectAll("rect").attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("stroke-opacity", 0)
                    .on("mouseenter", handleMouseOverBar)
                    .on("mouseout", handleMouseOutBar);

        // Remove old rects as needed.
        updateGroup.exit().remove();

    }
    // make bars
    updateBarGroup("1", "#E8A87C")
    updateBarGroup("2", "#85DCB2")
    updateBarGroup("3", "#C38D9E")
    updateBarGroup("4", "#41B3A3")
}

// this functions changes the pie data to selected item from circular chart
function checkPieDepth(d, data4) {
    // check selection depth circular chart
    if (d.depth == 0) {
    // reform data
     dataChange = data4.values;
    }
    else if (d.depth == 1) {
     // change to the right data
     provinceName = d.data.name;
     dataChange = data4[provinceName].values
    }
    else if (d.depth == 2) {
        // changes to the right data
        provinceName = d.parent.data.name;
        levelName = d.data.name;
        changeData = data4[provinceName][levelName]
        // creates new dataset from old datasets
        var passed = 0;
        var failed = 0;
        for (var items of Object.values(changeData)) {
            passed += items.Geslaagd
            failed += items.Gezakt
        }
        dataChange =  {"Geslaagd": passed, "Gezakt": failed}
    }
    // udate the pie chart
    updatePie(dataChange)
}

// this function updates the piechart
function updatePie(dataChange) {
    // update pie
    var duration = 750;
    var changedData;
    var provinceName;
    var DataChange;
    var margin = 150;
    var padding = 5;

    // get margins from container
    var margins = getMargins(".containerGraph3")

    // radius of the piechart
    var radius = (Math.min(margins.width, margins.height) / 2 - margin)

    // persentages
    var persentageFailed = ((dataChange.Gezakt / (dataChange.Geslaagd + dataChange.Gezakt)) * 100).toFixed(1);
    var persentagePassed = ((dataChange.Geslaagd / (dataChange.Geslaagd + dataChange.Gezakt)) * 100).toFixed(1);

    // create layout for the data
    var pie = d3.pie()
                .value(function(d) {return d.value; })

    // update layout for the data
    var layout = pie(d3.entries(dataChange))

    // radius of the piechart
    var secondRadius = radius + 100;

    // select svg from piechart
    var svg = d3.select(".pieSVG")
                        .select("g")

    // select the pie elements and add the layout
    var updatePie = svg.selectAll('.pathPie2')
                       .data(layout)

    // build arc for pie
    var arcGenerator2 = d3.arc()
                          .innerRadius(radius + padding)
                          .outerRadius(secondRadius)

    // update pie
    updatePie.enter()
             .append('path')
             .merge(updatePie)
             .transition()
             .duration(1000)
             .attr('d', arcGenerator2)

    // remove old text
    svg.selectAll(".pieText")
       .transition()
       .duration(200)
       .attr("opacity", 0)
       .remove()

    // update to new text
    svg.selectAll("pie2")
       .data(layout)
       .enter()
       .append('text')
       .attr("class", "pieText")
       .style('fill', 'white')
       .text(function(d){ return d.data.key})
       .attr("transform", function(d) { return "translate(" + arcGenerator2.centroid(d) + ")";  })
       .style("text-anchor", "middle")
       .style("font-size", 17)
       .transition()
       .duration(1000)
       .attr("opacity", 1)

    // append the mouseover funct9ons
    updatePie.on("mouseenter", handleMouseOverPieUpdate)
             .on("mouseout", handleMouseOutPieUpdate)

    // removes old elements
    updatePie.exit().remove()

    // creates moouseover elements
    function handleMouseOverPieUpdate() {
        // remove old elements
        svg.selectAll(".persentage").remove();

        // select this item
        d3.select(this)
          .attr("stroke", "white")
          .style("stroke-width", "3px")
          .style("stroke-opacity", 0.6)

        // append text to the side of the pie
        svg.append("text")
           .attr("class", "persentage")
           .text("Geslaagd: " + persentagePassed + "%")
           .attr("x", margins.width / 5)
           .attr("y", -margins.height / 2.3)
           .transition().duration(200)
           .attr("opacity", 0.9)

        // append text
        svg.append("text")
           .attr("class", "persentage")
           .text("Gezakt: " + persentageFailed + "%")
           .attr("x", margins.width / 5)
           .attr("y", -margins.height / 2.3 + 30)
           .transition().duration(200)
           .attr("opacity", 0.9)

        svg.attr("font-size", 24)
           .attr("font-family", "Arial")
           .attr("color", "white")
    }

    function handleMouseOutPieUpdate() {
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
