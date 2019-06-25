/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Final project
Context: This is the grouped bar chart class. In this class the grouped bar
         chart is created.
******************************************************************************/

// this function changes the data to usable data for the grouped bar chart
function reformData(data) {
    var list = [];
    for (var i = 0; i < Object.values(data.values).length; i++) {
        var dict = {}
        dict["name"] = Object.keys(data.values)[i];
        dict["field1"] = Object.values(data.values)[i][0];
        dict["field2"] = Object.values(data.values)[i][1];
        dict["field3"] = Object.values(data.values)[i][2];
        dict["field4"] = Object.values(data.values)[i][3];
        list.push(dict);
    }
    return list;
}

// this function creates the barchart
function groupedBarChart(data, pieData) {
    // get margins from container
    var margins = getMargins(".containerGraph2")
    const padding = 0.25/ 2
    const margin = {top: 80, bottom: 180, right: 0, left: 120};

    // make svg
    const svg = d3.select(".containerGraph2")
                  .append("svg")
                  .attr("width", margins.width)
                  .attr("height", margins.height)
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
                   .range([margin.left, margins.width - margin.right])
                   .paddingInner(padding);

    // Create a second scale for the different bar x-axis
    var xScale1 = d3.scaleBand()
                    .domain(['field1', 'field2', 'field3', 'field4'])
                    .range([0, xScale.bandwidth()])
                    .padding(0.2);

    // Create a scale for y-axis
    var yScale = d3.scaleLinear()
                   .domain([0, 10])
                   .range([margins.height - margin.bottom, margin.top]);

    // Create y-axis
    const yAxis = d3.axisLeft()
                    .scale(yScale);

    // Create x-axis
    const xAxis = d3.axisBottom()
                    .scale(xScale);

    // create a bargroup (g element)
    var barGroup = svg.selectAll(".barGroup")
                      .data(reformedData)
                      .enter().append("g")
                      .attr("class", "barGroup")
                      .attr("transform", function(d) { return "translate(" + xScale(d.name) + "," + margin.top + ")"});

    // this function appends the bars to the bargroups
    function makeBarGroup(number, color) {
        // Add field bars
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
                    return margins.height - margin.bottom - yScale(d["field" + number])
                })
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("stroke-opacity", 0)
    }
    // make all bars
    makeBarGroup("1", "#E8A87C")
    makeBarGroup("2", "#85DCB2")
    makeBarGroup("3", "#C38D9E")
    makeBarGroup("4", "#41B3A3")

    // append mouse effects
    barGroup.selectAll("rect")
            .on("mouseenter", handleMouseOverBar)
            .on("mouseout", handleMouseOutBar)

    // add correct margins to x axis
    svg.append("g")
       .attr('transform', 'translate(0, ' + (margins.height - margin.bottom) + ')')
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

    // create text near y-axis
    var text = svg.append("text")

    // append labbel text to g element
    text.attr("class", "label")
        .attr("x", -(margins.height+margin.top)/ 3)
        .attr("y", margin.left-25)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Gemiddelde cijfer")

    // create a title for the graph
    var title = svg.append("text")

    // append atributes to title
    title.attr("class", "title")
         .attr("x", margin.left + 10)
         .attr("y", margin.top -10)
         .attr("font-size", 22)
         .style("fill", "white")
         .attr("opacity", 0.9)
         .text("Eindexamen cijfers van Nederland")
}

// this function creates a mousover event for the bars
function handleMouseOverBar(data) {
    const margin = {top: 80, bottom: 180, right: 0, left: 120};

    // select this element
    d3.select(this)
      .style("stroke-opacity", 0.8)

    // select svg
    var svg = d3.select("#graph2")
                .select("svg")

    // remove old text elements
    svg.selectAll(".cijfer").remove();

    // this function creates the right text for the bars
    function appendText(number) {
        var exam;
        if (number == 1) {
            exam = "School examen cijfer: "
        }
        else if (number == 2) {
            exam = "Centraal examen cijfer: "
        }
        else if (number == 3) {
            exam = "Cijferlijst cijfer: "
        }
        else if (number == 4) {
            exam = "Landelijk gemiddelde cijfer: "
        }

        // this function appends the grade text
        function appendGrade(number, exam) {
            // add grade text
            svg.append("text")
               .text(data.name)
               .attr("class", "cijfer")
               .attr("font-size", 20)
               .attr("x", margin.left + 10)
               .attr("y", margin.top + 15)
            // append grade number
            svg.append("text")
               .text(exam + data["field" + number])
               .attr("class", "cijfer")
               .attr("font-size", 16)
               .attr("x", margin.left + 10)
               .attr("y", margin.top + 35)
        }
        appendGrade(number, exam);
    }
    // append text to selected bar number
    appendText(this.className.animVal[9])

    // adds transition to text
    svg.selectAll(".cijfer")
       .transition()
       .duration(50)
       .attr("opacity", 0.9)
}

// handles mouse function
function handleMouseOutBar() {
    d3.select(this)
        .style("stroke-opacity", 0)

    // select svg element
    var svg = d3.select("#graph2")
                .select("svg");

    // removes text slowly
    svg.selectAll(".cijfer")
       .transition()
       .duration(1000)
       .attr("opacity", 0).remove();
}
