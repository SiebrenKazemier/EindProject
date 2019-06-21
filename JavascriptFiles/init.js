/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Final project
******************************************************************************/
window.onload = function() {
    importData();
}

// load data
function importData() {
    d3.json("/Data/updatePieData.json").then(function(data6) {
        d3.json("/Data/groupedBarChart2.json").then(function(data5) {
            d3.json("/Data/circleData.json").then(function(data) {
                d3.json("/Data/bubbleData.json").then(function(data2) {
                    d3.json("/Data/groupedBarChart.json").then(function(data3) {
                        d3.json("/Data/pieChart.json").then(function(data4) {
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

function changeGraph(circleData, bubbleData, secondBarData, updatePieData, pieData, barData) {
    var duration = 750;
    var count = 0;

    d3.select("#toBubble")
    .on("click", function() {
        var graph = this.getAttribute("value");
        var active = this.getAttribute("class");

        if (active != "btn btn-info btn-secondary active") {
            var remove = d3.selectAll(".node")
            var removeCircle = d3.selectAll("circle")
            var removeText = remove.selectAll("text")
            var counter = 0;

            // does callback only 1 time
            function callback() {
                if (counter == 0) {
                    remove.remove()
                    removeText.remove()
                    bubblechart(bubbleData, secondBarData, updatePieData, circleData, pieData, barData);
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

            // create search button
            var searchButton = d3.select(".btn-group")
                                .append("input")

            // add atributes
            searchButton.attr("placeholder", "Zoek school")
                        .attr("type", "text")
                        .attr("name", "search")
                        .attr("id", "search")
                        .attr("class", "form-control")

            // add result
            var result = d3.select(".resultDiv")
            result.attr("class", "list-group")
                    .attr("id", "result")

            // add searchBar
            searchBar(secondBarData, updatePieData);

        }
    })
}

// searches school in database
function searchBar(secondBarData, updatePieData) {
    $(document).ready(function() {
        $('#search').keyup(function() {
            $('#result').html('');
            var searchField = $('#search').val();
            var expression = new RegExp(searchField, "i");
            var lala;
            d3.json("bubbleData.json").then(function(data) {
                $.each(data, function(key, value) {
                    if (value.name.search(expression) != -1 || value.province.search(expression) != -1) {
                        $('#result').append('<li class="list-group-item" value="'+value.name+'"> '+value.name+' | <span class="text-muted"> '+value.province+' </span></li>');
                    }
                })
                selectSchool(secondBarData, updatePieData)
            })
        })
    })
}

function selectSchool(secondBarData, updatePieData) {
    // select all listed schools
    d3.selectAll(".list-group-item").on("click", function() {
        // remove old strokes
        var bub = d3.selectAll(".bubble")
        bub.style("stroke-width", 2)
            .attr("stroke-opacity", 0.6)

        // get schoolname
        var nameClass = this.getAttribute("value");
        var selector = "#" + nameClass;
        selector = selector.replace(/\s/g, '_');
        selector = selector.replace(",", "");

        // remove all ul elements after selection
        var ul = d3.selectAll(".list-group-item")
                    .remove()

        // select chosen bubble
        var bubble = d3.select(selector)

        // shows selection in bubblechart
        bubble.attr("stroke", "white")
                    .style("stroke-width", 3)
                    .style("stroke-opacity", 1)

        // update from school selection
        // select svg
        var svg = d3.select(".containerGraph2")
                    .select("svg")
                    .select("g");

        // change title
        var title = svg.select(".title")
                        .text(nameClass);

        // remove old title
        svg.select(".secondLineTitle")
            .remove()

        // add second title
        svg.append("text")
            .attr("class", "secondLineTitle")
            .attr("y", 45)
            .attr("x", 130)
            .text("Eindexamen cijfers van het:")
            .attr("font-size", 22)
            .style("fill", "white")
            .attr("opacity", 0.9)

        // change data
        var formattedData = reformData2(secondBarData[nameClass])
        makeBarGraphUpdate(formattedData)
        updatePie(updatePieData[nameClass])
    })
}


// update from bubble graph
function updateElements2(secondBarData, updatePieData) {
    d3.selectAll(".bubble").on("click", function(d) {
        // remove old strokes
        var bub = d3.selectAll(".bubble")
        bub.style("stroke-width", 2)
            .attr("stroke-opacity", 0.6)

        // select svg
        var svg = d3.select(".containerGraph2")
                    .select("svg")
                    .select("g");

        // change title
        var title = svg.select(".title")
                        .text(d.name);


        // remove old title
        svg.select(".secondLineTitle")
            .remove()

        // add second title
        svg.append("text")
            .attr("class", "secondLineTitle")
            .attr("y", 45)
            .attr("x", 130)
            .text("Eindexamen cijfers van het:")
            .attr("font-size", 22)
            .style("fill", "white")
            .attr("opacity", 0.9)


        // change data
        var formattedData = reformData2(secondBarData[d.name])
        makeBarGraphUpdate(formattedData)
        updatePie(updatePieData[d.name])
    })
}

// reform data
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

// update from circle graph
function updateElements(data, data4) {
    // update barChart and pieChart
    d3.selectAll('.node').on('click', function(d) {
        // select svg
        var svg = d3.select(".containerGraph2")
                    .select("svg")
                    .select("g")

        // change title
        var title = svg.select(".title")

        if (d.depth == 0) {
            title.text("Eindexamen cijfers van Nederland")
            // reform data
            dataChange = reformData(data);
        }
        else if (d.depth == 1) {
            title.text("Eindexamen cijfers van " + d.data.name)

            provinceName = d.data.name;
            changeData = data[provinceName]
            // change to the right data
            dataChange = reformData(changeData)
        }
        else if (d.depth == 2) {
            title.text(d.data.name + " eindexamen cijfers van " + d.parent.data.name)
            // reform data
            provinceName = d.parent.data.name;
            var levelName = d.data.name;
            changeData = data[provinceName][levelName]
            dataChange = reformData2(changeData)
        }
        makeBarGraphUpdate(dataChange)
        checkPieDepth(d, data4)
    })

}


// updates the graph
function makeBarGraphUpdate(dataChange) {
    // get margins from container
    var selection = d3.select(".containerGraph2")
                    .node().getBoundingClientRect()

    var height = selection["height"]
    var width = selection["width"]

    const padding = 0.25/ 2
    const margin = {top: 80, bottom: 180, right: 0, left: 120};

    var duration = 1000;
    var changedData;
    var provinceName;
    var dataChange;

    // select svg
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
                    .range([margin.left, width - margin.right])
                    .paddingInner(padding);

    // Create a scale for x-axis
    var xScale1 = d3.scaleBand()
                    .domain(['field1', 'field2', 'field3', 'field4'])
                    .range([0, xScale.bandwidth()])
                    .padding(0.2);

    // Create a scale for y-axis
    var yScale = d3.scaleLinear()
                 .domain([0, 10])
                 .range([height - margin.bottom, margin.top]);

    // Create x-axis
    const xAxis = d3.axisBottom()
            .scale(xScale);

    // change the x axis
    svg.select(".xAxis")
        .transition()
        .duration(duration)
        .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
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

    // update bars
    function updateBarGroup(number, color) {
        // appand new g elements
        var updateGroup = svg.selectAll(".barGroup")
                                .data(dataChange);

        updateGroup.enter().append("g")
                        .merge(updateGroup)


        var uBars = updateGroup.selectAll(".field" + number)
                            .data(function(d) { return [d] })

        uBars.enter().append("rect")
                        .attr("class", "bar field" + number)
                        .merge(uBars)
                        .style("fill", color)
                        .attr("x", function(d) { return xScale1('field'+ number) })
                        .transition()
                        .duration(duration)
                        .attr("height", d => {
                            return height - margin.bottom - yScale(d["field" + number])
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

function checkPieDepth(d, data4) {
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
        provinceName = d.parent.data.name;
        levelName = d.data.name;
        changeData = data4[provinceName][levelName]

        var passed = 0;
        var failed = 0;
        for (var items of Object.values(changeData)) {
            passed += items.Geslaagd
            failed += items.Gezakt
        }
        dataChange =  {"Geslaagd": passed, "Gezakt": failed}
    }
    updatePie(dataChange)
}

function updatePie(dataChange) {
    // update pie
    var duration = 750;
    var changedData;
    var provinceName;
    var DataChange;
    var margin = 150;
    var padding = 5;

    // get container width and height
    var selection = d3.select(".containerGraph3")
                    .node().getBoundingClientRect()

    var height = selection["height"]
    var width = selection["width"]

    // radius of the piechart
    var radius = (Math.min(width, height) / 2 - margin)

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

    // select svg
    var svg = d3.select(".pieSVG")
                        .select("g")

    // select the pie
    var updatePie = svg.selectAll('.pathPie2')
                        .data(layout)

    // build arc
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

    // remove text
    svg.selectAll(".pieText")
            .transition()
            .duration(200)
            .attr("opacity", 0)
            .remove()

    // update text
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


    updatePie.on("mouseenter", handleMouseOverPieUpdate)
            .on("mouseout", handleMouseOutPieUpdate)

    updatePie.exit().remove()

    function handleMouseOverPieUpdate() {
        svg.selectAll(".persentage").remove();

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
        .attr("opacity", 0.9)

        // append text
        svg.append("text")
        .attr("class", "persentage")
        .text("Gezakt: " + persentageFailed + "%")
        .attr("x", width / 5)
        .attr("y", -height / 2.3 + 30)
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
